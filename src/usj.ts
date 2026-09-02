export type UsjNode =
  | string
  | {
      type?: string;
      marker?: string;
      number?: string | number;
      loc?: string;
      content?: UsjNode[];
    };

export type UsjDocument = {
  type?: string;
  version?: string;
  content?: UsjNode[];
};

export type VerseRow = {
  n: number;
  t: string;
  h?: string;
  s?: string;
  r?: string;
};

const SKIP_PARA = new Set(["h", "mt1", "mt2", "toc1", "toc2", "toc3"]);

export function plainText(nodes: UsjNode | UsjNode[] | undefined): string {
  const parts: string[] = [];
  walk(nodes, (kind, value) => {
    if (kind === "text") parts.push(value);
  });
  return parts.join("").replace(/\s+/g, " ").trim();
}

export function unwrapRefParens(text: string): string {
  return String(text || "")
    .trim()
    .replace(/^\(\s*/, "")
    .replace(/\s*\)$/, "");
}

export function chapterNodes(content: UsjNode[] | undefined, chapter: number): UsjNode[] {
  const nodes = Array.isArray(content) ? content : [];
  const start = nodes.findIndex((node) => isChapterMilestone(node, chapter));
  if (start < 0) return [];
  const rest = nodes.slice(start + 1);
  const stop = rest.findIndex((node) => isChapterMilestone(node));
  return stop < 0 ? rest : rest.slice(0, stop);
}

export function verseRows(nodes: UsjNode[]): VerseRow[] {
  let heading = "";
  let sub = "";
  let refs = "";
  let current: VerseRow | null = null;
  const rows: VerseRow[] = [];

  walk(nodes, (kind, value) => {
    if (kind === "s1") {
      heading = value;
      return;
    }
    if (kind === "s2") {
      sub = value;
      return;
    }
    if (kind === "r") {
      refs = unwrapRefParens(value);
      return;
    }
    if (kind === "verse") {
      const n = Number.parseInt(value, 10);
      current = { n, t: "" };
      if (heading) current.h = heading;
      if (sub) current.s = sub;
      if (refs) current.r = refs;
      heading = "";
      sub = "";
      refs = "";
      rows.push(current);
      return;
    }
    if (kind === "text" && current) current.t += value;
  });

  for (const row of rows) {
    row.t = row.t.replace(/\s+/g, " ").trim();
  }
  return rows.filter((row) => row.n >= 1 && row.t);
}

export function versesFromUsj(doc: UsjDocument, chapter: number): VerseRow[] {
  return verseRows(chapterNodes(doc.content, chapter));
}

export function bookFromUsj(doc: UsjDocument): Record<string, VerseRow[]> {
  const chapters: Record<string, VerseRow[]> = {};
  const nodes = Array.isArray(doc.content) ? doc.content : [];
  for (const node of nodes) {
    if (!isChapterMilestone(node)) continue;
    const chapter = Number.parseInt(String((node as { number?: string | number }).number || ""), 10);
    if (!Number.isFinite(chapter) || chapter < 1) continue;
    const rows = verseRows(chapterNodes(nodes, chapter));
    if (rows.length) chapters[String(chapter)] = rows;
  }
  return chapters;
}

export function buildBibleIndex(books: Array<{ book: string; doc: UsjDocument }>): Record<string, VerseRow[]> {
  const index: Record<string, VerseRow[]> = {};
  for (const { book, doc } of books) {
    const chapters = bookFromUsj(doc);
    for (const [chapter, rows] of Object.entries(chapters)) {
      index[`${book}.${chapter}`] = rows;
    }
  }
  return index;
}

function isChapterMilestone(node: UsjNode, number?: number): boolean {
  if (!node || typeof node === "string") return false;
  if (node.type !== "chapter") return false;
  if (number == null) return true;
  return Number.parseInt(String(node.number || ""), 10) === number;
}

type WalkKind = "text" | "verse" | "s1" | "s2" | "r";

function walk(nodes: UsjNode | UsjNode[] | undefined, visit: (kind: WalkKind, value: string) => void): void {
  const list = Array.isArray(nodes) ? nodes : nodes == null ? [] : [nodes];
  for (const node of list) walkNode(node, visit);
}

function walkNode(node: UsjNode, visit: (kind: WalkKind, value: string) => void): void {
  if (typeof node === "string") {
    visit("text", node);
    return;
  }
  if (!node || typeof node !== "object") return;

  const type = node.type;
  const marker = String(node.marker || "");
  if (type === "verse") {
    visit("verse", String(node.number || ""));
    return;
  }
  if (type === "para" && marker === "s1") {
    const text = plainText(node.content);
    if (text) visit("s1", text);
    return;
  }
  if (type === "para" && marker === "s2") {
    const text = plainText(node.content);
    if (text) visit("s2", text);
    return;
  }
  if (type === "para" && marker === "r") {
    const text = plainText(node.content);
    if (text) visit("r", text);
    return;
  }
  if (type === "note" || (type === "para" && SKIP_PARA.has(marker))) return;
  walk(node.content, visit);
}
