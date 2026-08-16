'use client';

import { useState, useEffect } from 'react';

const BOOT_LINES = [
  'تهيئة نواة جارفيس...',
  'ربط الجارديان...',
  'تحميل الموظفين...',
  'تجهيز الصوت...',
  'مزامنة المذاكرة...',
  'تأكيد الاتصال...',
];

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [line, setLine] = useState(0);

  useEffect(() => {
    if (line >= BOOT_LINES.length) {
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLine((l) => l + 1), 450);
    return () => clearTimeout(t);
  }, [line, onDone]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 18 }}>
      <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: 4 }} className="glow-cyan mono">
        JARVIS
      </div>
      <div style={{ width: '80%', height: 2, background: 'rgba(0,229,255,0.1)', overflow: 'hidden', borderRadius: 2 }}>
        <div style={{ height: '100%', width: `${(line / BOOT_LINES.length) * 100}%`, background: 'var(--cyan)', transition: 'width 0.4s', boxShadow: '0 0 10px var(--cyan)' }} />
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--dim)', minHeight: 20 }}>
        {line < BOOT_LINES.length ? `> ${BOOT_LINES[line]} ✅` : '> جاهز'}
      </div>
    </div>
  );
}
