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

export type PubPart = {
  n: number;
  t: string;
  wj: boolean;
  showNum: boolean;
};

export type PubBlock = {
  kind: "heading" | "subhead" | "refs" | "blank" | "para" | "q1" | "q2" | "d" | "li";
  spaced: boolean;
  indent: number;
  text: string;
  parts: PubPart[];
};

export function publicationFromUsj(doc: UsjDocument, chapter: number): PubBlock[] {
  return publicationFromNodes(chapterNodes(doc.content, chapter));
}

export function bookPublicationFromUsj(doc: UsjDocument): Record<string, PubBlock[]> {
  const chapters: Record<string, PubBlock[]> = {};
  const nodes = Array.isArray(doc.content) ? doc.content : [];
  for (const node of nodes) {
    if (!isChapterMilestone(node)) continue;
    const chapter = Number.parseInt(String((node as { number?: string | number }).number || ""), 10);
    if (!Number.isFinite(chapter) || chapter < 1) continue;
    const blocks = publicationFromNodes(chapterNodes(nodes, chapter));
    if (blocks.length) chapters[String(chapter)] = blocks;
  }
  return chapters;
}

export function buildPublicationIndex(books: Array<{ book: string; doc: UsjDocument }>): Record<string, PubBlock[]> {
  const index: Record<string, PubBlock[]> = {};
  for (const { book, doc } of books) {
    const chapters = bookPublicationFromUsj(doc);
    for (const [chapter, blocks] of Object.entries(chapters)) {
      index[`${book}.${chapter}`] = blocks;
    }
  }
  return index;
}

function pubBlock(
  kind: PubBlock["kind"],
  text: string,
  spaced: boolean,
  indent: number,
  parts: PubPart[]
): PubBlock {
  return { kind, spaced, indent, text, parts };
}

function publicationFromNodes(nodes: UsjNode[]): PubBlock[] {
  const ctx = { verse: 0, seen: new Set<number>() };
  const blocks: PubBlock[] = [];
  let hadContent = false;

  for (const node of nodes) {
    if (!node || typeof node === "string" || node.type !== "para") continue;
    const marker = String(node.marker || "p");
    if (SKIP_PARA.has(marker)) continue;

    if (marker === "s1" || marker === "ms") {
      const text = plainText(node.content);
      if (!text) continue;
      blocks.push(pubBlock("heading", text, hadContent, 0, []));
      hadContent = true;
      continue;
    }
    if (marker === "s2") {
      const text = plainText(node.content);
      if (!text) continue;
      blocks.push(pubBlock("subhead", text, hadContent, 0, []));
      hadContent = true;
      continue;
    }
    if (marker === "r") {
      const text = unwrapRefParens(plainText(node.content));
      if (!text) continue;
      blocks.push(pubBlock("refs", text, false, 0, []));
      continue;
    }
    if (marker === "b") {
      blocks.push(pubBlock("blank", "", false, 0, []));
      continue;
    }

    const parts = collectParts(node.content, ctx);
    if (marker === "d") {
      const text = parts.map((part) => part.t).join(" ").trim() || plainText(node.content);
      if (!text && !parts.length) continue;
      blocks.push(pubBlock("d", text, hadContent, 0, parts));
      hadContent = true;
      continue;
    }

    if (!parts.length) continue;
    const kind: PubBlock["kind"] =
      marker === "q2" ? "q2" : marker.startsWith("q") ? "q1" : marker.startsWith("li") ? "li" : "para";
    const indent = marker === "q2" || marker === "li2" ? 2 : marker === "q1" || marker === "qr" || marker === "li1" ? 1 : 0;
    blocks.push(pubBlock(kind, parts.map((part) => part.t).join(" "), false, indent, parts));
    hadContent = true;
  }

  return blocks;
}

function collectParts(content: UsjNode[] | undefined, ctx: { verse: number; seen: Set<number> }): PubPart[] {
  const parts: PubPart[] = [];

  function push(text: string, wj: boolean) {
    if (!text) return;
    if (ctx.verse < 1) return;
    const last = parts[parts.length - 1];
    if (last && last.n === ctx.verse && last.wj === wj) {
      last.t += text;
      return;
    }
    const showNum = !ctx.seen.has(ctx.verse);
    ctx.seen.add(ctx.verse);
    parts.push({ n: ctx.verse, t: text, wj, showNum });
  }

  function walkInline(nodes: UsjNode[] | undefined, wj: boolean) {
    for (const node of Array.isArray(nodes) ? nodes : []) {
      if (typeof node === "string") {
        push(node, wj);
        continue;
      }
      if (!node || typeof node !== "object") continue;
      if (node.type === "verse") {
        const n = Number.parseInt(String(node.number || ""), 10);
        if (Number.isFinite(n) && n >= 1) ctx.verse = n;
        continue;
      }
      if (node.type === "note") continue;
      if (node.type === "char" && node.marker === "wj") {
        walkInline(node.content, true);
        continue;
      }
      walkInline(node.content, wj);
    }
  }

  walkInline(content, false);
  return parts
    .map((part) => ({ ...part, t: part.t.replace(/\s+/g, " ").trim() }))
    .filter((part) => part.t);
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
