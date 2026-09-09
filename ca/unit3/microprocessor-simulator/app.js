const state={bus:0,A:0,B:0,op:'NOP',clock:0,edges:0,running:false,timer:null,history:[],waves:[]};
const ops={NOP:{bits:'00',loadA:0,loadB:0,selA:0,text:'NOP: no register will change on the next rising edge.'},LDA:{bits:'01',loadA:1,loadB:0,selA:0,text:'LOAD A: MUX selects the external bus. On the next rising edge, A stores the bus value.'},LDB:{bits:'10',loadA:0,loadB:1,selA:0,text:'LOAD B: on the next rising edge, B stores the external bus value. A keeps its old value.'},ADD:{bits:'11',loadA:1,loadB:0,selA:1,text:'ADD: MUX selects the adder result. On the next rising edge, A stores A + B.'}};
const $=id=>document.getElementById(id); const bin=n=>(n&15).toString(2).padStart(4,'0');
function renderBits(container,value,label){container.innerHTML='';[3,2,1,0].forEach(i=>{const d=document.createElement('div');d.className='ff '+(((value>>i)&1)?'one':'');d.innerHTML=`<b>${(value>>i)&1}</b><span>${label}${i}</span>`;container.appendChild(d);});}
function addBitSwitches(){const c=$('dataBits');[3,2,1,0].forEach(i=>{const b=document.createElement('button');b.className='bit-btn';b.dataset.bit=i;b.textContent='0';b.onclick=()=>{state.bus^=(1<<i);render();};c.appendChild(b);});}
function selected(){return ops[state.op]}
function sumRaw(){return state.A+state.B} function sum(){return sumRaw()&15}
function muxOut(){return selected().selA?sum():state.bus}
function render(){
  $('busValue').textContent=bin(state.bus);$('busWireValue').textContent=bin(state.bus);$('flowBus').textContent=bin(state.bus);
  document.querySelectorAll('.bit-btn').forEach(b=>{const v=(state.bus>>Number(b.dataset.bit))&1;b.textContent=v;b.classList.toggle('on',!!v)});
  const o=selected();$('instructionBadge').textContent=`${state.op==='LDA'?'LOAD A':state.op==='LDB'?'LOAD B':state.op} · ${o.bits}`;
  document.querySelectorAll('.instruction').forEach(b=>b.classList.toggle('active',b.dataset.op===state.op));
  [['sigLoadA',o.loadA],['sigLoadB',o.loadB],['sigSelA',o.selA]].forEach(([id,v])=>{$(id).textContent=v;$(id).classList.toggle('on',!!v)});$('microExplain').textContent=o.text;
  $('regAValue').textContent=bin(state.A);$('regBValue').textContent=bin(state.B);renderBits($('regAFlops'),state.A,'Q');renderBits($('regBFlops'),state.B,'Q');
  $('adderA').textContent=bin(state.A);$('adderB').textContent=bin(state.B);$('adderSum').textContent=bin(sum());$('carryOut').textContent=sumRaw()>15?1:0;
  $('muxSel').textContent=o.selA;$('muxOut').textContent=bin(muxOut());$('flowMux').textContent=bin(muxOut());$('flowA').textContent=bin(state.A);
  $('muxSource').textContent=o.selA?'Adder result selected':'External bus selected';
  $('clockLamp').textContent=state.clock;$('clockLamp').className='clock-lamp '+(state.clock?'high':'low');$('edgeCount').textContent=`Rising edges: ${state.edges}`;$('runClock').textContent=state.running?'Pause':'Run';
  $('regACard').style.boxShadow=o.loadA?'0 0 0 4px rgba(52,73,199,.12)':'none';$('regBCard').style.boxShadow=o.loadB?'0 0 0 4px rgba(52,73,199,.12)':'none';
  renderHistory();renderWave();
}
function risingEdge(){const beforeA=state.A,beforeB=state.B,o=selected();let action='No register changed.';if(o.loadB){state.B=state.bus;action=`B loaded ${bin(state.bus)} from the data bus.`}if(o.loadA){state.A=muxOut();action=o.selA?`A loaded adder result ${bin(state.A)} = old A + B.`:`A loaded ${bin(state.bus)} from the data bus.`}state.edges++;state.history.unshift({edge:state.edges,op:state.op,bus:bin(state.bus),a0:bin(beforeA),b0:bin(beforeB),a1:bin(state.A),b1:bin(state.B),action});if(state.history.length>12)state.history.pop();}
function pulse(){if(state.clock===0){state.clock=1;risingEdge();state.waves.push(1);render();setTimeout(()=>{state.clock=0;state.waves.push(0);if(state.waves.length>30)state.waves=state.waves.slice(-30);render()},140)}else{state.clock=0;state.waves.push(0);render()}}
function startStop(){state.running=!state.running;if(state.running){const tick=()=>{if(!state.running)return;pulse();state.timer=setTimeout(tick,Number($('speed').value));};tick()}else{clearTimeout(state.timer)}render()}
function renderHistory(){$('history').innerHTML=state.history.map(h=>`<tr><td>${h.edge}</td><td>${h.op}</td><td>${h.bus}</td><td>${h.a0}</td><td>${h.b0}</td><td><b>${h.a1}</b></td><td><b>${h.b1}</b></td><td>${h.action}</td></tr>`).join('')}
function renderWave(){const w=$('waveform');w.innerHTML='<span style="align-self:center;font:700 .72rem monospace;margin-right:8px">CLK</span>'+state.waves.map(v=>`<div class="wave ${v?'high':''}" title="CLK=${v}"></div>`).join('')}
function reset(){clearTimeout(state.timer);Object.assign(state,{bus:0,A:0,B:0,op:'NOP',clock:0,edges:0,running:false,timer:null,history:[],waves:[]});render()}
addBitSwitches();document.querySelectorAll('.instruction').forEach(b=>b.onclick=()=>{state.op=b.dataset.op;render()});$('stepClock').onclick=pulse;$('runClock').onclick=startStop;$('reset').onclick=reset;$('speed').oninput=()=>{if(state.running){clearTimeout(state.timer);state.running=false;startStop();}};render();