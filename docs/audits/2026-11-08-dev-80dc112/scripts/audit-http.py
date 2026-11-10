from pathlib import Path
from urllib.request import Request, build_opener, HTTPRedirectHandler
from urllib.error import HTTPError
import json

root = Path(__file__).resolve().parent.parent
site = 'http://127.0.0.1:4739'
class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl): return None
opener = build_opener(NoRedirect)
report = {'site':site, 'checks':[], 'resources':[], 'failures':[]}
def request(path, method='GET'):
    try:
        result = opener.open(Request(site+path, method=method), timeout=10)
    except HTTPError as error:
        result = error
    return result.status, dict(result.headers), result.read()
def check(path, method='GET', expected=200, location=None):
    status, headers, body = request(path, method)
    value = {'path':path,'method':method,'status':status,'expected':expected,'headers':headers,'bodyBytes':len(body)}
    if location is not None:value['expectedLocation']=location
    value['passed'] = status == expected and (location is None or headers.get('Location')==location) and (method!='HEAD' or not body)
    report['checks'].append(value)
    if not value['passed']:report['failures'].append(value)
    return value

for path in ['/','/a-propos/','/realisations/','/offres/','/contact/','/demos/lise/','/demos/midi-et-compagnie/','/demos/atelier-traverse/']:
    for method in ['GET','HEAD']:check(path, method)
for path in ['/audit-page-inconnue','/inconnue/profonde/','/demos/lise/inconnue','/assets/inconnu.css']:
    for method in ['GET','HEAD']:check(path,method,404)
redirects=json.loads((root/'source/redirects.json').read_text())
for old, new in redirects.items():
    for suffix in ['', '/', '/index.html']:
        for method in ['GET','HEAD']:
            check(old+suffix+'?origine=audit&projet=refonte',method,308,new+'?origine=audit&projet=refonte')
    check(new)
for path in ['/a-propos','/contact','/offres','/demos/lise']:
    check(path+'?projet=refonte&origine=audit','GET',308,path+'/?projet=refonte&origine=audit')
for path in ['/robots.txt','/sitemap.xml','/favicon.ico']:
    value=check(path,'GET',404)
    value['note']='Constat de présence, pas un échec HTTP du parcours ; indexation/identité à préparer avant publication.'
check('/contact/','POST',405)
for p in sorted((root/'source/dist').rglob('*')):
    if not p.is_file():continue
    if p.name=='redirects.json':continue  # configuration du serveur, pas une ressource publique
    rel='/'+p.relative_to(root/'source/dist').as_posix()
    status,headers,body=request(rel)
    entry={'path':rel,'status':status,'bytes':len(body),'expectedBytes':p.stat().st_size,'mime':headers.get('Content-Type'),'match':body==p.read_bytes()}
    report['resources'].append(entry)
    if status!=200 or not entry['match']:report['failures'].append(entry)
(root/'evidence/http.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n')
print(json.dumps({'checks':len(report['checks']),'resources':len(report['resources']),'failures':report['failures']},indent=2))
