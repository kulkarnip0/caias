const programs = {
  prime: {
    title: 'Lab 1 — Prime numbers between M and N',
    sample: 'Sample input: M = 10, N = 15 → Expected output: 11 13',
    badge: 'FOR LOOP + NESTED LOOP',
    code: [
      '#!/bin/bash',
      'echo "Enter M:"',
      'read m',
      'echo "Enter N:"',
      'read n',
      'for ((num=m; num<=n; num++))',
      'do',
      '    if (( num < 2 )); then',
      '        continue',
      '    fi',
      '    prime=1',
      '    for ((i=2; i*i<=num; i++))',
      '    do',
      '        if (( num % i == 0 )); then',
      '            prime=0',
      '            break',
      '        fi',
      '    done',
      '    if (( prime == 1 )); then',
      '        echo -n "$num "',
      '    fi',
      'done',
      'echo'
    ],
    steps: [
      [2,'Ask for M','The shell prints a prompt asking for the starting value M.',{},'Enter M:'],
      [3,'Read M','Type 10. The read command stores 10 in variable m.',{m:10},'Enter M:\n10'],
      [4,'Ask for N','The shell asks for the ending value N.',{m:10},'Enter M:\n10\nEnter N:'],
      [5,'Read N','Type 15. Now m=10 and n=15.',{m:10,n:15},'Enter M:\n10\nEnter N:\n15'],
      [6,'Start outer loop','num starts at 10. The loop will test each number from 10 through 15.',{m:10,n:15,num:10},'Enter M:\n10\nEnter N:\n15'],
      [11,'Assume 10 is prime','prime=1 means: assume the number is prime until we find a divisor.',{num:10,prime:1},'Enter M:\n10\nEnter N:\n15'],
      [12,'Try divisor 2','The inner loop begins with i=2.',{num:10,prime:1,i:2},'Enter M:\n10\nEnter N:\n15'],
      [14,'Check remainder','10 % 2 = 0. So 10 is exactly divisible by 2.',{num:10,i:2,remainder:0},'Enter M:\n10\nEnter N:\n15'],
      [15,'Mark 10 as not prime','prime becomes 0, because a divisor was found.',{num:10,prime:0},'Enter M:\n10\nEnter N:\n15'],
      [6,'Move to 11','The outer loop increments num. Now num=11.',{num:11},'Enter M:\n10\nEnter N:\n15'],
      [11,'Assume 11 is prime','Reset prime=1 for this new candidate.',{num:11,prime:1},'Enter M:\n10\nEnter N:\n15'],
      [12,'Test 2 and 3','11 is not divisible by 2 or 3. No divisor is found up to √11.',{num:11,prime:1,tested:'2, 3'},'Enter M:\n10\nEnter N:\n15'],
      [19,'Prime test succeeds','prime is still 1, therefore 11 is prime.',{num:11,prime:1},'Enter M:\n10\nEnter N:\n15'],
      [20,'Print 11','echo -n prints 11 and keeps the cursor on the same line.',{num:11},'Enter M:\n10\nEnter N:\n15\n11 '],
      [6,'Continue with 12, 13, 14, 15','12 is divisible by 2; 13 has no divisor; 14 is divisible by 2; 15 is divisible by 3.',{result:'12 ✗, 13 ✓, 14 ✗, 15 ✗'},'Enter M:\n10\nEnter N:\n15\n11 13 '],
      [23,'Finish','The last echo moves to the next line. Final output is 11 13.',{final:'11 13'},'Enter M:\n10\nEnter N:\n15\n11 13']
    ]
  },
  palindrome: {
    title: 'Lab 2 — Reverse a number and check palindrome',
    sample: 'Sample input: 121 → Expected output: Reversed number 121; 121 is a palindrome',
    badge: 'WHILE LOOP',
    code: [
      '#!/bin/bash','echo "Enter a number:"','read num','original=$num','reverse=0','while (( num > 0 ))','do','    digit=$(( num % 10 ))','    reverse=$(( reverse * 10 + digit ))','    num=$(( num / 10 ))','done','echo "Reversed number: $reverse"','if (( original == reverse )); then','    echo "$original is a palindrome"','else','    echo "$original is not a palindrome"','fi'
    ],
    steps: [
      [2,'Ask for a number','The program asks the user to enter a number.',{},'Enter a number:'],
      [3,'Read 121','Type 121. The shell stores it in num.',{num:121},'Enter a number:\n121'],
      [4,'Save the original','original gets 121 because num will change inside the loop.',{num:121,original:121},'Enter a number:\n121'],
      [5,'Initialize reverse','reverse starts at 0.',{num:121,original:121,reverse:0},'Enter a number:\n121'],
      [8,'Take the last digit','121 % 10 = 1. Modulo 10 gives the last digit.',{num:121,digit:1,reverse:0},'Enter a number:\n121'],
      [9,'Build reversed number','reverse = 0 × 10 + 1 = 1.',{num:121,digit:1,reverse:1},'Enter a number:\n121'],
      [10,'Remove the last digit','121 / 10 = 12 in integer arithmetic.',{num:12,reverse:1},'Enter a number:\n121'],
      [8,'Second iteration','12 % 10 = 2.',{num:12,digit:2,reverse:1},'Enter a number:\n121'],
      [9,'Append 2','reverse = 1 × 10 + 2 = 12.',{num:12,digit:2,reverse:12},'Enter a number:\n121'],
      [10,'Remove 2','12 / 10 = 1.',{num:1,reverse:12},'Enter a number:\n121'],
      [8,'Third iteration','1 % 10 = 1.',{num:1,digit:1,reverse:12},'Enter a number:\n121'],
      [9,'Append final 1','reverse = 12 × 10 + 1 = 121.',{num:1,digit:1,reverse:121},'Enter a number:\n121'],
      [10,'Loop ends','1 / 10 = 0. num becomes 0, so the while loop stops.',{num:0,reverse:121},'Enter a number:\n121'],
      [12,'Print reverse','The program prints the completed reversed value.',{original:121,reverse:121},'Enter a number:\n121\nReversed number: 121'],
      [13,'Compare values','original == reverse means 121 == 121, which is true.',{original:121,reverse:121},'Enter a number:\n121\nReversed number: 121'],
      [14,'Print result','Because both values are equal, 121 is a palindrome.',{result:'palindrome'},'Enter a number:\n121\nReversed number: 121\n121 is a palindrome']
    ]
  },
  sumloop: {
    title: 'Lab 3A — Sum of digits using a loop',
    sample: 'Sample input: 583 → Expected output: Sum of digits = 16',
    badge: 'WHILE LOOP',
    code: [
      '#!/bin/bash','echo "Enter a number:"','read num','sum=0','n=$num','while (( n > 0 ))','do','    digit=$(( n % 10 ))','    sum=$(( sum + digit ))','    n=$(( n / 10 ))','done','echo "Sum of digits = $sum"'
    ],
    steps: [
      [2,'Ask for input','The shell asks for a number.',{},'Enter a number:'],
      [3,'Read 583','num receives 583.',{num:583},'Enter a number:\n583'],
      [4,'Initialize sum','sum starts at 0 because no digit has been added yet.',{num:583,sum:0},'Enter a number:\n583'],
      [5,'Create working copy','n gets 583. We change n while keeping num unchanged.',{num:583,n:583,sum:0},'Enter a number:\n583'],
      [8,'Extract 3','583 % 10 = 3.',{n:583,digit:3,sum:0},'Enter a number:\n583'],
      [9,'Add 3','sum = 0 + 3 = 3.',{n:583,digit:3,sum:3},'Enter a number:\n583'],
      [10,'Remove 3','583 / 10 = 58.',{n:58,sum:3},'Enter a number:\n583'],
      [8,'Extract 8','58 % 10 = 8.',{n:58,digit:8,sum:3},'Enter a number:\n583'],
      [9,'Add 8','sum = 3 + 8 = 11.',{n:58,digit:8,sum:11},'Enter a number:\n583'],
      [10,'Remove 8','58 / 10 = 5.',{n:5,sum:11},'Enter a number:\n583'],
      [8,'Extract 5','5 % 10 = 5.',{n:5,digit:5,sum:11},'Enter a number:\n583'],
      [9,'Add 5','sum = 11 + 5 = 16.',{n:5,digit:5,sum:16},'Enter a number:\n583'],
      [10,'End loop','5 / 10 = 0, so n becomes 0 and the loop ends.',{n:0,sum:16},'Enter a number:\n583'],
      [12,'Print result','The final value of sum is 16.',{sum:16},'Enter a number:\n583\nSum of digits = 16']
    ]
  },
  sumnoloop: {
    title: 'Lab 3B — Sum of digits without an explicit shell loop',
    sample: 'Sample input: 583 → Expected output: Sum of digits = 16',
    badge: 'PIPELINE',
    code: [
      '#!/bin/bash','echo "Enter a number:"','read num','sum=$(echo "$num" | grep -o . | paste -sd+ - | bc)','echo "Sum of digits = $sum"'
    ],
    steps: [
      [2,'Ask for input','The shell asks for a number.',{},'Enter a number:'],
      [3,'Read 583','num contains 583.',{num:583},'Enter a number:\n583'],
      [4,'echo sends 583','echo outputs 583 into the pipeline.',{pipeline:'583'},'Enter a number:\n583'],
      [4,'grep separates digits','grep -o . produces one character per line: 5, 8, 3.',{pipeline:'5\n8\n3'},'Enter a number:\n583'],
      [4,'paste inserts +','paste -sd+ - joins those lines as 5+8+3.',{pipeline:'5+8+3'},'Enter a number:\n583'],
      [4,'bc calculates','bc evaluates 5+8+3 and returns 16. $(...) stores 16 in sum.',{expression:'5+8+3',sum:16},'Enter a number:\n583'],
      [5,'Print result','The final value in sum is printed.',{sum:16},'Enter a number:\n583\nSum of digits = 16']
    ]
  }
};

