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
    if(op==='add') html+=step('2 · Add digit by digit','Perform ordinary binary addition on each BCD digit group.')+step('3 · Test the digit sum','If the 4-bit sum is greater than 1001 (decimal 9), or a carry leaves the 4-bit group, the result is not a valid single BCD digit.')+step('4 · Correct invalid BCD','Add <code>0110</code> (decimal 6). This moves the binary result past the six unused patterns 1010–1111 and produces the proper decimal carry.')+step('5 · Final BCD result',`${R} → <code>${bcdDigits(R)}</code>`);
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

const ebcdic37={};
'ABCDEFGHI'.split('').forEach((c,i)=>ebcdic37[c]=(0xC1+i).toString(16).toUpperCase());
'JKLMNOPQR'.split('').forEach((c,i)=>ebcdic37[c]=(0xD1+i).toString(16).toUpperCase());
'STUVWXYZ'.split('').forEach((c,i)=>ebcdic37[c]=(0xE2+i).toString(16).toUpperCase());
'abcdefghi'.split('').forEach((c,i)=>ebcdic37[c]=(0x81+i).toString(16).toUpperCase());
'jklmnopqr'.split('').forEach((c,i)=>ebcdic37[c]=(0x91+i).toString(16).toUpperCase());
'stuvwxyz'.split('').forEach((c,i)=>ebcdic37[c]=(0xA2+i).toString(16).toUpperCase());
'0123456789'.split('').forEach((c,i)=>ebcdic37[c]=(0xF0+i).toString(16).toUpperCase());

function bytesHex(str){return [...new TextEncoder().encode(str)].map(b=>b.toString(16).toUpperCase().padStart(2,'0')).join(' ')}
function codes(){
  const v=$('#codeInput').value||'A',out=$('#codeResult');
  if(/^\d+$/.test(v) && v.length>1){
    const n=Number(v);out.innerHTML=`<div class="code-card"><b>Decimal value</b><code>${n}</code></div><div class="code-card"><b>Pure binary</b><code>${n.toString(2)}</code><small>Whole number converted to base 2.</small></div><div class="code-card"><b>8421 BCD</b><code>${bcdDigits(n)}</code><small>Each decimal digit encoded separately.</small></div><div class="code-card"><b>Why they differ</b><code>58₁₀ = 111010₂, but BCD = 0101 1000</code></div>`;return;
  }
  const c=[...v][0],cp=c.codePointAt(0),unicode='U+'+cp.toString(16).toUpperCase().padStart(4,'0');
  const ascii=cp<128?{dec:cp,hex:cp.toString(16).toUpperCase().padStart(2,'0'),bin:cp.toString(2).padStart(7,'0')}:null;
  const ebc=ebcdic37[c]||null;
  out.innerHTML=`
    <div class="code-card"><b>Character</b><code class="big-code">${c}</code><small>The symbol the user sees.</small></div>
    <div class="code-card"><b>ASCII (7-bit)</b><code>${ascii?`${ascii.bin}₂ = ${ascii.dec}₁₀ = ${ascii.hex}₁₆`:'Not representable in 7-bit ASCII'}</code><small>ASCII has 128 possible values.</small></div>
    <div class="code-card"><b>EBCDIC code page 37</b><code>${ebc?`${ebc}₁₆ = ${parseInt(ebc,16)}₁₀`:'Not shown in this simple code-page-37 explorer'}</code><small>EBCDIC uses code pages; some characters vary by code page.</small></div>
    <div class="code-card"><b>Unicode code point</b><code>${unicode}</code><small>A unique numeric identity for the encoded character.</small></div>
    <div class="code-card"><b>UTF-8 bytes</b><code>${bytesHex(c)}</code><small>Actual byte sequence when this Unicode character is encoded as UTF-8.</small></div>
    <div class="code-card"><b>Mental picture</b><code>Character → code point → encoding → bytes</code><small>Do not confuse the Unicode code point with its UTF-8 byte sequence.</small></div>`;
}
$('#codeRun').onclick=codes;codes();

let transmitted='';
function parity(){const d=$('#parityData').value.replace(/\s/g,'');if(!/^[01]+$/.test(d)){$('#parityMessage').textContent='Use only 0 and 1.';return}const ones=[...d].filter(x=>x==='1').length,p=ones%2===0?'0':'1';transmitted=d+p;drawBits();$('#parityMessage').innerHTML=`Sender sees <b>${ones}</b> one-bits. For even parity, parity bit = <b>${p}</b>. Click any transmitted bit to simulate noise.`}
function drawBits(){const row=$('#bitRow');row.innerHTML='';[...transmitted].forEach((v,i)=>{const b=document.createElement('button');b.className='bit'+(i===transmitted.length-1?' parity':'');b.textContent=v;b.title=i===transmitted.length-1?'Parity bit':'Data bit '+(i+1);b.onclick=()=>{const arr=[...transmitted];arr[i]=arr[i]==='1'?'0':'1';transmitted=arr.join('');drawBits();const ones=[...transmitted].filter(x=>x==='1').length;$('#parityMessage').innerHTML=ones%2===0?'Receiver still sees even parity: <b>no odd-numbered error detected.</b> Remember: two flipped bits can escape ordinary parity.':'Receiver sees odd parity: <b>ERROR DETECTED.</b>'};row.appendChild(b)})}
$('#makeParity').onclick=parity;

