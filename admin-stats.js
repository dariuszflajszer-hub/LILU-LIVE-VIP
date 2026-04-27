(function(){
  function ready(fn){ if(document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function liveIdFromUrl(url){
    try { return btoa(unescape(encodeURIComponent(url || 'no-live'))).replace(/[^a-zA-Z0-9]/g,'').slice(0,40) || 'default'; }
    catch(e){ return 'default'; }
  }
  function el(tag, attrs, text){
    const node=document.createElement(tag);
    Object.keys(attrs||{}).forEach(k=>node.setAttribute(k,attrs[k]));
    if(text!==undefined) node.textContent=text;
    return node;
  }
  async function loadStats(){
    const box=document.getElementById('adminBox');
    if(!box || !window.firebase) return;
    if(document.getElementById('statsCard')) return;

    const card=el('div',{class:'card',id:'statsCard'});
    card.innerHTML = '<label>STATYSTYKI LIVE</label><div class="muted" id="statsText">Ładuję statystyki...</div><div id="statsRows"></div>';
    box.appendChild(card);

    const db=firebase.firestore();
    const settingsSnap=await db.collection('settings').doc('live').get();
    const settings=settingsSnap.exists ? settingsSnap.data() : {};
    const currentLiveId=liveIdFromUrl(settings.liveUrl || '');
    const eventsSnap=await db.collection('analytics_events').where('liveId','==',currentLiveId).limit(1000).get();

    let push=0, live=0, replay=0;
    const replayDays={};
    eventsSnap.forEach(doc=>{
      const d=doc.data();
      if(d.type==='push_open_30m') push++;
      if(d.type==='live_click') live++;
      if(d.type==='replay_click'){
        replay++;
        const day = d.dayAfterLive === null || d.dayAfterLive === undefined ? 'brak daty' : ('dzień ' + d.dayAfterLive);
        replayDays[day]=(replayDays[day]||0)+1;
      }
    });

    document.getElementById('statsText').innerHTML =
      'Aktualny cykl liczony dla obecnego linku LIVE.<br>'+
      '<b>Wejścia z push:</b> '+push+'<br>'+
      '<b>Kliknięcia LIVE:</b> '+live+'<br>'+
      '<b>Replay łącznie:</b> '+replay;

    const rows=document.getElementById('statsRows');
    rows.innerHTML='';
    const title=el('div',{class:'muted',style:'margin-top:12px;color:#ffd5e7;font-weight:700'},'Replay według dni po live:');
    rows.appendChild(title);
    const keys=Object.keys(replayDays).sort();
    if(!keys.length){ rows.appendChild(el('div',{class:'muted'},'Brak danych replay.')); return; }
    keys.forEach(k=>rows.appendChild(el('div',{class:'muted'},k+': '+replayDays[k])));
  }
  ready(function(){
    if(window.firebase && firebase.auth){ firebase.auth().onAuthStateChanged(user=>{ if(user) setTimeout(loadStats,800); }); }
  });
})();
