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
  else if(c==='ls'&&arg==='-l') write(files.map((f,i)=>`${i%2?'drwxr-xr-x':'-rw-r--r--'} student student ${f}`).join('\n'));
  else write(`Try one of these: pwd, ls, whoami, date, mkdir linux_lab, cd linux_lab, touch test.txt, clear`);
}
input.addEventListener('keydown',e=>{if(e.key==='Enter'){const cmd=input.value;input.value='';run(cmd);setPrompt();}});
setPrompt();