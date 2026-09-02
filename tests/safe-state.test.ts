import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, symlinkSync, chmodSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const helper = join(dirname(fileURLToPath(import.meta.url)), "..", "safe-state.py");

function run(args: string[], opts: { input?: string; env?: NodeJS.ProcessEnv } = {}) {
  return spawnSync("python3", [helper, ...args], {
    encoding: "utf8",
    input: opts.input,
    env: opts.env ? { ...process.env, ...opts.env } : process.env
  });
}

describe("safe-state.py", () => {
  it("reports missing, reads a regular file, and rejects a symlink", () => {
    const dir = mkdtempSync(join(tmpdir(), "route-state-"));
    const path = join(dir, "route-bible.json");
    expect(run(["check", path, "2048"]).stdout.trim()).toBe("missing");

    writeFileSync(path, '{"book":"JHN"}', { mode: 0o600 });
    expect(run(["check", path, "2048"]).stdout.trim()).toBe("ok");
    expect(run(["read", path, "2048"]).stdout).toBe('{"book":"JHN"}');

    const link = join(dir, "link.json");
    symlinkSync(path, link);
    expect(run(["read", link, "2048"]).status).not.toBe(0);
    expect(run(["check", link, "2048"]).status).not.toBe(0);
  });

  it("rejects world-writable and oversized files", () => {
    const dir = mkdtempSync(join(tmpdir(), "route-state-"));
    const path = join(dir, "route-bible.json");
    writeFileSync(path, '{"book":"JHN"}', { mode: 0o600 });
    chmodSync(path, 0o666);
    expect(run(["check", path, "2048"]).status).not.toBe(0);

    chmodSync(path, 0o600);
    writeFileSync(path, "x".repeat(3000));
    expect(run(["read", path, "2048"]).status).not.toBe(0);
  });

  it("writes through O_NOFOLLOW replace and chmod 600", () => {
    const dir = mkdtempSync(join(tmpdir(), "route-state-"));
    const path = join(dir, "route-bible.json");
    const payload = '{"book":"ROM","chapter":8,"startVerse":28,"endVerse":30,"publication":false}';
    const result = run(["write", path, "2048"], { env: { ROUTE_BIBLE_STATE: payload } });
    expect(result.status).toBe(0);
    expect(readFileSync(path, "utf8")).toBe(payload);
    const mode = execFileSync("stat", ["-c", "%a %F", path], { encoding: "utf8" }).trim();
    expect(mode).toMatch(/^600 regular file$/);
    expect(existsSync(path + ".tmp")).toBe(false);
  });
});
