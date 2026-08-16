'use client';

import { useState, useEffect } from 'react';

export default function Inbox() {
  const [items, setItems] = useState([
    { id: 1, text: '⏰ تذكير: جلسة بومودورو جديدة', time: '14:30', pinned: false },
    { id: 2, text: '📊 الإحصائيات النهاردة: 2/4 جلسات', time: '13:00', pinned: true },
    { id: 3, text: '🔔 تفقّد: الجارديان شغّال 100%', time: '12:00', pinned: false },
  ]);

  useEffect(() => {
    // استقبال من البوت عبر Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.onEvent('viewportChanged', () => {});
    }
  }, []);

  const remove = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));
  const togglePin = (id: number) => setItems((prev) => prev.map((i) => i.id === id ? { ...i, pinned: !i.pinned } : i));

  return (
    <>
      <div className="panel">
        <div className="hud-corner tl" /><div className="hud-corner tr" /><div className="hud-corner bl" /><div className="hud-corner br" />
      <div className="panel-title">🔔 صندوق الإشعارات</div>

      {items.length === 0 && <div style={{ fontSize: 12, color: 'var(--dim)', textAlign: 'center', padding: 10 }}>مفيش رسايل جديدة</div>}

      {items.sort((a, b) => Number(b.pinned) - Number(a.pinned)).map((i) => (
        <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid rgba(0,229,255,0.06)' }}>
          <span style={{ flex: 1, fontSize: 12 }}>{i.pinned ? '📌 ' : ''}{i.text}</span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--dim)' }}>{i.time}</span>
          <button className="btn ghost sm" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => togglePin(i.id)}>📌</button>
          <button className="btn ghost sm danger" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => remove(i.id)}>✕</button>
        </div>
      ))}
    </div>
    </>
  );
}
