# Screenshots of the live sheets (2x) and the positions of the parts the slides annotate, in shots/.
import sys,time,json; sys.path.insert(0,'.')
from cdp import C
c=C(); c.call('Emulation.setDeviceMetricsOverride',width=1800,height=1000,deviceScaleFactor=2,mobile=False)
U="""(sel,txt)=>{let els=[...document.querySelectorAll(sel)].filter(e=>e.getBoundingClientRect().width>0&&(!txt||(e.innerText||e.value||'').trim().startsWith(txt)));
 if(!els.length) return null; const rs=els.map(e=>e.getBoundingClientRect());
 const x=Math.min(...rs.map(r=>r.left)),y=Math.min(...rs.map(r=>r.top)),X=Math.max(...rs.map(r=>r.right)),Y=Math.max(...rs.map(r=>r.bottom));
 return [Math.round(x),Math.round(y),Math.round(X-x),Math.round(Y-y)]}"""
def grab(url, targets, name, clipfn):
    c.call('Page.navigate',url='about:blank'); time.sleep(0.3)
    c.call('Page.navigate',url=url); time.sleep(5)
    rects={}
    for k,(sel,txt) in targets.items():
        rects[k]=c.ev(f"JSON.stringify(({U})({json.dumps(sel)},{json.dumps(txt)}))")['result']['value']
        rects[k]=json.loads(rects[k]) if rects[k] else None
    clip=clipfn(c)
    c.shot(f'shots/{name}.png',{'x':clip[0],'y':clip[1],'width':clip[2],'height':clip[3]})
    for k,r in rects.items():
        if r: rects[k]=[r[0]-clip[0],r[1]-clip[1],r[2],r[3]]
    json.dump({'clip':clip,'rects':rects},open(f'shots/{name}.json','w'),indent=0)
    print(name, clip, c.ev('location.hash')['result']['value']); [print(' ',k,v) for k,v in rects.items()]
T='.view.active table.sliderule '
grab('https://sliderules.magiwanders.com/#encoder?ext=I&type=B&m=beq&rs1=10&rs2=11&imm=-8', {
 'extType':(T+'td.selector-cell.ext, '+T+'td.selector-cell.type',None),
 'descr':(T+'th.details-toggle',None),
 'mnemonic':(T+'td.selector-cell.mnemonic',None),
 'operands':(T+'td.selector-cell.operands',None),
 'immctl':(T+'.operand-col.operand-imm',None),
 'asm':(T+'.section-asm',None),
 'copyAsm':(T+'button.on-section','Copy Assembly'),
 'pasteAsm':(T+'button.on-section','Paste Assembly'),
 'copyBin':(T+'button.on-section','Copy bin'),
 'copyHex':(T+'button.on-section','Copy hex'),
 'hex':(T+'tr.hex-row th.hex-head',None),
 'bits':(T+'tr.input-row th.bit-head',None),
 'numbers':(T+'tr.number-row th.bit-number',None),
 'fields':(T+'tbody tr:nth-child(1) td.bit',None),
 'immrow':(T+'tbody tr:nth-child(2) td.bit',None),
 'text':(T+'tbody tr:nth-child(1) td.text',None),
 'table':(T,None),
}, 'ui-encoder', lambda c:[10,96,1562,170])
grab('https://sliderules.magiwanders.com/#decoder?bits=xxxxxxxxxxxxxxxxx101xxxxx0010011', {
 'hex':(T+'tr.hex-row th.hex-head',None),
 'bits':(T+'tr.input-row th.bit-head',None),
 'numbers':(T+'tr.number-row th.bit-number',None),
 'meaning':(T+'.section-asm, '+T+'.decoded, '+T+'.meaning',None),
 'copyBin':(T+'button.on-section','Copy bin'),
 'copyHex':(T+'button.on-section','Copy hex'),
 'pasteBin':(T+'button.on-section','Paste bin'),
 'pasteHex':(T+'button.on-section','Paste hex'),
 'section':(T+'tr.section-row',None),
 'group':(T+'tr.group-row',None),
 'inst':(T+'tr.instruction-row',None),
 'imm':(T+'tr.immediate-row',None),
 'colTitles':(T+'tr.number-row th.column-title',None),
 'typeExt':(T+'tbody td.type, '+T+'tbody td.ext',None),
 'pseudo':(T+'tbody td.pseudocode',None),
 'table':(T,None),
 'labelrow':(T+'tr.label-row',None),
}, 'ui-decoder', lambda c:[10,96,1760,260])
grab('https://sliderules.magiwanders.com/#encoder', {
 'isa':('.title-carousel',None),'version':('.header-version',None),'pill':('.mode-pill',None),'regs':('.register-buttons',None),
 'G':('.ext-bundle',None),'Ichip':('.ext-chip',None),'more':('.ext-more',None),'exts':('.header-extensions .ext-toggle, .header-extensions .ext-bundle, .header-extensions .ext-chip',None),
 'credits':('.header-credits',None),'license':('.license-note',None),'contribute':('.contribute-link',None),
 'clear':('.header-tools .tool-button','Clear'),'pdf':('.split-main',None),'caret':('.split-caret',None),'share':('.header-tools .tool-button','Share'),
}, 'ui-header', lambda c:[8,8,1566,92])
grab('https://sliderules.magiwanders.com/#decoder?bits=01000000010001010101010100010011', {
 'decoded':(T+'thead .asm-token, '+T+'thead .asm-punct, '+T+'thead .io-hex, '+T+'thead .io-tools',None),
 'row':(T+'tr.instruction-row.decoded',None),
 'imm':(T+'tr.immediate-row',None),
 'bits':(T+'tr.input-row th.bit-head, '+T+'tr.hex-row th.hex-head',None),
}, 'ui-decoder2', lambda c:[10,96,1760,180])
c.close()
