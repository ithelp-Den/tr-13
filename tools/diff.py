# usage: python3 -I tools/diff.py <figma.png> <mine.png> <out_side_by_side.png>
# Resizes both to the Figma width, prints mean abs pixel diff (0-255) and writes figma | mine | diff image.
import sys
from PIL import Image, ImageChops
a, b, out = sys.argv[1:4]
A = Image.open(a).convert('RGB'); B = Image.open(b).convert('RGB')
w = A.width
B = B.resize((w, int(B.height * w / B.width)))
h = min(A.height, B.height); A = A.crop((0, 0, w, h)); B = B.crop((0, 0, w, h))
D = ImageChops.difference(A, B)
import statistics
px = list(D.convert('L').getdata()); print('mean_abs_diff=%.2f  size=%dx%d (A %d, B %d)' % (statistics.fmean(px), w, h, Image.open(a).height, Image.open(b).height))
S = Image.new('RGB', (w * 3 + 20, h), (40, 40, 40)); S.paste(A, (0, 0)); S.paste(B, (w + 10, 0)); S.paste(D, (2 * w + 20, 0)); S.save(out)
