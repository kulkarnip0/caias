const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
$$('.chapter-nav button').forEach(b=>b.onclick=()=>$('#'+b.dataset.target).scrollIntoView({behavior:'smooth'}));

function bcdDigits(n){return String(n).split('').map(d=>Number(d).toString(2).padStart(4,'0')).join(' ')}
function validDigits(s,base){return [...s.toUpperCase()].every(c=>!Number.isNaN(parseInt(c,base))&&parseInt(c,base)<base)}
function arith(){
  const mode=$('#arithMode').value,op=$('#arithOp').value,a=$('#arithA').value.trim(),b=$('#arithB').value.trim(),out=$('#arithResult');
  const step=(h,t)=>`<div class="step"><strong>${h}</strong>${t}</div>`;
  if(mode==='bcd'){
    if(!/^\d+$/.test(a)||!/^\d+$/.test(b)){out.innerHTML=step('Check the input','BCD examples should use decimal digits 0–9.');return}
    const A=Number(a),B=Number(b),R=op==='add'?A+B:A-B;
    if(R<0){out.innerHTML=step('Try a non-negative example','This first visual lab keeps BCD subtraction to results ≥ 0.');return}
    let html=step('1 · Encode each decimal digit',`${a} → <code>${bcdDigits(A)}</code><br>${b} → <code>${bcdDigits(B)}</code>`);
    if(op==='add') html+=step('2 · Add digit by digit','If a 4-bit digit result is greater than 1001 (9), or produces a carry, BCD correction is needed.')+step('3 · Correct invalid BCD','Add <code>0110</code> (decimal 6) to that 4-bit digit. This skips the six invalid binary patterns 1010–1111.')+step('4 · Final BCD result',`${R} → <code>${bcdDigits(R)}</code>`);
    else html+=step('2 · Subtract the decimal digits','Borrow between decimal digits when needed, then encode each result digit separately in BCD.')+step('3 · Final BCD result',`${A} − ${B} = ${R}<br>${R} → <code>${bcdDigits(R)}</code>`);
    out.innerHTML=html;return;
  }
  const base=mode==='oct'?8:16,label=mode==='oct'?'Octal':'Hexadecimal';
  if(!validDigits(a,base)||!validDigits(b,base)){out.innerHTML=step('Check the digits',`${label} allows ${mode==='oct'?'0–7':'0–9 and A–F'} only.`);return}
  const A=parseInt(a,base),B=parseInt(b,base),R=op==='add'?A+B:A-B;
  if(R<0){out.innerHTML=step('Try a non-negative example','This first visual lab keeps subtraction to results ≥ 0.');return}
  const result=R.toString(base).toUpperCase();
  const carryRule=mode==='oct'?'When a column reaches 8, write the remainder after division by 8 and carry 1.':'When a column reaches 16, write the hexadecimal remainder and carry 1.';
  out.innerHTML=step(`1 · Read the digits in base ${base}`,`${a}<sub>${base}</sub> = ${A}<sub>10</sub><br>${b}<sub>${base}</sub> = ${B}<sub>10</sub>`)+step(`2 · Work from right to left`,op==='add'?carryRule:`Borrow one ${base} from the next column whenever the top digit is smaller.`)+step('3 · Check in decimal',`${A} ${op==='add'?'+':'−'} ${B} = ${R}`)+step(`4 · Convert the result back to base ${base}`,`<strong>${a}<sub>${base}</sub> ${op==='add'?'+':'−'} ${b}<sub>${base}</sub> = ${result}<sub>${base}</sub></strong>`);
}
$('#arithRun').onclick=arith; arith();

function codes(){
  const v=$('#codeInput').value||'A',out=$('#codeResult');
  if(/^\d+$/.test(v)){
    const n=Number(v);out.innerHTML=`<div class="code-card"><b>Decimal</b><code>${n}</code></div><div class="code-card"><b>Pure binary</b><code>${n.toString(2)}</code></div><div class="code-card"><b>BCD</b><code>${bcdDigits(n)}</code></div><div class="code-card"><b>Key idea</b><code>Binary encodes the whole value; BCD encodes each decimal digit.</code></div>`;return;
  }
  const c=[...v][0],cp=c.codePointAt(0),ascii=cp<128?cp:'not representable',unicode='U+'+cp.toString(16).toUpperCase().padStart(4,'0');
  const ebcdicMap={A:'C1',B:'C2',C:'C3',D:'C4',E:'C5',F:'C6',G:'C7',H:'C8',I:'C9',J:'D1',K:'D2',L:'D3',M:'D4',N:'D5',O:'D6',P:'D7',Q:'D8',R:'D9',S:'E2',T:'E3',U:'E4',V:'E5',W:'E6',X:'E7',Y:'E8',Z:'E9'};
  out.innerHTML=`<div class="code-card"><b>Character</b><code>${c}</code></div><div class="code-card"><b>ASCII</b><code>${ascii}${typeof ascii==='number'?' = '+ascii.toString(2).padStart(8,'0'):''}</code></div><div class="code-card"><b>EBCDIC (common uppercase mapping)</b><code>${ebcdicMap[c.toUpperCase()]||'varies / not shown here'}</code></div><div class="code-card"><b>Unicode code point</b><code>${unicode}</code></div>`;
}
$('#codeRun').onclick=codes;codes();

