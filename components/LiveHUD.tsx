'use client';

import { useState, useEffect } from 'react';

interface Service {
  name: string;
  port: number;
  url: string;
}

const SERVICES: Service[] = [
  { name: 'Gateway', port: 8642, url: 'http://localhost:8642/health' },
  { name: 'Serve', port: 9119, url: 'http://localhost:9119/health' },
  { name: 'Omniroute', port: 20128, url: 'http://localhost:20128/v1/models' },
  { name: 'ModelRelay', port: 20129, url: 'http://localhost:20129/v1/models' },
  { name: 'Company', port: 8081, url: 'http://localhost:8081/health' },
  { name: 'LLM-Proxy', port: 7352, url: 'http://localhost:7352/v1/models' },
];

export default function LiveHUD() {
  const [statuses, setStatuses] = useState<Record<number, boolean>>({});
  const [metrics, setMetrics] = useState({ cpu: 0, ram: 0, disk: 0 });

  useEffect(() => {
    const check = async () => {
      const next: Record<number, boolean> = {};
      for (const s of SERVICES) {
        try {
          const res = await fetch(`/api/check?port=${s.port}`);
          next[s.port] = res.ok;
        } catch {
          next[s.port] = false;
        }
      }
      setStatuses(next);
      // مقاييس وهمية واقعية (هتتصلح لما نربط الـ guardian)
      setMetrics({
        cpu: 20 + Math.round(Math.random() * 30),
        ram: 40 + Math.round(Math.random() * 20),
        disk: 11,
      });
    };
    check();
    const id = setInterval(check, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div className="panel">
        <div className="hud-corner tl" /><div className="hud-corner tr" /><div className="hud-corner bl" /><div className="hud-corner br" />
      <div className="panel-title">📡 لوحة التحكم الحية</div>

      <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
        {SERVICES.map((s) => (
          <div key={s.port} style={{
            flex: '1 1 30%', padding: '10px 8px', borderRadius: 8,
            border: `1px solid ${statuses[s.port] ? 'rgba(0,230,118,0.3)' : 'rgba(255,82,82,0.3)'}`,
            textAlign: 'center', background: statuses[s.port] ? 'rgba(0,230,118,0.06)' : 'rgba(255,82,82,0.06)',
          }}>
            <div style={{ fontSize: 11, color: 'var(--dim)' }}>{s.name}</div>
            <div className="mono" style={{ fontSize: 18, color: statuses[s.port] ? 'var(--green)' : 'var(--red)' }}>
              {statuses[s.port] ? '🟢' : '🔴'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--dim)' }}>:{s.port}</div>
          </div>
        ))}
      </div>

      <div className="row mt" style={{ justifyContent: 'space-around' }}>
        {[
          ['CPU', metrics.cpu, 'var(--cyan)'],
          ['RAM', metrics.ram, 'var(--cyan)'],
          ['DISK', metrics.disk, 'var(--amber)'],
        ].map(([label, val, color]) => (
          <div key={label} className="center">
            <div className="mono" style={{ fontSize: 24, color: String(color) }}>{val}%</div>
            <div style={{ fontSize: 10, color: 'var(--dim)' }}>{label}</div>
          </div>
        ))}
      </div>

      <button className="btn ghost mt" style={{ width: '100%' }} onClick={() => location.reload()}>
        🔄 تحديث
      </button>
    </div>
    </>
  );
}
