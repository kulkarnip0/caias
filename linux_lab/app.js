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

// Add a copy button to every code block automatically.
// This keeps future lab programs consistent without editing each <pre> manually.
function addCopyButtons(){
  $$('pre').forEach(pre=>{
    if(pre.parentElement?.classList.contains('code-block-wrap')) return;

    const wrap=document.createElement('div');
    wrap.className='code-block-wrap';
    pre.parentNode.insertBefore(wrap,pre);
    wrap.appendChild(pre);

    const btn=document.createElement('button');
    btn.className='copy-code-btn';
    btn.type='button';
    btn.setAttribute('aria-label','Copy code to clipboard');
    btn.title='Copy code';
    btn.innerHTML='<span class="copy-icon" aria-hidden="true">⧉</span><span class="copy-label">Copy</span>';
    wrap.appendChild(btn);

    btn.addEventListener('click',async()=>{
      const code=pre.querySelector('code')?.innerText ?? pre.innerText;
      try{
        await navigator.clipboard.writeText(code.replace(/\n$/,''));
        btn.classList.add('copied');
        btn.querySelector('.copy-icon').textContent='✓';
        btn.querySelector('.copy-label').textContent='Copied';
        setTimeout(()=>{
          btn.classList.remove('copied');
          btn.querySelector('.copy-icon').textContent='⧉';
          btn.querySelector('.copy-label').textContent='Copy';
        },1600);
      }catch(err){
        // Fallback for browsers/contexts where Clipboard API is unavailable.
        const area=document.createElement('textarea');
        area.value=code;
        area.style.position='fixed';
        area.style.opacity='0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        area.remove();
        btn.classList.add('copied');
        btn.querySelector('.copy-icon').textContent='✓';
        btn.querySelector('.copy-label').textContent='Copied';
        setTimeout(()=>{
          btn.classList.remove('copied');
          btn.querySelector('.copy-icon').textContent='⧉';
          btn.querySelector('.copy-label').textContent='Copy';
        },1600);
      }
    });
  });
}
addCopyButtons();