let transmitted='';
function parity(){const d=$('#parityData').value.replace(/\s/g,'');if(!/^[01]+$/.test(d)){$('#parityMessage').textContent='Use only 0 and 1.';return}const ones=[...d].filter(x=>x==='1').length,p=ones%2===0?'0':'1';transmitted=d+p;drawBits();$('#parityMessage').innerHTML=`Sender counts ${ones} one-bits, so parity bit = <b>${p}</b>. Click any bit to simulate transmission noise.`}
function drawBits(){const row=$('#bitRow');row.innerHTML='';[...transmitted].forEach((v,i)=>{const b=document.createElement('button');b.className='bit'+(i===transmitted.length-1?' parity':'');b.textContent=v;b.title=i===transmitted.length-1?'Parity bit':'Data bit '+(i+1);b.onclick=()=>{const arr=[...transmitted];arr[i]=arr[i]==='1'?'0':'1';transmitted=arr.join('');b.classList.add('flipped');drawBits();const ones=[...transmitted].filter(x=>x==='1').length;$('#parityMessage').innerHTML=ones%2===0?'Receiver sees even parity: <b>no odd-numbered bit error detected.</b>':'Parity is now odd: <b>ERROR DETECTED.</b>'};row.appendChild(b)})}
$('#makeParity').onclick=parity;

let A=0,B=0;function drawGates(){const vals={AND:A&B,OR:A|B,NOT:1-A,NAND:1-(A&B),NOR:1-(A|B),XOR:A^B};$('#gateGrid').innerHTML=Object.entries(vals).map(([g,v])=>`<div class="gate"><strong>${g}</strong><span class="lamp ${v?'on':''}"></span><p>${g==='NOT'?`NOT A = ${v}`:`A=${A}, B=${B} → ${v}`}</p></div>`).join('');$('#toggleA').textContent='A = '+A;$('#toggleB').textContent='B = '+B}
$('#toggleA').onclick=()=>{A=1-A;drawGates()};$('#toggleB').onclick=()=>{B=1-B;drawGates()};drawGates();

$$('[data-univ]').forEach(b=>b.onclick=()=>{const m={not:'Tie the two NAND inputs together: A NAND A = Ā.',and:'First NAND A and B, then NAND that output with itself: (A NAND B) NAND (A NAND B) = A·B.',or:'Invert A and B using NAND-as-NOT, then NAND the two inverted signals: Ā NAND B̄ = A+B.'};$('#universalResult').innerHTML='<b>'+m[b.dataset.univ]+'</b>'});

$$('[data-law]').forEach(b=>b.onclick=()=>{$('#booleanResult').innerHTML=b.dataset.law==='absorption'?'<b>Correct.</b> Absorption law: A + A·B = A. The extra AND path contributes nothing when A is already true.':'That law is useful elsewhere, but not the shortest step here. Try <b>Absorption</b>.'});

$$('#kmapGrid button').forEach(b=>b.onclick=()=>{b.classList.toggle('on');b.textContent=b.classList.contains('on')?'1':'0'});
$('#solveKmap').onclick=()=>{const on=$$('#kmapGrid button.on').map(b=>b.dataset.cell).sort();const key=on.join(',');const map={'':'0','00':"ĀB̄",'01':"ĀB",'10':"AB̄",'11':'AB','00,01':"Ā",'10,11':'A','00,10':"B̄",'01,11':'B','00,01,10,11':'1'};$('#kmapResult').innerHTML=map[key]?`Selected minterms: ${on.join(', ')||'none'}<br><b>Simplified result: ${map[key]}</b>`:'This pattern needs two groups in a 2-variable map. Look for adjacent pairs first, then cover any remaining 1.'};
