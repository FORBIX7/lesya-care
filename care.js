'use strict';
(() => {
  const $ = s => document.querySelector(s);
  const tips = {
    throat:{title:'Горлышку — помягче',intro:'Котёнок, давай без всего обжигающего и раздражающего.',steps:['Сделай несколько глотков тёплого напитка, если хочется.','Леденец для горла может немного смягчить раздражение. Используй по инструкции.','Отдохни от дыма и побереги голос, если говорить неприятно.'],note:'Если трудно дышать или не получается глотать жидкость — нужна срочная медицинская помощь.'},
    nose:{title:'Носик, давай дружить',intro:'Помидорке и без заложенного носа есть чем заняться.',steps:['Готовый солевой спрей или капли могут облегчить заложенность.','Держи мягкие салфетки рядом и мой руки после них.','Проветри комнату. Пар над кипятком пропускаем: можно обжечься.'],note:'Лечебные сосудосуживающие спреи подходят не всем. Следуй инструкции; не используй дольше указанного срока.'},
    cough:{title:'Кашлю — поменьше поводов',intro:'Устроимся так, чтобы горлу было приятнее.',steps:['Попробуй тёплый напиток небольшими глотками.','Можно рассосать подходящий леденец по инструкции.','Избегай дыма. Чистый увлажнитель может помочь, если воздух сухой.'],note:'Одышка, постоянная боль в груди или резкое ухудшение — повод для срочной помощи. Кашель дольше 3 недель обсуди с врачом.'},
    tired:{title:'Режим маленькой булочки',intro:'Сегодня у нас нет соревнования по стойкости.',steps:['По возможности сократи дела и попроси помочь с самым тяжёлым.','Пей по жажде и поешь, когда появится аппетит.','Выдели время на сон. При температуре, ломоте или выраженной слабости отложи физическую нагрузку.'],note:'Нарастающая или необычно сильная слабость — повод обратиться к врачу. Если трудно проснуться или путается сознание — звони 112.'},
    fever:{title:'Если поднялась температура',intro:'Лапочка, сейчас особенно важно поберечь силы.',steps:['Отложи физическую нагрузку и по возможности оставайся дома.','Не кутайся до пота. Выбери одежду и плед так, чтобы не было жарко.','Средство от боли или температуры подбирай с врачом или фармацевтом; соблюдай инструкцию и не дублируй вещества в разных препаратах.'],note:'Температура дольше 3 дней, обезвоживание или ухудшение после улучшения — свяжись с врачом. При тяжёлом состоянии не жди этих сроков.'}
  };
  document.querySelectorAll('[data-guide]').forEach(button=>button.addEventListener('click',()=>selectTip(button.dataset.guide)));
  function selectTip(key){const tip=tips[key]||tips.throat;document.querySelectorAll('[data-guide]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.guide===key)));$('#tip-title').textContent=tip.title;$('#tip-intro').textContent=tip.intro;$('#tip-steps').replaceChildren(...tip.steps.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));$('#tip-note').textContent=tip.note;}
  selectTip('throat');
  document.addEventListener('care:tip',e=>{if(tips[e.detail])selectTip(e.detail);});
  const joys=[
    ['Пледик на плечи','Если зябко — укутайся. Если жарко, пледу тоже можно отдохнуть.'],
    ['Душик и мягкая пижама','Если есть силы, короткий тёплый душ может быть просто приятным. Не горячий. При слабости или головокружении отложи.'],
    ['Чистая наволочка','Маленькая роскошь: свежая наволочка и щекой в прохладный хлопок.'],
    ['Сериал без экзамена по сюжету','Что-нибудь знакомое, где можно задремать и ничего не потерять.'],
    ['Обнять подушку за Санечка','На эту минутку она назначается заместителем по обнимашкам.'],
    ['Свет потише, заботы поближе','Включи вечерний режим. Суета пусть немного посидит за дверью.'],
    ['Чашка и любимое окошко','Устройся удобно и посмотри, что там делает мир. Пять минут без великих задач.'],
    ['Очень серьёзное поручение','Погладить корги на главной. Он переживает, что его пушистость простаивает.']
  ];
  let joy=0;
  $('#bring-joy').addEventListener('click',()=>{const item=joys[joy++%joys.length];$('#joy-title').textContent=item[0];$('#joy-text').textContent=item[1];$('#joy-delivery').hidden=false;burst($('#bring-joy'));});
  const plans=[
    ['Пять минут на объятие','Увидеться после занятий, крепко обняться и по домам. Даже маленькой встречи с тобой я буду очень рад.'],
    ['Полчасика пройтись','Если совпадёт время и у тебя будут силы — немного погулять, поболтать и подержаться за руки.'],
    ['Час на маленькое свидание','Ничего особенного придумывать не обязательно. Хочется просто побыть с тобой, когда получится увидеться.'],
    ['Встреча без спешки','Когда у нас обоих будет время — погулять подольше. А пока ты болеешь, этот план спокойно подождёт.']
  ];
  let plan=0;
  $('#open-jar').addEventListener('click',()=>{const item=plans[plan++%plans.length];$('#plan-title').textContent=item[0];$('#plan-text').textContent=item[1];$('#jar-note').hidden=false;$('#jar-note').classList.remove('slip-in');void $('#jar-note').offsetWidth;$('#jar-note').classList.add('slip-in');$('#open-jar').textContent='Вытащить ещё одну ♡';burst($('#open-jar'));});
  function burst(button){if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;const r=button.getBoundingClientRect();for(let i=0;i<5;i++){const h=document.createElement('span');h.className='little-heart';h.textContent=i%2?'♡':'✧';h.style.left=`${r.left+r.width/2}px`;h.style.top=`${r.top+r.height/2}px`;h.style.setProperty('--fly-x',`${(i-2)*25}px`);h.style.setProperty('--fly-y',`${-50-(i%3)*15}px`);document.body.append(h);setTimeout(()=>h.remove(),1100);}}
  $('#pet-corgi').addEventListener('click',e=>burst(e.currentTarget));
  let needsDoctor=false;
  document.addEventListener('care:checkin-saved',e=>{needsDoctor=e.detail.needsDoctor;$('#checkin-support').hidden=e.detail.urgent;$('#support-tip').textContent=needsDoctor?'Когда нужен врач ↗':'Что может облегчить состояние ↗';});
  document.addEventListener('care:reset',()=>{needsDoctor=false;$('#checkin-support').hidden=true;$('#copy-status').textContent='';$('#copy-fallback').hidden=true;$('#copy-fallback').value='';$('#urgent-checkin').hidden=true;$('#fever-days-wrap').hidden=true;$('#checkin-live').textContent='Любой ответ подходит. Ты у меня любимая во всех состояниях.';});
  $('#urgent').addEventListener('change',()=>{$('#urgent-checkin').hidden=!$('#urgent').checked;if($('#urgent').checked)$('#checkin-support').hidden=true;});
  document.querySelectorAll('input[name="mood"]').forEach(input=>input.addEventListener('change',()=>{const copy={Тяжеловато:'Иди сюда, лапочка. Можно попросить помощи. Давай сейчас выберем только один посильный шаг.',Потихоньку:'Потихоньку — тоже хорошо, котёнок. Спешить и геройствовать не нужно.', 'Уже полегче':'Как я рад, лапочка. Ещё побережём тебя — ко всем делам успеешь вернуться.'};$('#checkin-live').textContent=copy[input.value];}));
  const symptomInputs=()=>[...document.querySelectorAll('input[name="symptom"]:checked')];
  document.querySelectorAll('input[name="symptom"]').forEach(input=>input.addEventListener('change',()=>{$('#fever-days-wrap').hidden=!symptomInputs().some(i=>i.value==='fever');}));
  $('#copy-checkin').addEventListener('click',async()=>{if($('#urgent').checked){$('#copy-status').textContent='При этих симптомах сначала позвони 112 или 103. Не откладывай помощь ради сообщения.';return;}const mood=document.querySelector('input[name="mood"]:checked')?.value;if(!mood){$('#copy-status').textContent='Сначала выбери, как ты себя чувствуешь, котёнок.';return;}const raw=$('#temperature').value.trim();const symptoms=symptomInputs().map(i=>i.dataset.label);const note=$('#feeling-note').value.trim();const message=`Санечек, я сейчас: ${mood.toLowerCase()}.${symptoms.length?' Беспокоит: '+symptoms.join(', ')+'.':''}${raw?' Температура: '+raw+' °C.':''}${note?' '+note:''}`;try{await navigator.clipboard.writeText(message);$('#copy-status').textContent='Скопировано. Можешь вставить в ваш чат. Само ничего не отправилось ♡';}catch{$('#copy-fallback').hidden=false;$('#copy-fallback').value=message;$('#copy-fallback').focus();$('#copy-fallback').select();$('#copy-status').textContent='Скопируй выделенный текст и отправь Санечку, если захочешь.';}});
  $('#support-tip').addEventListener('click',()=>{if(needsDoctor){location.hash='#help';return;}const selected=symptomInputs()[0]?.value;selectTip(selected||'tired');location.hash='#guide';});
})();
