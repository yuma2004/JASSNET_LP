"""
jassmin-character.png から台紙・市松・グレー背景を除去。
白線（コア＋アンチエイリアス）とピンクのほっぺは保持。
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image


def is_blush(r: int, g: int, b: int) -> bool:
    return r >= 175 and g >= 95 and b >= 115 and r > g + 12 and r > b


def is_pale_matte(r: int, g: int, b: int) -> bool:
    mx, mn = max(r, g, b), min(r, g, b)
    if mx - mn > 22:
        return False
    return 232 <= mn <= 247 and mx <= 252


def is_white_or_aa(r: int, g: int, b: int) -> bool:
    """線の白〜アンチエイリアス。クリーム敷きは除外。"""
    mx, mn = max(r, g, b), min(r, g, b)
    lum = (r + g + b) / 3
    if is_blush(r, g, b):
        return True
    if mn >= 248:
        return True
    if is_pale_matte(r, g, b):
        return False
    if mn >= 235 and mx - mn <= 14 and lum >= 232:
        return True
    return False


def is_gray_bg(r: int, g: int, b: int) -> bool:
    """市松セル・中間グレー（白線より暗い無彩色）。"""
    if is_white_or_aa(r, g, b):
        return False
    mx, mn = max(r, g, b), min(r, g, b)
    if mx - mn > 48:
        return False
    lum = (r + g + b) / 3
    return 30 <= lum <= 220


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    path = root / "assets" / "jassmin-character.png"
    if not path.exists():
        print("missing", path, file=sys.stderr)
        return 1

    img = Image.open(path).convert("RGBA")
    px = img.load()
    w, h = img.size
    n = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 12:
                continue
            if is_white_or_aa(r, g, b):
                continue
            if is_pale_matte(r, g, b) or is_gray_bg(r, g, b):
                px[x, y] = (0, 0, 0, 0)
                n += 1

    img.save(path, optimize=True)
    print(f"OK: {w}x{h}, removed {n} bg pixels -> {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
