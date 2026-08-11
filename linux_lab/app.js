const $$=s=>[...document.querySelectorAll(s)];
$$('.chapter-nav button').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.target)?.scrollIntoView({behavior:'smooth'}));

const input=document.getElementById('termInput');
const output=document.getElementById('termOutput');
const promptText=document.getElementById('promptText');
let cwd='~';
let files=['Desktop','Documents','Downloads'];

function write(line=''){
  output.textContent += (output.textContent?'\n':'') + line;
  output.scrollTop=output.scrollHeight;
}
function setPrompt(){promptText.textContent=`student@ubuntu:${cwd}$`;}
function run(cmd){
  write(`${promptText.textContent} ${cmd}`);
  const parts=cmd.trim().split(/\s+/), c=parts[0], arg=parts.slice(1).join(' ');
  if(!c)return;
  if(c==='pwd') write(cwd==='~'?'/home/student':`/home/student/${cwd.replace('~/','')}`);
  else if(c==='whoami') write('student');
  else if(c==='ls'&&arg==='-l') write(files.map((f,i)=>`${i%2?'drwxr-xr-x':'-rw-r--r--'} student student ${f}`).join('\n'));
  else if(c==='ls') write(files.join('  '));
  else if(c==='date') write(new Date().toString());
  else if(c==='clear'){output.textContent='';return;}
  else if(c==='mkdir' && arg){if(!files.includes(arg))files.push(arg); write('Directory created: '+arg);}
  else if(c==='touch' && arg){if(!files.includes(arg))files.push(arg); write('File created: '+arg);}
  else if(c==='cd'){
    if(!arg||arg==='~'){cwd='~'; write('Moved to home directory.');}
    else if(files.includes(arg)){cwd=`~/${arg}`; write(`Now inside ${arg}.`);}
    else if(arg==='..'){cwd='~'; write('Moved to parent directory.');}
    else write(`bash: cd: ${arg}: No such file or directory`);
  }
  else write(`Try one of these: pwd, ls, ls -l, whoami, date, mkdir linux_lab, cd linux_lab, touch test.txt, clear`);
}
input.addEventListener('keydown',e=>{if(e.key==='Enter'){const cmd=input.value;input.value='';run(cmd);setPrompt();}});
setPrompt();

function getCode(pre){
  return (pre.querySelector('code')?.innerText ?? pre.innerText).replace(/\n$/,'');
}

function suggestedFilename(pre,index){
  const code=getCode(pre);
  if(code.includes('for ((num=m; num<=n; num++))')) return 'prime.sh';
  if(code.includes('original=$num') && code.includes('reverse=0')) return 'palindrome.sh';
  if(code.includes('while (( n > 0 ))') && code.includes('sum=$(( sum + digit ))')) return 'sum_loop.sh';
  if(code.includes('grep -o .') && code.includes('paste -sd+')) return 'sum_no_loop.sh';
  if(code.startsWith('#!/bin/bash')) return `shell_program_${index+1}.sh`;
  return `linux_lab_snippet_${index+1}.txt`;
}

function downloadTextFile(text,filename){
  const blob=new Blob([text+'\n'],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function addCodeActions(){
  $$('pre').forEach((pre,index)=>{
    if(pre.parentElement?.classList.contains('code-block-wrap')) return;
    const wrap=document.createElement('div');
    wrap.className='code-block-wrap';
    pre.parentNode.insertBefore(wrap,pre);
    wrap.appendChild(pre);
    const actions=document.createElement('div');
    actions.className='code-actions';
    wrap.appendChild(actions);
    const copyBtn=document.createElement('button');
    copyBtn.className='code-action-btn copy-code-btn';
    copyBtn.type='button';
    copyBtn.setAttribute('aria-label','Copy code to clipboard');
    copyBtn.title='Copy code';
    copyBtn.innerHTML='<span class="action-icon" aria-hidden="true">⧉</span><span class="action-label">Copy</span>';
    actions.appendChild(copyBtn);
    const saveBtn=document.createElement('button');
    saveBtn.className='code-action-btn save-code-btn';
    saveBtn.type='button';
    saveBtn.setAttribute('aria-label','Save code to file');
    saveBtn.title='Save code to file';
    saveBtn.innerHTML='<span class="action-icon" aria-hidden="true">↓</span><span class="action-label">Save file</span>';
    actions.appendChild(saveBtn);
    copyBtn.addEventListener('click',async()=>{
      const code=getCode(pre);
      try{await navigator.clipboard.writeText(code);}catch(err){const area=document.createElement('textarea');area.value=code;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();document.execCommand('copy');area.remove();}
      copyBtn.classList.add('success');copyBtn.querySelector('.action-icon').textContent='✓';copyBtn.querySelector('.action-label').textContent='Copied';setTimeout(()=>{copyBtn.classList.remove('success');copyBtn.querySelector('.action-icon').textContent='⧉';copyBtn.querySelector('.action-label').textContent='Copy';},1600);
    });
    saveBtn.addEventListener('click',()=>{
      const filename=suggestedFilename(pre,index);downloadTextFile(getCode(pre),filename);saveBtn.classList.add('success');saveBtn.querySelector('.action-icon').textContent='✓';saveBtn.querySelector('.action-label').textContent=`Saved ${filename}`;setTimeout(()=>{saveBtn.classList.remove('success');saveBtn.querySelector('.action-icon').textContent='↓';saveBtn.querySelector('.action-label').textContent='Save file';},1800);
    });
  });
}
addCodeActions();

// Add a clearly visible link to the interactive line-by-line execution walkthrough.
function addProgramFlowLinks(){
  const hero=document.querySelector('.hero');
  if(hero && !document.querySelector('.program-flow-link')){
    const a=document.createElement('a');
    a.href='program-flow.html';
    a.className='primary-link program-flow-link';
    a.style.marginLeft='10px';
    a.textContent='▶ Program flow — line by line';
    hero.appendChild(a);
  }
  ['p1','p2','p3'].forEach((id,i)=>{
    const section=document.getElementById(id); if(!section)return;
    const head=section.querySelector('.chapter-head > div'); if(!head||head.querySelector('.flow-detail-link'))return;
    const a=document.createElement('a');a.href=`program-flow.html#${['prime','palindrome','sumloop'][i]}`;a.className='primary-link flow-detail-link';a.style.marginTop='12px';a.textContent='▶ See this program execute line by line';head.appendChild(a);
  });
}
addProgramFlowLinks();