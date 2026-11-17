'use strict';
(() => {
  const find = s => document.querySelector(s);
  const letters = [
    {tag:'открыть, когда устала',title:'Лапочка, побереги мою любимую девочку.',text:'Я знаю, у тебя непростая учёба. И очень переживаю, когда тебе плохо, а ты всё равно собираешься делать столько всего. Мне так хочется, чтобы ты поскорее поправлялась. Пожалуйста, попроси помочь, когда тяжело. Тебе не нужно ничего мне доказывать. Ты мне очень дорога — сама по себе, без подвигов.'},
    {tag:'открыть, когда не хватает меня',title:'Мне бы сейчас пять минут с тобой.',text:'Просто увидеть тебя, обнять, чмокнуть — и можно по домам. Даже так совсем ненадолго мне хорошо с тобой. Пока не получается встретиться, держи объятие отсюда. Скучаю, котёнок ♡'},
    {tag:'открыть для маленькой улыбки',title:'Маленькое свидание — тоже свидание.',text:'Когда после занятий совпадёт время, хочется просто пройтись с тобой. Поболтать обо всём подряд, подержать за руку. Без особой программы. Мне хорошо с тобой, помидорка.'},
    {tag:'открыть, когда хочется нежности',title:'Ты знаешь, какие у тебя прекрасные глаза?',text:'Я бы сейчас смотрел в них и забывал, что вообще хотел сказать. Ты такая красивая, Леся. И дело не в том, как ты сегодня одета или причёсана. Ты можешь быть уставшей, сонной, с простудой и без настроения. А я всё равно буду думать: какая же у меня замечательная девочка. И как сильно хочется её обнять.'},
    {tag:'открыть перед сном',title:'Спокойной ночи, моя лапочка.',text:'Очень хочу, чтобы ты выспалась и утром тебе стало полегче. Устраивайся поудобнее, котёнок. Мысленно обнимаю тебя и целую в макушку. Всё остальное завтра. Твой Санечек ♡'},
    {tag:'открыть просто потому что ты',title:'Котёнок, я правда очень за тебя переживаю.',text:'Так хочется забрать у тебя это плохое самочувствие и оставить только уют, тёплую чашку и спокойный день. Я не могу сделать всё одним объятием, но могу напоминать, как ты мне нужна и как я хочу, чтобы ты поскорее почувствовала себя лучше. Не торопи себя ради меня. Просто побереги себя, моя Леся. Ты у меня очень любимая.'}
  ];
  const comforts = {
    tired:{title:'Тебе не нужно тянуть всё одной.',text:'Лапочка, можно попросить помощи и сделать только самое необходимое. Если сейчас есть возможность, присядь на минутку и устройся удобнее. Я за то, чтобы ты берегла себя.',action:'Хочу тихое объятие'},
    sad:{title:'Иди сюда, моя помидорка.',text:'Можно быть грустной. Можно ничего не объяснять. Тебе не нужно срочно развеселиться, чтобы заслужить нежность. Давай просто побудем в этом маленьком уютном месте.',action:'Обними меня'},
    warmth:{title:'Несу тебе целое охапище нежности.',text:'Мысленно поправляю твой плед, ставлю рядом чашку чая и целую в макушку. Никаких заданий на эту минуту. Только немного тепла для моей Леси.',action:'Забрать объятие'}
  };
  let letterIndex=0, lastFocus=null;
  function openDialog(id){lastFocus=document.activeElement;find(id).showModal();}
  function closeDialog(dialog){dialog.close();lastFocus?.focus();}
  function showLetter(index){letterIndex=index%letters.length;const letter=letters[letterIndex];find('#letter-tag').textContent=letter.tag;find('#letter-title').textContent=letter.title;find('#letter-text').textContent=letter.text;find('#letter-number').textContent=`${letterIndex+1} / ${letters.length}`;}
  document.querySelectorAll('[data-letter]').forEach(button=>button.addEventListener('click',()=>{showLetter(Number(button.dataset.letter));openDialog('#letter-dialog');}));
  find('#next-letter').addEventListener('click',()=>showLetter(letterIndex+1));
  function hug(){if(!find('#hug-dialog').open)openDialog('#hug-dialog');}
  document.querySelectorAll('[data-hug]').forEach(button=>button.addEventListener('click',hug));
  document.querySelectorAll('[data-close-dialog]').forEach(button=>button.addEventListener('click',()=>closeDialog(button.closest('dialog'))));
  document.querySelectorAll('dialog').forEach(dialog=>{dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(dialog);}});dialog.addEventListener('cancel',()=>{setTimeout(()=>lastFocus?.focus(),0);});});
  document.querySelectorAll('[data-comfort]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-comfort]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));const c=comforts[button.dataset.comfort];find('#comfort-title').textContent=c.title;find('#comfort-text').textContent=c.text;find('#comfort-hug').textContent=c.action+' ♡';find('#comfort-response').hidden=false;}));
  const petMessages=['Ну всё, хвостик счастлив. И ты немножко улыбнись, если хочется ♡','Передаю тебе одно мягкое «тыф» и очень тёплый бочок.','Служба маленьких лап сообщает: ты любимая. Очень.','Корги официально разрешает сегодня быть сонной булочкой.'];
  let pets=0;
  find('#pet-corgi').addEventListener('click',()=>{find('#pet-message').textContent=petMessages[pets++%petMessages.length];const image=find('.corgi-image');image.classList.remove('petted');void image.offsetWidth;image.classList.add('petted');});
  const themeKey='lesya-care-evening';
  function setEvening(evening){document.documentElement.classList.toggle('evening',evening);find('#evening-toggle').setAttribute('aria-pressed',String(evening));find('#evening-toggle').textContent=evening?'☀ Вернуть дневной свет':'☾ Сделать свет потише';document.querySelector('meta[name="theme-color"]').content=evening?'#283545':'#f7f3eb';}
  try{setEvening(localStorage.getItem(themeKey)==='true');}catch{setEvening(false);}
  find('#evening-toggle').addEventListener('click',()=>{const evening=!document.documentElement.classList.contains('evening');setEvening(evening);try{localStorage.setItem(themeKey,String(evening));}catch{}});
  document.addEventListener('care:reset',()=>{setEvening(false);try{localStorage.removeItem(themeKey);}catch{}});
})();
