# Optional asset preparation only; not required by the site or build.
# Run with Python + Pillow 13: python scripts/optimize-images.py
from PIL import Image
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
report=[]
for source in ['assets/empreinte-altrix.png','demos/atelier-traverse/images/bench.webp','demos/atelier-traverse/images/joint.webp','demos/atelier-traverse/images/atelier-scene.webp']:
 p=root/source;original=Image.open(p);dest=p.parent/'responsive';dest.mkdir(exist_ok=True)
 for width in [640,960,original.width]:
  im=original.resize((width,round(original.height*width/original.width)),Image.Resampling.LANCZOS) if width!=original.width else original
  out=dest/f'{p.stem}-{width}.webp'
  im.save(out,format='WEBP',quality=90,method=6,exact=True)
  report.append({'source':source,'originalBytes':p.stat().st_size,'width':width,'format':'webp','bytes':out.stat().st_size})
# Originals are retained; only responsive variants are generated.
print(json.dumps(report,indent=2))
