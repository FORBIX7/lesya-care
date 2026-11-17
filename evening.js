'use strict';
(() => {
  const note=document.querySelector('#feeling-note');
  document.querySelectorAll('[data-message]').forEach(button=>button.addEventListener('click',()=>{
    const text=button.dataset.message;
    note.value=note.value.trim()?`${note.value.trim()}${/[.!?…]$/.test(note.value.trim())?' ':'. '}${text.toLowerCase()}`:text;
    note.value=note.value.slice(0,300);
    note.focus();
    document.querySelector('#copy-status').textContent='Можно дописать по-своему или оставить так ♡';
  }));
  document.addEventListener('care:reset',()=>{
    document.querySelector('#health-details').open=false;
    document.querySelector('#checkin-notebook').open=false;
  });
})();
