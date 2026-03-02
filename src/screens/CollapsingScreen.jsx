import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

const STEPS = [
  { msg: "Leyendo tu firma energética…",   pct: 20 },
  { msg: "Sincronizando 15 recuerdos…",    pct: 45 },
  { msg: "Colapsando el futuro…",          pct: 70 },
  { msg: "Preparando tu sorpresa…",        pct: 90 },
  { msg: "Abriendo la puerta…",            pct: 100 },
];

export default function CollapsingScreen() {
  const [step, setStep] = useState(0);
  const [heartScale, setHeartScale] = useState(1);

  useEffect(() => {
    const ids = STEPS.map((_, i) =>
      setTimeout(() => setStep(i), i * 750)
    );
    // Heartbeat effect
    const hb = setInterval(() => {
      setHeartScale(s => s === 1 ? 1.25 : 1);
    }, 600);
    return () => { ids.forEach(clearTimeout); clearInterval(hb); };
  }, []);

  const current = STEPS[step];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 50%, #1a0030 0%, #07000e 70%)' }}>

      {/* Shooting stars */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="absolute h-px"
          style={{
            width: 150 + i * 50,
            background: 'linear-gradient(to right, transparent, rgba(212,168,83,0.8), transparent)',
            top: `${10 + i * 20}%`,
            left: '-200px',
            animation: `shooting-star ${3 + i}s linear ${i * 1.5}s infinite`,
            opacity: 0,
          }} />
      ))}

      {/* Concentric rings */}
      <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: 80 + i * 50, height: 80 + i * 50,
              border: `1px solid rgba(212,168,83,${0.3 - i * 0.06})`,
              animation: `ping-slow ${2 + i * 0.5}s ease-out ${i * 0.3}s infinite`,
            }} />
        ))}

        {/* Glow core */}
        <div className="absolute rounded-full"
          style={{
            width: 80, height: 80,
            background: 'radial-gradient(circle, rgba(212,168,83,0.4), rgba(196,104,122,0.2), transparent)',
            filter: 'blur(8px)',
            animation: 'heartbeat 1.2s ease infinite',
          }} />

        {/* Center heart */}
        <Heart style={{
          width: 40, height: 40,
          color: '#d4a853', fill: '#d4a853',
          position: 'relative', zIndex: 10,
          transform: `scale(${heartScale})`,
          transition: 'transform 0.15s ease',
          filter: 'drop-shadow(0 0 12px rgba(212,168,83,0.8))',
        }} />
      </div>

      {/* Progress bar */}
      <div style={{ width: 280, height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 10, marginTop: 48 }}>
        <div style={{
          height: '100%', borderRadius: 10,
          width: `${current.pct}%`,
          background: 'linear-gradient(to right, #c4687a, #d4a853)',
          transition: 'width 0.7s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 0 10px rgba(212,168,83,0.5)',
        }} />
      </div>

      {/* Message */}
      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <p key={step}
          className="animate-fade-up"
          style={{
            color: 'rgba(245,230,200,0.7)',
            fontSize: 13,
            fontFamily: 'system-ui',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}>
          {current.msg}
        </p>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 5, height: 5, borderRadius: '50%',
              background: 'linear-gradient(135deg, #d4a853, #c4687a)',
              animation: `bounce 1s ease ${i * 0.15}s infinite`,
            }} />
          ))}
        </div>
      </div>

      {/* Ornament */}
      <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ height: 1, width: 40, background: 'linear-gradient(to right, transparent, rgba(212,168,83,0.4))' }} />
        <span style={{ color: 'rgba(212,168,83,0.4)', fontSize: 14 }}>✦</span>
        <div style={{ height: 1, width: 40, background: 'linear-gradient(to left, transparent, rgba(212,168,83,0.4))' }} />
      </div>
    </div>
  );
}
