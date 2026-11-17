import json, sys, time, base64, urllib.request, subprocess, os
from websocket import create_connection
PORT=9334
def start():
    p=subprocess.Popen([os.path.expanduser('~/.cache/ms-playwright/chromium_headless_shell-1148/chrome-linux/headless_shell'),'--no-sandbox',f'--remote-debugging-port={PORT}','--use-angle=swiftshader','--enable-unsafe-swiftshader','--hide-scrollbars','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    for _ in range(50):
        try:
            tabs=json.load(urllib.request.urlopen(f'http://127.0.0.1:{PORT}/json')); break
        except Exception: time.sleep(0.2)
    url=[t for t in tabs if t['type']=='page'][0]['webSocketDebuggerUrl']
    return p, create_connection(url, suppress_origin=True)
class C:
    def __init__(s): s.p,s.ws=start(); s.i=0
    def call(s,m,**params):
        s.i+=1; s.ws.send(json.dumps({'id':s.i,'method':m,'params':params}))
        while True:
            r=json.loads(s.ws.recv())
            if r.get('id')==s.i: return r.get('result',r)
    def ev(s,expr): return s.call('Runtime.evaluate',expression=expr,returnByValue=True,awaitPromise=True)
    def shot(s,path,clip=None):
        kw={'format':'png'}
        if clip: kw['clip']=dict(clip,scale=1)
        open(path,'wb').write(base64.b64decode(s.call('Page.captureScreenshot',**kw)['data']))
    def close(s): s.p.kill()
