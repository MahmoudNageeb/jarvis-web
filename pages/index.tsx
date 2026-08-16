'use client';

import { useState, useEffect } from 'react';
import BootSequence from '@/components/BootSequence';
import LiveHUD from '@/components/LiveHUD';
import VoiceCore from '@/components/VoiceCore';
import StudyCore from '@/components/StudyCore';
import CompanyLive from '@/components/CompanyLive';
import Inbox from '@/components/Inbox';

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [clock, setClock] = useState('');
  const [palette, setPalette] = useState(false);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor?.('#0a0e12');
      tg.setBackgroundColor?.('#0a0e12');
    }
    const t = setInterval(() => {
      const d = new Date();
      setClock(d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setPalette((p) => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!booted) return <BootSequence onDone={() => setBooted(true)} />;

  return (
    <div className="app-shell">
      {/* شريط علوي */}
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14, padding: '4px 2px' }}>
        <div className="glow-cyan mono" style={{ fontSize: 18, fontWeight: 800, letterSpacing: 2 }}>JARVIS</div>
        <div className="row" style={{ gap: 8 }}>
          <span className="mono pulse" style={{ fontSize: 13, color: 'var(--green)' }}>🟢 متصل</span>
          <span className="mono" style={{ fontSize: 13, color: 'var(--dim)' }}>{clock}</span>
        </div>
      </div>

      <LiveHUD />
      <VoiceCore />
      <StudyCore />
      <CompanyLive />
      <Inbox />

      <div className="center mt" style={{ fontSize: 11, color: 'var(--dim)', paddingBottom: 20 }}>
        JARVIS V2 · Mini App · اضغط Ctrl+K للأوامر
      </div>

      {palette && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 80, zIndex: 10000 }} onClick={() => setPalette(false)}>
          <div style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: 12, width: '90%', maxWidth: 400, padding: 16 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 10 }}>⌘ الأوامر</div>
            {['🔄 تحديث الحالة', '🍅 ابدأ بومودورو', '🎤 تسجيل صوتي', '🏢 حالة الشركة', '📡 فحص الخدمات'].map((c) => (
              <div key={c} className="btn ghost" style={{ width: '100%', textAlign: 'right', marginBottom: 6 }}>{c}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
