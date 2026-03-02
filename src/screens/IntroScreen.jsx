import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

// Fotos destacadas que flotan en el fondo del intro
const FLOATING_PHOTOS = [
  { file: 'IMG_6214.jpeg', style: { top: '8%',  left: '2%',  width: 160, rotate: '-8deg',  delay: '0s',   duration: '6s'  } },
  { file: 'IMG_9195.jpeg', style: { top: '5%',  right: '3%', width: 140, rotate: '7deg',   delay: '1s',   duration: '7s'  } },
  { file: 'IMG_0360.jpeg', style: { top: '30%', left: '1%',  width: 130, rotate: '-5deg',  delay: '2s',   duration: '8s'  } },
  { file: 'IMG_7451.JPG',  style: { top: '60%', left: '4%',  width: 150, rotate: '4deg',   delay: '0.5s', duration: '6.5s'} },
  { file: 'IMG_6512.jpeg', style: { top: '30%', right: '2%', width: 145, rotate: '9deg',   delay: '1.5s', duration: '7.5s'} },
  { file: 'IMG_1080.jpeg', style: { top: '62%', right: '3%', width: 135, rotate: '-6deg',  delay: '2.5s', duration: '9s'  } },
  { file: 'IMG_4742.jpeg', style: { bottom:'5%',left: '20%', width: 120, rotate: '3deg',   delay: '3s',   duration: '7s'  } },
  { file: 'IMG_9400.jpeg', style: { bottom:'8%',right:'18%', width: 125, rotate: '-4deg',  delay: '0.8s', duration: '8s'  } },
];

const LETTERS = ['M','A','R','I','A','N','A'];

