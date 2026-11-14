# Optional source preparation: Python, fonttools and brotli. Not part of the build.
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
r=Path(__file__).resolve().parents[1]
font=TTFont(r/'assets/fonts/dm-sans.woff2')
def face(weight):
 return instantiateVariableFont(font,{'wght':weight},inplace=False) if 'fvar' in font else font
orange='#c6380b';cream='#f1eadd'
def text(s,x,y,size,weight=500,spacing=0):
 f=face(weight);g=f.getGlyphSet();c=f.getBestCmap();scale=size/f['head'].unitsPerEm;parts=[]
 for char in s:
  name=c[ord(char)];p=SVGPathPen(g);g[name].draw(p)
  parts.append(f'<path transform="translate({x:.3f} {y}) scale({scale} {-scale})" d="{p.getCommands()}"/>')
  x+=f['hmtx'][name][0]*scale+spacing
 return ''.join(parts)
f=face(750);g=f.getGlyphSet();name=f.getBestCmap()[ord('B')];p=SVGPathPen(g);g[name].draw(p);b=BoundsPen(g);g[name].draw(b);x0,y0,x1,y1=b.bounds;scale=min(36/(x1-x0),40/(y1-y0));tx=32-(x0+x1)*scale/2;ty=32+(y0+y1)*scale/2
favicon=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="{cream}"/><path fill="{orange}" transform="translate({tx} {ty}) scale({scale} {-scale})" d="{p.getCommands()}"/></svg>'
(r/'assets/brand/favicon.svg').write_text(favicon)
social=f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="{cream}"/><g fill="{orange}">'+text('Baerg',64,230,190,750,-8)+text('design',630,225,40,500)+text('Des sites web.',68,365,64,600,-1.5)+text('Pensés avec vous.',68,440,64,600,-1.5)+f'<path d="M68 520H1132" stroke="{orange}" stroke-opacity=".35"/>'+text('Studio web',68,576,25,500)+text('Bulle · Suisse',951,576,25,500)+'</g></svg>'
(r/'assets/brand/share.svg').write_text(social)
