(function(){
  if (!window.firebase || !firebase.firestore) return;
  const db = firebase.firestore();
  const params = new URLSearchParams(location.search);

  function dayKey(date){
    return date.toISOString().slice(0,10);
  }

  async function getLiveSettings(){
    const snap = await db.collection('settings').doc('live').get();
    return snap.exists ? snap.data() : {};
  }

  function makeLiveId(settings){
    return settings.liveId || btoa(unescape(encodeURIComponent(settings.liveUrl || 'no-live'))).replace(/[^a-zA-Z0-9]/g,'').slice(0,40) || 'default';
  }

  async function track(type){
    try{
      const settings = await getLiveSettings();
      const liveId = makeLiveId(settings);
      const now = new Date();
      let dayAfterLive = null;
      if (settings.liveStartedAt && settings.liveStartedAt.toDate) {
        const start = settings.liveStartedAt.toDate();
        dayAfterLive = Math.max(0, Math.floor((now - start) / 86400000));
      }
      await db.collection('analytics_events').add({
        type,
        liveId,
        day: dayKey(now),
        dayAfterLive,
        isLive: !!settings.isLive,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        ua: navigator.userAgent.slice(0,180)
      });
    }catch(e){ console.warn('Analytics skipped', e); }
  }

  if (params.get('from') === 'push') track('push_open_30m');

  document.addEventListener('click', function(e){
    const btn = e.target.closest('#mainBtn');
    if (!btn) return;
    const txt = (btn.innerText || '').toUpperCase();
    if (txt.includes('DOŁĄCZ')) track('live_click');
    if (txt.includes('POWTÓRK')) track('replay_click');
  }, true);
})();