export default function IntroScreen({ onStart }) {
  const [loaded, setLoaded] = useState(false);
  const [lettersVisible, setLettersVisible] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLoaded(true), 200);
    // Reveal letters one by one
    LETTERS.forEach((_, i) => {
      setTimeout(() => {
        setLettersVisible(prev => [...prev, i]);
      }, 600 + i * 120);
    });
    const t2 = setTimeout(() => setShowSub(true), 600 + LETTERS.length * 120 + 200);
    const t3 = setTimeout(() => setShowBtn(true), 600 + LETTERS.length * 120 + 700);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 50% 60%, #1a0030 0%, #07000e 70%)' }}>

      {/* ── Shooting stars ── */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="absolute h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"
          style={{
            width: 200, top: `${15 + i * 25}%`, left: '-200px',
            animation: `shooting-star ${4 + i * 2}s linear ${i * 3}s infinite`,
            opacity: 0
          }} />
      ))}

      {/* ── Ambient orbs ── */}
      <div className="absolute w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(196,104,122,0.12) 0%, transparent 70%)',
          top: '20%', right: '-10%' }} />
      <div className="absolute w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)',
          bottom: '10%', left: '-8%' }} />

      {/* ── Floating photos in background ── */}
      {FLOATING_PHOTOS.map((p, i) => (
        <div key={i} className="absolute rounded-2xl overflow-hidden shadow-2xl pointer-events-none"
          style={{
            ...p.style,
            width: p.style.width,
            height: p.style.width * 1.25,
            transform: `rotate(${p.style.rotate})`,
            '--r': p.style.rotate,
            opacity: loaded ? 0.35 : 0,
            transition: `opacity 1.5s ease ${0.3 * i}s`,
            animation: `float-slow ${p.style.duration} ease-in-out ${p.style.delay} infinite`,
            border: '3px solid rgba(212,168,83,0.2)',
            zIndex: 1,
          }}>
          <img src={`/photos/${p.file}`} alt=""
            className="w-full h-full"
            style={{ objectFit: 'cover' }} />
          {/* Vignette */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(7,0,14,0.1), rgba(7,0,14,0.5))' }} />
        </div>
      ))}

      {/* ── Center content ── */}
      <div className="relative z-10 text-center px-8 max-w-3xl mx-auto" style={{ zIndex: 10 }}>

        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-10"
          style={{
            border: '1px solid rgba(212,168,83,0.3)',
            background: 'rgba(212,168,83,0.06)',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 1s ease 0.2s'
          }}>
          <Heart className="w-3 h-3 fill-current" style={{ color: '#c4687a', animation: 'heartbeat 2s ease infinite' }} />
          <span style={{ color: '#d4a853', fontSize: 10, fontFamily: 'system-ui', letterSpacing: '0.35em', fontWeight: 700, textTransform: 'uppercase' }}>
            Rally de Recuerdos · Edición Cumpleaños
          </span>
          <Heart className="w-3 h-3 fill-current" style={{ color: '#c4687a', animation: 'heartbeat 2s ease 0.3s infinite' }} />
        </div>

        {/* ── MARIANA — letter by letter ── */}
        <div className="flex items-center justify-center gap-1 mb-6" style={{ overflow: 'visible', padding: '0 16px' }}>
          {LETTERS.map((letter, i) => (
            <span key={i}
              style={{
                fontSize: 'clamp(3.5rem, 10vw, 7rem)',
                fontWeight: 900,
                fontStyle: 'italic',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                display: 'inline-block',
                opacity: lettersVisible.includes(i) ? 1 : 0,
                transform: lettersVisible.includes(i) ? 'translateY(0) skewY(0deg)' : 'translateY(60px) skewY(4deg)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                background: 'linear-gradient(135deg, #f5e6c8 0%, #d4a853 40%, #f5e6c8 60%, #c4687a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '300% 100%',
                animation: lettersVisible.includes(i) ? 'shimmer 4s linear 2s infinite' : 'none',
              }}>
              {letter}
            </span>
          ))}
        </div>

        {/* Ornamental divider */}
        <div className="flex items-center justify-center gap-4 mb-8"
          style={{ opacity: showSub ? 1 : 0, transition: 'opacity 0.8s ease' }}>
          <div style={{ height: 1, width: 60, background: 'linear-gradient(to right, transparent, rgba(212,168,83,0.6))' }} />
          <span style={{ color: '#d4a853', fontSize: 18 }}>✦</span>
          <span style={{ color: '#c4687a', fontSize: 18, animation: 'heartbeat 2s ease infinite' }}>♥</span>
          <span style={{ color: '#d4a853', fontSize: 18 }}>✦</span>
          <div style={{ height: 1, width: 60, background: 'linear-gradient(to left, transparent, rgba(212,168,83,0.6))' }} />
        </div>

        {/* Subtitle */}
        <div style={{ opacity: showSub ? 1 : 0, transform: showSub ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease 0.1s' }}>
          <p style={{ color: '#f5e6c8', fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 300, letterSpacing: '0.05em', lineHeight: 1.6, marginBottom: 12 }}>
            Cada foto guarda un secreto que solo tú conoces.
          </p>
          <p style={{ color: 'rgba(212,168,83,0.7)', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', fontFamily: 'system-ui', fontWeight: 400, letterSpacing: '0.08em' }}>
            nuestros momentos · y el destino que te espera
          </p>
        </div>

        {/* CTA Button */}
        <div style={{ marginTop: 52, opacity: showBtn ? 1 : 0, transform: showBtn ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)', transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <button onClick={onStart}
            className="group relative inline-flex items-center gap-4 overflow-hidden"
            style={{
              padding: '20px 52px',
              borderRadius: 100,
              background: 'linear-gradient(135deg, #d4a853, #c4687a, #d4a853)',
              backgroundSize: '200% 100%',
              color: '#07000e',
              fontSize: 16,
              fontWeight: 700,
              fontFamily: 'system-ui',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              animation: 'pulse-glow 3s ease infinite, shimmer 3s linear infinite',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Heart className="w-5 h-5 fill-current" style={{ animation: 'heartbeat 1.5s ease infinite' }} />
            Abrir mi Rally de Recuerdos
            <span style={{ fontSize: 20 }}>→</span>
          </button>

          <p style={{ marginTop: 24, color: 'rgba(245,230,200,0.3)', fontSize: 11, fontFamily: 'system-ui', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            Solo tu memoria abre cada puerta
          </p>
        </div>
      </div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #07000e, transparent)', zIndex: 5 }} />
    </div>
  );
}
