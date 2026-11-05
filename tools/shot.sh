#!/bin/bash
# usage: tools/shot.sh <html-file> <width> <height> <out.png>   (viewport screenshot at DPR 1)
# Widths < 500 are supported: headless Chrome has a 500px minimum window, so the page is wrapped in a W-wide iframe.
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SRC="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"; W="$2"; H="$3"; OUT="$4"
if [ "$W" -lt 500 ]; then
  WRAP="$(dirname "$SRC")/.wrap-$$.html"
  printf '<!doctype html><body style="margin:0;background:#000"><iframe src="file://%s" style="width:%spx;height:%spx;border:0;display:block"></iframe>' "$SRC" "$W" "$H" > "$WRAP"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --virtual-time-budget=6000 --window-size="500,$H" --screenshot="$OUT" "file://$WRAP" >/dev/null 2>&1
  rm -f "$WRAP"
  python3 -I -c "from PIL import Image; im=Image.open('$OUT'); im.crop((0,0,$W,im.height)).save('$OUT')"
else
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --virtual-time-budget=6000 --window-size="$W,$H" --screenshot="$OUT" "file://$SRC" >/dev/null 2>&1
fi
echo "$OUT"
