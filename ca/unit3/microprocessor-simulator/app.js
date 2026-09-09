const state={bus:0,A:0,B:0,op:'NOP',armed:false,held:false,clock:0,edges:0,running:false,timer:null,history:[],waves:[],flash:''};
const ops={
  NOP:{bits:'00',loadA:0,loadB:0,selA:0,text:'NOP is being held: controller sees 00. No LOAD signal is active, so both registers will hold.'},
  LDA:{bits:'01',loadA:1,loadB:0,selA:0,text:'LOAD A is being held: LOAD_A=1 and SEL_A=0. The bus → MUX → A path is active, but A has not latched yet.'},
  LDB:{bits:'10',loadA:0,loadB:1,selA:0,text:'LOAD B is being held: LOAD_B=1. The bus → B path is active, but B has not latched yet.'},
  ADD:{bits:'11',loadA:1,loadB:0,selA:1,text:'ADD is being held: LOAD_A=1 and SEL_A=1. A and B feed the adder; SUM → MUX → A is active, but A has not latched yet.'}
};
const $=id=>document.getElementById(id);
const bin=n=>(n&15).toString(2).padStart(4,'0');
function renderBits(container,value,label){container.innerHTML='';[3,2,1,0].forEach(i=>{const d=document.createElement('div');d.className='ff '+(((value>>i)&1)?'one':'')+(state.flash===container.id?' latch':'');d.innerHTML=`<b>${(value>>i)&1}</b><span>${label}${i}</span>`;container.appendChild(d);});}
function addBitSwitches(){const c=$('dataBits');[3,2,1,0].forEach(i=>{const b=document.createElement('button');b.className='bit-btn';b.dataset.bit=i;b.textContent='0';b.onclick=()=>{state.bus^=(1<<i);render();};c.appendChild(b);});}
function selected(){return ops[state.op]}
function sumRaw(){return state.A+state.B}
function sum(){return sumRaw()&15}
function muxOut(){return selected().selA?sum():state.bus}
function setWire(id,active,value){const e=$(id);if(!e)return;e.classList.toggle('active-wire',!!active);if(value!==undefined){const label=$(id+'Label');if(label)label.textContent=value;}}
function renderWires(){const o=selected(),active=state.held;
  setWire('wireBusMux',active&&state.op==='LDA',bin(state.bus));
  setWire('wireMuxA',active&&(state.op==='LDA'||state.op==='ADD'),bin(muxOut()));
  setWire('wireBusB',active&&state.op==='LDB',bin(state.bus));
  setWire('wireAAdder',active&&state.op==='ADD',bin(state.A));
  setWire('wireBAdder',active&&state.op==='ADD',bin(state.B));
  setWire('wireAdderMux',active&&state.op==='ADD',bin(sum()));
  setWire('wireCtrlA',active&&!!o.loadA);
  setWire('wireCtrlB',active&&!!o.loadB);
  setWire('wireCtrlMux',active&&!!o.selA);
}
function render(){
  $('busValue').textContent=bin(state.bus);$('busWireValue').textContent=bin(state.bus);
  document.querySelectorAll('.bit-btn').forEach(b=>{const v=(state.bus>>Number(b.dataset.bit))&1;b.textContent=v;b.classList.toggle('on',!!v)});
  const o=selected();
  $('instructionBadge').textContent=state.held?`${state.op==='LDA'?'LOAD A':state.op==='LDB'?'LOAD B':state.op} · ${o.bits} · HELD`:'IDLE · 00';
  document.querySelectorAll('.instruction').forEach(b=>b.classList.toggle('active',b.dataset.op===state.op&&state.held));
  const la=state.held?o.loadA:0,lb=state.held?o.loadB:0,sa=state.held?o.selA:0;
  [['sigLoadA',la],['sigLoadB',lb],['sigSelA',sa]].forEach(([id,v])=>{$(id).textContent=v;$(id).classList.toggle('on',!!v)});
  $('ctrlBits').textContent=state.held?o.bits:'00';$('ctrlState').textContent=state.held?'INPUT HELD':'IDLE';$('ctrlState').classList.toggle('armed',state.held);
  $('ctrlMeaning').textContent=state.held?`${state.op==='LDA'?'LOAD A':state.op==='LDB'?'LOAD B':state.op}: [LOAD_A, LOAD_B, SEL_A] = [${la}, ${lb}, ${sa}]`:'Release complete · controller outputs returned to 0';
  $('microExplain').textContent=state.held?o.text:'Press and HOLD an instruction to inspect its control signals and active wires. RELEASE it to generate one rising edge and latch the result.';
  $('regAValue').textContent=bin(state.A);$('regBValue').textContent=bin(state.B);renderBits($('regAFlops'),state.A,'Q');renderBits($('regBFlops'),state.B,'Q');
  $('adderA').textContent=bin(state.A);$('adderB').textContent=bin(state.B);$('adderSum').textContent=bin(sum());$('carryOut').textContent=sumRaw()>15?1:0;
  $('muxSel').textContent=sa;$('muxOut').textContent=bin(state.held&&o.selA?sum():state.bus);$('muxSource').textContent=state.held&&o.selA?'Adder result selected':'External bus selected';
  $('clockLamp').textContent=state.clock;$('clockLamp').className='clock-lamp '+(state.clock?'high':'low');$('edgeCount').textContent=`Rising edges: ${state.edges}`;$('runClock').textContent=state.running?'Pause':'Run';
  $('regACard').classList.toggle('will-load',state.held&&!!o.loadA);$('regBCard').classList.toggle('will-load',state.held&&!!o.loadB);
  $('wireBusValue').textContent=bin(state.bus);$('wireAValue').textContent=bin(state.A);$('wireBValue').textContent=bin(state.B);$('wireSumValue').textContent=bin(sum());
  $('stepClock').disabled=state.held;$('runClock').disabled=state.held;
  renderWires();renderHistory();renderWave();
}
function executeEdge(opName){
  const beforeA=state.A,beforeB=state.B,o=ops[opName];let action='NOP: clock edge occurred; both registers held their values.';
  if(o.loadB){state.B=state.bus;state.flash='regBFlops';action=`LOAD B: on release, B latched ${bin(state.bus)} from the data bus.`;}
  if(o.loadA){const next=o.selA?((beforeA+beforeB)&15):state.bus;state.A=next;state.flash='regAFlops';action=o.selA?`ADD: on release, A latched ${bin(next)} = ${bin(beforeA)} + ${bin(beforeB)}.`:`LOAD A: on release, A latched ${bin(state.bus)} from the data bus.`;}
  state.edges++;state.history.unshift({edge:state.edges,op:opName,bus:bin(state.bus),a0:bin(beforeA),b0:bin(beforeB),a1:bin(state.A),b1:bin(state.B),action});if(state.history.length>12)state.history.pop();
}
function releaseInstruction(){
  if(!state.held)return;
  const executedOp=state.op;
  state.clock=1;state.waves.push(1);executeEdge(executedOp);
  state.held=false;state.armed=false;state.op='NOP';render();
  setTimeout(()=>{state.clock=0;state.waves.push(0);if(state.waves.length>30)state.waves=state.waves.slice(-30);render();},180);
  setTimeout(()=>{state.flash='';render();},360);
}
function holdInstruction(opName,button,pointerId){
  if(state.held)return;
  if(state.running){clearTimeout(state.timer);state.running=false;}
  state.op=opName;state.armed=true;state.held=true;
  if(button&&button.setPointerCapture&&pointerId!==undefined){try{button.setPointerCapture(pointerId)}catch(e){}}
  render();
}
function risingEdgeManual(){const beforeA=state.A,beforeB=state.B;state.edges++;state.history.unshift({edge:state.edges,op:'NOP',bus:bin(state.bus),a0:bin(beforeA),b0:bin(beforeB),a1:bin(state.A),b1:bin(state.B),action:'Manual clock pulse with no instruction held: registers kept their values.'});if(state.history.length>12)state.history.pop();}
function pulse(){if(state.held)return;if(state.clock===0){state.clock=1;risingEdgeManual();state.waves.push(1);render();setTimeout(()=>{state.clock=0;state.waves.push(0);if(state.waves.length>30)state.waves=state.waves.slice(-30);render();},140)}else{state.clock=0;state.waves.push(0);render();}}
function startStop(){if(state.held)return;state.running=!state.running;if(state.running){const tick=()=>{if(!state.running)return;pulse();state.timer=setTimeout(tick,Number($('speed').value));};tick()}else clearTimeout(state.timer);render();}
function renderHistory(){$('history').innerHTML=state.history.map(h=>`<tr><td>${h.edge}</td><td>${h.op}</td><td>${h.bus}</td><td>${h.a0}</td><td>${h.b0}</td><td><b>${h.a1}</b></td><td><b>${h.b1}</b></td><td>${h.action}</td></tr>`).join('')}
function renderWave(){const w=$('waveform');w.innerHTML='<span style="align-self:center;font:700 .72rem monospace;margin-right:8px">CLK</span>'+state.waves.map(v=>`<div class="wave ${v?'high':''}" title="CLK=${v}"></div>`).join('')}
function reset(){clearTimeout(state.timer);Object.assign(state,{bus:0,A:0,B:0,op:'NOP',armed:false,held:false,clock:0,edges:0,running:false,timer:null,history:[],waves:[],flash:''});render()}
addBitSwitches();
document.querySelectorAll('.instruction').forEach(b=>{
  b.addEventListener('pointerdown',e=>{e.preventDefault();holdInstruction(b.dataset.op,b,e.pointerId);});
  b.addEventListener('pointerup',e=>{e.preventDefault();releaseInstruction();});
  b.addEventListener('pointercancel',()=>{if(state.held){state.held=false;state.armed=false;state.op='NOP';render();}});
  b.addEventListener('contextmenu',e=>e.preventDefault());
});
$('stepClock').onclick=pulse;$('runClock').onclick=startStop;$('reset').onclick=reset;$('speed').oninput=()=>{if(state.running){clearTimeout(state.timer);state.running=false;startStop();}};render();