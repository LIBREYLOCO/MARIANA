import { useState, useEffect } from 'react';
import IntroScreen from './screens/IntroScreen';
import QuizScreen from './screens/QuizScreen';
import CollapsingScreen from './screens/CollapsingScreen';
import RevealScreen from './screens/RevealScreen';

const UNLOCK_DATE = new Date('2026-03-05T00:00:00');

function LockedScreen() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [visible, setVisible] = useState(false);

  function getTimeLeft() {
    const diff = UNLOCK_DATE - new Date();
    if (diff <= 0) return null;
    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const unit = (val, label) => (
    <div style={{ textAlign: 'center', minWidth: 72 }}>
      <div style={{
        fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, fontStyle: 'italic',
        background: 'linear-gradient(135deg, #d4a853, #c4687a)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        lineHeight: 1,
      }}>{String(val).padStart(2, '0')}</div>
      <div style={{ fontSize: 10, fontFamily: 'system-ui', fontWeight: 700,
        letterSpacing: '0.25em', textTransform: 'uppercase',
        color: 'rgba(245,230,200,0.35)', marginTop: 6 }}>{label}</div>
    </div>
  );

  const sep = (
    <div style={{ fontSize: 'clamp(1.5rem,5vw,2.5rem)', fontWeight: 900, color: 'rgba(212,168,83,0.4)',
      alignSelf: 'flex-start', marginTop: 8 }}>:</div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 50%, #1a0030 0%, #07000e 70%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: '#f5e6c8', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>

      {/* Shooting stars */}
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute', height: 1, width: 180,
          background: 'linear-gradient(to right, transparent, rgba(212,168,83,0.6), transparent)',
          top: `${15 + i * 30}%`, left: -200,
          animation: `shooting-star ${4 + i * 2}s linear ${i * 3}s infinite`,
          opacity: 0,
        }} />
      ))}

      {/* Concentric rings */}
      {[300, 500, 700].map((s, i) => (
        <div key={i} style={{
          position: 'absolute', borderRadius: '50%',
          width: s, height: s,
          border: `1px solid rgba(212,168,83,${0.07 - i * 0.02})`,
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
        }} />
      ))}

      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 1.2s cubic-bezier(0.16,1,0.3,1)',
        textAlign: 'center', maxWidth: 560, position: 'relative', zIndex: 10,
      }}>
        {/* Lock icon */}
        <div style={{ fontSize: 52, marginBottom: 24, filter: 'drop-shadow(0 0 20px rgba(212,168,83,0.5))',
          animation: 'heartbeat 3s ease infinite' }}>🔐</div>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '8px 24px', borderRadius: 100,
          border: '1px solid rgba(212,168,83,0.3)',
          background: 'rgba(212,168,83,0.06)',
          marginBottom: 28,
        }}>
          <span style={{ fontSize: 10, fontFamily: 'system-ui', fontWeight: 700,
            letterSpacing: '0.35em', textTransform: 'uppercase', color: '#d4a853' }}>
            ✦  Sobre Confidencial  ✦
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 3.5rem)', fontWeight: 900, fontStyle: 'italic',
          lineHeight: 1.1, marginBottom: 16, color: '#f5e6c8',
        }}>
          Tu regalo espera<br />
          <span style={{
            background: 'linear-gradient(135deg, #d4a853, #c4687a)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>en el tiempo exacto</span>
        </h1>

        <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)', fontWeight: 300, lineHeight: 1.7,
          color: 'rgba(245,230,200,0.6)', marginBottom: 48 }}>
          Este portal se abre el <strong style={{ color: '#d4a853' }}>5 de marzo</strong>.<br />
          Algo muy especial te aguarda al otro lado.
        </p>

        {/* Countdown */}
        {timeLeft && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(212,168,83,0.2)',
            borderRadius: 24, padding: '32px 28px',
            backdropFilter: 'blur(20px)',
            marginBottom: 32,
          }}>
            <p style={{ fontSize: 11, fontFamily: 'system-ui', fontWeight: 700,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(245,230,200,0.35)', marginBottom: 24 }}>
              Se abre en
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              {unit(timeLeft.days, 'días')}
              {sep}
              {unit(timeLeft.hours, 'horas')}
              {sep}
              {unit(timeLeft.minutes, 'min')}
              {sep}
              {unit(timeLeft.seconds, 'seg')}
            </div>
          </div>
        )}

        {/* Ornament */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ height: 1, width: 50, background: 'linear-gradient(to right, transparent, rgba(212,168,83,0.4))' }} />
          <span style={{ color: 'rgba(212,168,83,0.4)', fontSize: 14 }}>✦</span>
          <span style={{ color: 'rgba(196,104,122,0.5)', fontSize: 14, animation: 'heartbeat 2s ease infinite' }}>♥</span>
          <span style={{ color: 'rgba(212,168,83,0.4)', fontSize: 14 }}>✦</span>
          <div style={{ height: 1, width: 50, background: 'linear-gradient(to left, transparent, rgba(212,168,83,0.4))' }} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState('intro');

  // Date lock: only allow access on/after March 5, 2026
  if (new Date() < UNLOCK_DATE) {
    return <LockedScreen />;
  }

  const handleQuizComplete = () => {
    setStep('collapsing');
    setTimeout(() => setStep('reveal'), 4000);
  };

  if (step === 'intro')      return <IntroScreen onStart={() => setStep('quiz')} />;
  if (step === 'quiz')       return <QuizScreen onComplete={handleQuizComplete} />;
  if (step === 'collapsing') return <CollapsingScreen />;
  if (step === 'reveal')     return <RevealScreen />;

  return <IntroScreen onStart={() => setStep('quiz')} />;
}
