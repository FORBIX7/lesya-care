'use strict';
const $ = (s) => document.querySelector(s);
const KEY = 'lesya-care-v1';
const localDay = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; };
let state = {day:localDay(), tasks:[], drinks:0, history:[], reminder:null};
let storageOK = true;
try { const saved = JSON.parse(localStorage.getItem(KEY)); if(saved && typeof saved==='object') state = {...state, ...saved}; } catch { storageOK=false; }
if (!Array.isArray(state.tasks)) state.tasks=[];
if (!Array.isArray(state.history)) state.history=[];
state.history=state.history.filter(e=>e && typeof e.mood==='string' && Number.isFinite(e.at)).slice(0,30);
if(!Number.isFinite(state.drinks) || state.drinks<0) state.drinks=0;
if(state.reminder && (!Number.isFinite(state.reminder.at) || state.reminder.at<Date.now()-86400000)) state.reminder=null;
const tasks = [
  ['drink','Пара глоточков тепла','Маленький перерыв для моей лапочки.','☕'],
  ['cozy','Согреть любимые пяточки','Носочки и плед, если зябко. Если жарко — сними лишнее.','🧦'],
  ['rest','Подарить себе тихую минутку','Присесть, расслабить плечи. Без чувства вины.','☁'],
  ['air','Попросить поберечь тебя','Предупредить преподавателя и снизить нагрузку.','🌿'],
  ['food','Не забыть немного поесть','Что-нибудь приятное, когда захочется. По аппетиту.','🍲']
];
const words = ['Котёнок, хочется просто обнять тебя, чмокнуть и увидеть твою улыбку. Скорее бы тебе стало легче.','У тебя такие прекрасные глаза, Леся. Я бы сейчас смотрел в них и никуда не спешил.','Мне нравится гулять с тобой и болтать обо всём подряд. Без особого повода — просто потому, что хочется быть рядом.','Даже короткая встреча с тобой делает мой день приятнее. Особенно если успел тебя обнять.','Ты у меня такая красивая, помидорка. И когда нарядная, и когда просто хочется укутаться.','Мысленно ставлю перед тобой чай. Две ложечки сахара и нежность, которую ложечками не измерить.','Пока увидеться не получается, оставляю тебе эти маленькие объятия. Забирай в любой момент.','Котёнок, я очень переживаю за тебя. Так хочу, чтобы тебе поскорее стало легче. Пожалуйста, побереги себя.'];
let wordIndex=0, toastTimeout;
function toast(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('#toast').hidden=true,6500);}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{storageOK=false;toast('Браузер не даёт сохранить данные. Отметки останутся до закрытия страницы.');}}
function newDay(){if(state.day!==localDay()){state.day=localDay();state.tasks=[];state.drinks=0;save();renderDaily();}}
function renderDaily(){
  $('#day-label').textContent=new Intl.DateTimeFormat('ru',{day:'numeric',month:'long',weekday:'long'}).format(new Date());
  $('#checklist').replaceChildren();
  tasks.forEach(([id,title,sub,emoji])=>{const label=document.createElement('label');label.className='task';const input=document.createElement('input');input.type='checkbox';input.checked=state.tasks.includes(id);const copy=document.createElement('span'),strong=document.createElement('strong'),small=document.createElement('small'),icon=document.createElement('span');strong.textContent=title;small.textContent=sub;copy.append(strong,small);icon.className='task-emoji';icon.textContent=emoji;icon.setAttribute('aria-hidden','true');label.append(input,copy,icon);input.addEventListener('change',()=>{newDay();state.tasks=state.tasks.filter(t=>t!==id);if(input.checked)state.tasks.push(id);save();renderProgress();});$('#checklist').append(label);});
  renderProgress();$('#drink-count').textContent=state.drinks?`Тёплых пауз сегодня: ${state.drinks}`:'Когда захочется, лапочка';
}
function renderProgress(){const count=tasks.filter(t=>state.tasks.includes(t[0])).length;$('#progress-count').textContent=`${count} из 5`;$('#progress-bar').style.width=`${count*20}%`;$('#progress-note').textContent=count===5?'Уют собран. Обнимаю мою лапочку ♡':'Не обязательно отмечать всё. Ты любимая и без галочек.';}
function renderHistory(){const el=$('#history');el.replaceChildren();if(!state.history.length){const p=document.createElement('p');p.className='tiny';p.style.marginTop='14px';p.textContent='Здесь появятся твои отметки. Только если захочешь.';el.append(p);}state.history.slice(0,7).forEach(e=>{const item=document.createElement('div');item.className='history-entry';const time=document.createElement('time');time.dateTime=new Date(e.at).toISOString();time.textContent=new Intl.DateTimeFormat('ru',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(e.at));const title=document.createElement('strong');title.textContent=`${e.mood}${e.temp!==null && e.temp!==undefined?' · '+e.temp+' °C':''}`;item.append(time,title);if(Array.isArray(e.symptoms)&&e.symptoms.length){const tags=document.createElement('p');const labels={throat:'горло',nose:'нос',cough:'кашель',tired:'мало сил',fever:'температура'};tags.className='history-symptoms';tags.textContent=e.symptoms.map(s=>labels[s]).filter(Boolean).join(' · ');if(e.feverDays==='4')tags.textContent+=' · температура больше 3 дней';item.append(tags);}if(e.note){const p=document.createElement('p');p.textContent=e.note;item.append(p);}el.append(item);});}
function route(){const target=location.hash.slice(1);const name=['today','checkin','guide'].includes(target)?target:['help','study-guide'].includes(target)?'guide':'today';document.querySelectorAll('.view').forEach(s=>s.hidden=s.id!==name);document.querySelectorAll('.tabs a').forEach(a=>{const active=a.hash==='#'+name;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});if(['help','study-guide'].includes(target))requestAnimationFrame(()=>document.getElementById(target).scrollIntoView({behavior:'smooth'}));}
window.addEventListener('hashchange',route);route();newDay();renderDaily();renderHistory();
$('#drink-add').addEventListener('click',()=>{newDay();state.drinks++;if(!state.tasks.includes('drink'))state.tasks.push('drink');save();renderDaily();toast('Вот и хорошо, котёнок. Мысленно целую тебя в макушку ♡');});
$('#more-love').addEventListener('click',()=>{$('#kind-word').textContent=words[++wordIndex%words.length];});
$('#urgent').addEventListener('change',()=>{if($('#urgent').checked){$('#feeling-response').textContent='Котёнок, с такими симптомами нужна срочная помощь. Позвони 112 или 103 прямо сейчас, не жди сохранения заметки.';toast('При этих симптомах звони 112 или 103 сейчас.');}});
$('#feeling-form').addEventListener('submit',e=>{
  e.preventDefault();
  const raw=$('#temperature').value.trim().replace(',','.');
  const temp=raw===''?null:Number(raw);
  if(temp!==null&&(!/^\d{2}(\.\d)?$/.test(raw)||!Number.isFinite(temp)||temp<34||temp>43)){
    $('#form-message').textContent='Проверь температуру: например, 37,5. Или оставь поле пустым.';
    $('#temperature').focus();return;
  }
  const mood=new FormData(e.currentTarget).get('mood');
  if(!mood){$('#form-message').textContent='Выбери, как ты себя чувствуешь, лапочка.';return;}
  const urgent=$('#urgent').checked;
  const symptoms=[...document.querySelectorAll('input[name="symptom"]:checked')].map(i=>i.value);
  const feverDays=symptoms.includes('fever')?$('#fever-days').value:'';
  const needsDoctor=(temp!==null&&(temp>=39||temp<35))||feverDays==='4';
  state.history.unshift({at:Date.now(),mood,temp,note:$('#feeling-note').value.trim(),urgent,symptoms,feverDays});
  state.history=state.history.slice(0,30);save();renderHistory();
  const messages={
    'Тяжеловато':'Лапочка, слышу тебя. Сейчас можно попросить помощи и отложить всё посильное. Если состояние тяжёлое или тревожит, свяжись с врачом. Мысленно держу тебя за лапку.',
    'Потихоньку':'Побудем в твоём темпе, котёнок. Пара глоточков, тихая пауза, немного заботы. При температуре, ломоте или сильной слабости физическую нагрузку нужно отложить.',
    'Уже полегче':'Как же приятно это читать, лапочка. Ещё немного побережём тебя: без резкого возвращения ко всем делам. Если снова станет хуже — обратись к врачу.'
  };
  $('#feeling-response').textContent=urgent?'Котёнок, сейчас нужна срочная помощь: позвони 112 или 103. Не жди дальнейших отметок на сайте.':needsDoctor?(feverDays==='4'?'Лапочка, температура больше трёх дней — повод связаться с врачом. Пожалуйста, не откладывай. При трудном дыхании, сильной боли в груди или спутанности сознания — 112.':'Лапочка, с такой температурой лучше скорее связаться с врачом. Если тяжело дышать, болит грудь или быстро становится хуже — звони 112.'):messages[mood];
  $('#form-message').textContent=storageOK?'Твоя минутка сохранена здесь, на устройстве ♡':'Отметка добавлена на время этой сессии. Сохранение в браузере недоступно.';
  document.dispatchEvent(new CustomEvent('care:checkin-saved',{detail:{urgent,needsDoctor}}));
  toast(urgent?'Не жди: позвони 112 или 103.':needsDoctor?'Записал. Пожалуйста, свяжись с врачом.':'Сохранил твою минутку. И маленький чмок в макушку ♡');
});
$('#clear-history').addEventListener('click',()=>{if(state.history.length&&confirm('Удалить все заметки о самочувствии с этого устройства?')){state.history=[];save();renderHistory();toast('Заметки удалены.');}});
$('#reset-data').addEventListener('click',()=>{if(confirm('Стереть отметки, заметки и таймер с этого устройства?')){state={day:localDay(),tasks:[],drinks:0,history:[],reminder:null};save();renderDaily();renderHistory();renderTimer();$('#feeling-form').reset();$('#form-message').textContent='';$('#feeling-response').textContent='Обнимаю, котёнок. Можно начать с чистого листа.';toast('Все данные сайта на этом устройстве стёрты.');document.dispatchEvent(new Event('care:reset'));}});
function renderTimer(){if(!state.reminder){$('#timer-status').textContent='Без спешки. Ты задаёшь свой ритм.';$('#timer-stop')?.remove();return;}const left=Math.max(0,Math.ceil((state.reminder.at-Date.now())/60000));$('#timer-status').textContent=`До глоточка заботы: ${left} мин.`;if(!$('#timer-stop')){const b=document.createElement('button');b.id='timer-stop';b.className='text-button';b.textContent='Отменить таймер';b.addEventListener('click',()=>{state.reminder=null;save();renderTimer();});$('#timer-status').after(b);}}
document.querySelectorAll('[data-timer]').forEach(b=>b.addEventListener('click',()=>{state.reminder={at:Date.now()+Number(b.dataset.timer)*60000};save();renderTimer();toast('Договорились, котёнок. Таймер работает на открытой активной странице.');}));
function tick(){newDay();if(state.reminder&&Date.now()>=state.reminder.at){state.reminder=null;save();renderTimer();toast('Котёнок, твой тихий перерыв. Пара глоточков чая и мысленное объятие от Санечка ♡');}else renderTimer();}renderTimer();setInterval(tick,1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});
function icsDate(d){return d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');}
$('#calendar').addEventListener('click',()=>{const stamp=icsDate(new Date());let text='BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Lesya Care//RU\r\nCALSCALE:GREGORIAN\r\n';[11,15,19].forEach(h=>{const start=new Date();start.setDate(start.getDate()+1);start.setHours(h,0,0,0);const end=new Date(start.getTime()+5*60000);text+=`BEGIN:VEVENT\r\nUID:lesya-${start.getTime()}@care.local\r\nDTSTAMP:${stamp}\r\nDTSTART:${icsDate(start)}\r\nDTEND:${icsDate(end)}\r\nSUMMARY:Глоточек заботы для Леси\r\nDESCRIPTION:Котёнок\\, сделай маленький перерыв. Чёрный чай\\, две ложечки сахара и объятие от твоего Санечка.\r\nBEGIN:VALARM\r\nTRIGGER:PT0M\r\nACTION:DISPLAY\r\nDESCRIPTION:Пора немного позаботиться о себе\r\nEND:VALARM\r\nEND:VEVENT\r\n`;});text+='END:VCALENDAR\r\n';const url=URL.createObjectURL(new Blob([text],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='lesya-care.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);toast('Открой файл в календаре телефона. Проверь три события на завтра и включённые уведомления.');});
if(!storageOK)toast('Локальное сохранение недоступно. Можно пользоваться страницей без сохранения отметок.');