function hammingEncode74(data){
  const d=[...data].map(Number); // d1 d2 d3 d4
  // Positions counted from right in conventional Hamming discussion: 1=P1,2=P2,3=D1,4=P3,5=D2,6=D3,7=D4
  const pos={3:d[0],5:d[1],6:d[2],7:d[3]};
  pos[1]=(pos[3]+pos[5]+pos[7])%2;
  pos[2]=(pos[3]+pos[6]+pos[7])%2;
  pos[4]=(pos[5]+pos[6]+pos[7])%2;
  return [7,6,5,4,3,2,1].map(p=>pos[p]).join('');
}
function syndrome74(code){
  const arr=[...code].map(Number);const pos={};[7,6,5,4,3,2,1].forEach((p,i)=>pos[p]=arr[i]);
  const s1=(pos[1]+pos[3]+pos[5]+pos[7])%2;
  const s2=(pos[2]+pos[3]+pos[6]+pos[7])%2;
  const s4=(pos[4]+pos[5]+pos[6]+pos[7])%2;
  return {s1,s2,s4,value:s1+2*s2+4*s4};
}
let hamCode='';
function drawHamming(){
  const out=$('#hammingResult');const syn=syndrome74(hamCode);
  const labels=['D4','D3','D2','P3','D1','P2','P1'];
  const positions=[7,6,5,4,3,2,1];
  out.innerHTML=`<div class="step"><strong>1 · Positions</strong>Parity bits occupy positions 1, 2 and 4. Data occupies 3, 5, 6 and 7.</div><div class="step"><strong>2 · Generated code</strong><div class="ham-bits">${[...hamCode].map((b,i)=>`<button data-hi="${i}" title="Position ${positions[i]} · ${labels[i]}"><span>${labels[i]}</span>${b}</button>`).join('')}</div><small>Click one bit to introduce an error.</small></div><div class="step"><strong>3 · Receiver syndrome</strong>P1 check = ${syn.s1}, P2 check = ${syn.s2}, P3 check = ${syn.s4} → syndrome <code>${syn.s4}${syn.s2}${syn.s1}</code> = <b>${syn.value}</b>. ${syn.value===0?'No single-bit error is indicated.':`Error is indicated at position <b>${syn.value}</b>. Flip that bit to correct the word.`}</div>`;
  $$('.ham-bits button').forEach(b=>b.onclick=()=>{const a=[...hamCode];a[+b.dataset.hi]=a[+b.dataset.hi]==='1'?'0':'1';hamCode=a.join('');drawHamming()});
}
$('#hammingEncode').onclick=()=>{const d=$('#hammingData').value.trim();if(!/^[01]{4}$/.test(d)){$('#hammingResult').innerHTML='<div class="step"><strong>Check input</strong>Enter exactly four bits, for example 1011.</div>';return}hamCode=hammingEncode74(d);drawHamming()};
$('#hammingEncode').click();

let A=0,B=0;function drawGates(){const vals={AND:A&B,OR:A|B,NOT:1-A,NAND:1-(A&B),NOR:1-(A|B),XOR:A^B};$('#gateGrid').innerHTML=Object.entries(vals).map(([g,v])=>`<div class="gate"><strong>${g}</strong><span class="lamp ${v?'on':''}"></span><p>${g==='NOT'?`NOT A = ${v}`:`A=${A}, B=${B} → ${v}`}</p></div>`).join('');$('#toggleA').textContent='A = '+A;$('#toggleB').textContent='B = '+B}
$('#toggleA').onclick=()=>{A=1-A;drawGates()};$('#toggleB').onclick=()=>{B=1-B;drawGates()};drawGates();

$$('[data-univ]').forEach(b=>b.onclick=()=>{const m={not:'Tie the two NAND inputs together: A NAND A = Ā.',and:'First NAND A and B, then NAND that output with itself: (A NAND B) NAND (A NAND B) = A·B.',or:'Invert A and B using NAND-as-NOT, then NAND the two inverted signals: Ā NAND B̄ = A+B.'};$('#universalResult').innerHTML='<b>'+m[b.dataset.univ]+'</b>'});
$$('[data-law]').forEach(b=>b.onclick=()=>{$('#booleanResult').innerHTML=b.dataset.law==='absorption'?'<b>Correct.</b> Absorption law: A + A·B = A. The extra AND path contributes nothing when A is already true.':'That law is useful elsewhere, but not the shortest step here. Try <b>Absorption</b>.'});
$$('#kmapGrid button').forEach(b=>b.onclick=()=>{b.classList.toggle('on');b.textContent=b.classList.contains('on')?'1':'0'});
$('#solveKmap').onclick=()=>{const on=$$('#kmapGrid button.on').map(b=>b.dataset.cell).sort();const key=on.join(',');const map={'':'0','00':"ĀB̄",'01':"ĀB",'10':"AB̄",'11':'AB','00,01':"Ā",'10,11':'A','00,10':"B̄",'01,11':'B','00,01,10,11':'1'};$('#kmapResult').innerHTML=map[key]?`Selected minterms: ${on.join(', ')||'none'}<br><b>Simplified result: ${map[key]}</b>`:'This pattern needs two groups in a 2-variable map. Look for adjacent pairs first, then cover any remaining 1.'};