'use client';

import { useState, useRef, useEffect } from 'react';

export default function VoiceCore() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [wave, setWave] = useState<number[]>(Array(40).fill(2));
  const mediaRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);

  const startWave = (stream: MediaStream) => {
    const ctx = new AudioContext();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    src.connect(analyser);
    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const loop = () => {
      analyser.getByteFrequencyData(data);
      const vals = Array.from({ length: 40 }, (_, i) => 2 + (data[i * 2] / 255) * 38);
      setWave(vals);
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();
  };

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      startWave(stream);
      const rec = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        // إرسال للبوت عبر Telegram WebApp
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.sendData(JSON.stringify({
            type: 'voice',
            transcript,
            duration: 0,
          }));
        } else {
          // تجربة محلية: نعرض رسالة
          console.log('Voice captured', blob.size, 'bytes');
        }
      };
      mediaRef.current = rec;
      rec.start();
      setRecording(true);
    } catch {
      setTranscript('⚠️ مش قادر أوصل للمايكروفون');
    }
  };

  const stop = () => {
    mediaRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    cancelAnimationFrame(rafRef.current);
    setRecording(false);
    setWave(Array(40).fill(2));
  };

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div className="panel">
        <div className="hud-corner tl" /><div className="hud-corner tr" /><div className="hud-corner bl" /><div className="hud-corner br" />
      <div className="panel-title">🎤 مركز الأوامر الصوتية</div>

      <div className="center" style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
        {wave.map((h, i) => (
          <div key={i} style={{
            width: 3, height: `${h}px`, borderRadius: 2,
            background: recording ? 'var(--cyan)' : 'rgba(0,229,255,0.2)',
            boxShadow: recording ? '0 0 6px var(--cyan)' : 'none',
            transition: 'height 0.05s',
          }} />
        ))}
      </div>

      <div className="center mt">
        <button className={`btn ${recording ? 'danger' : ''}`} onClick={recording ? stop : start}>
          {recording ? '⏹️ إيقاف' : '🎙️ ابدأ التسجيل'}
        </button>
      </div>

      {transcript && (
        <div className="mt" style={{ fontSize: 13, color: 'var(--dim)', padding: '10px', background: 'rgba(0,229,255,0.04)', borderRadius: 8 }}>
          {transcript}
        </div>
      )}
      <div style={{ fontSize: 10, color: 'var(--dim)', marginTop: 8 }}>
        بيُرسل للبوت أوتوماتيك عبر Telegram WebApp
      </div>
    </div>
    </>
  );
}
