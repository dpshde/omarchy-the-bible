#!/usr/bin/env python3
"""Bounded no-follow I/O for ~/.local/state/.../route-bible.json."""

from __future__ import annotations

import os
import stat
import sys

MAX_CAP = 1_000_000


def fail(message: str = "") -> None:
    if message:
        sys.stderr.write(message + "\n")
    raise SystemExit(1)


def require_path(path: str) -> None:
    if not path.startswith("/") or path.endswith("/"):
        fail("path")
    parts = path.split("/")
    if any(part == ".." for part in parts):
        fail("path")


def require_stat(st: os.stat_result, max_bytes: int) -> None:
    if stat.S_ISLNK(st.st_mode):
        fail("symlink")
    if not stat.S_ISREG(st.st_mode):
        fail("not regular")
    if st.st_uid != os.getuid():
        fail("owner")
    if st.st_mode & 0o022:
        fail("mode")
    if st.st_size > max_bytes:
        fail("size")


def cmd_check(path: str, max_bytes: int) -> None:
    try:
        st = os.lstat(path)
    except FileNotFoundError:
        sys.stdout.write("missing\n")
        return
    require_stat(st, max_bytes)
    sys.stdout.write("ok\n")


def cmd_read(path: str, max_bytes: int) -> None:
    fd = os.open(path, os.O_RDONLY | os.O_NOFOLLOW)
    try:
        require_stat(os.fstat(fd), max_bytes)
        data = os.read(fd, max_bytes + 1)
        if len(data) > max_bytes:
            fail("size")
        sys.stdout.buffer.write(data)
    finally:
        os.close(fd)


def open_tmp(tmp: str) -> int:
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW
    try:
        return os.open(tmp, flags, 0o600)
    except FileExistsError:
        st = os.lstat(tmp)
        if stat.S_ISLNK(st.st_mode) or not stat.S_ISREG(st.st_mode) or st.st_uid != os.getuid():
            fail("tmp")
        os.unlink(tmp)
        return os.open(tmp, flags, 0o600)


def cmd_write(path: str, max_bytes: int) -> None:
    if "ROUTE_BIBLE_STATE" in os.environ:
        data = os.environ["ROUTE_BIBLE_STATE"].encode("utf-8")
    else:
        data = sys.stdin.buffer.read(max_bytes + 1)
    if len(data) > max_bytes:
        fail("size")
    parent = os.path.dirname(path)
    if parent:
        os.makedirs(parent, mode=0o700, exist_ok=True)
    tmp = path + ".tmp"
    fd = open_tmp(tmp)
    try:
        os.fchmod(fd, 0o600)
        written = 0
        while written < len(data):
            written += os.write(fd, data[written:])
        os.fsync(fd)
    except Exception:
        os.close(fd)
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise
    os.close(fd)
    os.replace(tmp, path)


def main() -> None:
    if len(sys.argv) != 4:
        fail("usage: safe-state.py check|read|write PATH MAX")
    action, path, max_raw = sys.argv[1], sys.argv[2], sys.argv[3]
    if action not in ("check", "read", "write"):
        fail("action")
    require_path(path)
    try:
        max_bytes = int(max_raw)
    except ValueError:
        fail("max")
    if max_bytes < 1 or max_bytes > MAX_CAP:
        fail("max")
    if action == "check":
        cmd_check(path, max_bytes)
    elif action == "read":
        cmd_read(path, max_bytes)
    else:
        cmd_write(path, max_bytes)


if __name__ == "__main__":
    main()
