'use client';

import { useState, useEffect, useRef } from 'react';

export default function StudyCore() {
  const [sessions, setSessions] = useState(1);
  const [type, setType] = useState<'work' | 'break' | 'long'>('work');
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const row = useRef(0);

  const durations = { work: 25 * 60, break: 5 * 60, long: 15 * 60 };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            if (type === 'work') {
              row.current += 1;
              setSessions((x) => x + 1);
              if (row.current >= 4) { row.current = 0; setType('long'); setSeconds(durations.long); }
              else { setType('break'); setSeconds(durations.break); }
            } else { setType('work'); setSeconds(durations.work); }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
      return () => clearInterval(intervalRef.current!);
    }
  }, [running, type]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const pct = ((durations[type] - seconds) / durations[type]) * 100;

  const labels = { work: '🍅 شغل', break: '☕ راحة', long: '🌴 طويلة' };
  const colors = { work: 'var(--cyan)', break: 'var(--green)', long: 'var(--amber)' };

  return (
    <>
      <div className="panel">
        <div className="hud-corner tl" /><div className="hud-corner tr" /><div className="hud-corner bl" /><div className="hud-corner br" />
      <div className="panel-title">📚 مركز المذاكرة</div>

      <div className="row" style={{ gap: 8, marginBottom: 12 }}>
        {(['work', 'break', 'long'] as const).map((t) => (
          <button key={t} className={`btn sm ${type === t ? '' : 'ghost'}`} onClick={() => { setType(t); setSeconds(durations[t]); setRunning(false); }}>
            {labels[t]}
          </button>
        ))}
      </div>

      <div className="center" style={{ fontSize: 'clamp(48px, 11vw, 80px)', fontWeight: 800, fontFamily: 'var(--font-mono)', color: colors[type], textShadow: `0 0 24px ${colors[type]}` }}>
        {mm}:{ss}
      </div>
      <div style={{ width: '100%', height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden', margin: '12px 0' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#00e5ff,#2979ff)', transition: 'width 1s linear' }} />
      </div>

      <div className="row" style={{ justifyContent: 'center', gap: 10 }}>
        <button className="btn" onClick={() => setRunning(!running)}>{running ? '⏸️' : '▶️'}</button>
        <button className="btn ghost" onClick={() => { setSeconds(durations[type]); setRunning(false); }}>🔄</button>
      </div>

      <div className="center mt">
        <div className="mono" style={{ fontSize: 22, color: 'var(--cyan)' }}>{sessions}</div>
        <div style={{ fontSize: 11, color: 'var(--dim)' }}>جلسة بومودورو اليوم</div>
      </div>
    </div>
    </>
  );
}
