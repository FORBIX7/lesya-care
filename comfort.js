'use strict';
(() => {
  const find = s => document.querySelector(s);
  const letters = [
    {tag:'когда устала',title:'Лапочка моя.',text:'Очень переживаю за тебя. Хочу, чтобы тебе стало легче. Если сил совсем мало, можешь так и сказать мне. Можно быть сонной, грустной, без настроения. Я всё равно хочу тебя обнять.'},
    {tag:'когда не хватает меня',title:'Я очень скучаю. Так хочу обнять.',text:'Мне бы сейчас увидеть тебя хотя бы на пять минут. Обнять, чмокнуть — и можно по домам. Даже такой маленькой встрече я буду рад. А пока держи моё объятие отсюда, лапочка ♡'},
    {tag:'для маленькой улыбки',title:'Маленькое свидание?',text:'Когда получится увидеться, давай просто пройдёмся. Поболтаем обо всём подряд, подержимся за руки. Без особой программы. Мне просто хорошо с тобой, помидорка.'},
    {tag:'да, опять любуюсь',title:'Красотааа моя.',text:'У тебя такие прекрасные глаза. Вот бы сейчас посмотреть в них, улыбнуться тебе и обнять. Ну какая же ты милааашка, Леся. Очень хочу увидеть тебя.'},
    {tag:'перед сном',title:'Спокойной ночи, лапочка.',text:'Хочу, чтобы ты выспалась и утром тебе стало полегче. Мысленно чмокнул в макушку, обнял и ещё немножко подержал рядом. Скучаю. Твой Санечек ♡'},
    {tag:'если слова не подбираются',title:'Мне можно написать как есть.',text:'Можно без «всё нормально», если оно не нормально. Можно просто «хочется внимания» или «побудь со мной». Я хочу знать, как ты, и быть рядом. А если пока хочется помолчать — тоже обниму.'}
  ];
  const comforts = {
    tired:{title:'Лапочка моя, иди обниму.',text:'Не буду сейчас душнить. Можешь просто побыть тут. А если хочется рассказать, как прошёл день, я хочу тебя послушать.',action:'Обними'},
    sad:{title:'Иди ко мне, лапочка.',text:'Можно без улыбки и хорошего настроения. Ты моя лапочка. Если захочешь, напиши мне как есть — даже парой слов.',action:'Хочу к тебе'},
    warmth:{title:'Капец согласен. Я очень скучаю.',text:'Так хочу обнять. Увидеть тебя, чмокнуть и немножко побыть рядом. Лови пока мою обнимашку отсюда ♡',action:'Забрать обнимашку'}
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