let current = 'prime';
let stepIndex = -1;
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

function escapeHtml(text){
  return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderProgram(){
  const p = programs[current];
  $('#flowBadge').textContent = p.badge;
  $('#flowTitle').textContent = p.title;
  $('#flowSample').textContent = p.sample;
  $('#codeLines').innerHTML = p.code.map((line,i) => `<div class="code-line" data-line="${i+1}"><span>${escapeHtml(line) || '&nbsp;'}</span></div>`).join('');
  stepIndex = -1;
  renderStep();
}

function renderStep(){
  const p = programs[current];
  const lines = $$('.code-line');
  lines.forEach(el => el.classList.remove('active'));

  if(stepIndex < 0){
    $('#stepLabel').textContent = 'READY';
    $('#stepHeading').textContent = 'Press Start';
    $('#explain').textContent = 'Click Start. The exact line being executed will highlight on the left. On the right you will see what that line means, current variable values, and the output produced so far.';
    $('#stateGrid').innerHTML = '<div class="state-card"><b>Variables</b>Not started</div>';
    $('#flowOutput').textContent = 'Waiting to start…';
    $('#prevFlow').disabled = true;
    $('#nextFlow').disabled = false;
    $('#nextFlow').textContent = 'Start →';
    return;
  }

  const [line, heading, explanation, state, output] = p.steps[stepIndex];
  const active = lines[line-1];
  if(active){
    active.classList.add('active');
    active.scrollIntoView({block:'nearest',behavior:'smooth'});
  }

  $('#stepLabel').textContent = `STEP ${stepIndex+1} OF ${p.steps.length} · LINE ${line}`;
  $('#stepHeading').textContent = heading;
  $('#explain').textContent = explanation;
  const entries = Object.entries(state || {});
  $('#stateGrid').innerHTML = entries.length
    ? entries.map(([k,v]) => `<div class="state-card"><b>${escapeHtml(k)}</b>${escapeHtml(v).replace(/\n/g,'<br>')}</div>`).join('')
    : '<div class="state-card"><b>Variables</b>No value changed on this line</div>';
  $('#flowOutput').textContent = output || '';
  $('#prevFlow').disabled = stepIndex === 0;
  const finished = stepIndex === p.steps.length - 1;
  $('#nextFlow').disabled = finished;
  $('#nextFlow').textContent = finished ? 'Finished ✓' : 'Next line →';
}

$$('.flow-tabs button').forEach(button => {
  button.addEventListener('click', () => {
    current = button.dataset.prog;
    $$('.flow-tabs button').forEach(b => b.classList.toggle('active', b === button));
    renderProgram();
  });
});

$('#nextFlow').addEventListener('click', () => {
  if(stepIndex < programs[current].steps.length - 1){
    stepIndex += 1;
    renderStep();
  }
});

$('#prevFlow').addEventListener('click', () => {
  if(stepIndex > 0){
    stepIndex -= 1;
    renderStep();
  }
});

$('#restartFlow').addEventListener('click', () => {
  stepIndex = -1;
  renderStep();
});

renderProgram();
