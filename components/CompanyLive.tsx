'use client';

import { useState, useEffect } from 'react';

const EMPLOYEES = [
  { name: 'المبرمج', role: 'تطوير', xp: 1240, color: '#00e5ff', activity: 'بيصلح باگ في الجارديان' },
  { name: 'المصمم', role: 'تصميم', xp: 980, color: '#ffd740', activity: 'بيصمم واجهة جديدة' },
  { name: 'الباحث', role: 'بحث', xp: 1530, color: '#00e676', activity: 'بيبحث عن APIs جديدة' },
  { name: 'المحلل', role: 'تحليل', xp: 760, color: '#e040fb', activity: 'بيحلل أداء النظام' },
];

export default function CompanyLive() {
  const [emps, setEmps] = useState(EMPLOYEES);

  useEffect(() => {
    const id = setInterval(() => {
      setEmps((prev) => prev.map((e) => ({
        ...e,
        xp: e.xp + Math.floor(Math.random() * 5),
      })));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const maxXp = Math.max(...emps.map((e) => e.xp));

  return (
    <>
      <div className="panel">
        <div className="hud-corner tl" /><div className="hud-corner tr" /><div className="hud-corner bl" /><div className="hud-corner br" />
      <div className="panel-title">🏢 توپولوجي الشركة</div>

      {emps.map((e) => (
        <div key={e.name} style={{ marginBottom: 12 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13 }}>{e.name} <span style={{ fontSize: 10, color: 'var(--dim)' }}>({e.role})</span></span>
            <span className="mono" style={{ fontSize: 12, color: e.color }}>{e.xp} XP</span>
          </div>
          <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden', margin: '4px 0' }}>
            <div style={{ height: '100%', width: `${(e.xp / maxXp) * 100}%`, background: e.color, transition: 'width 0.8s' }} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--dim)' }}>▸ {e.activity}</div>
        </div>
      ))}

      <div style={{ fontSize: 10, color: 'var(--dim)', marginTop: 8, textAlign: 'center' }}>
        نشاط حي — بيتحدث أوتوماتيك
      </div>
    </div>
    </>
  );
}
