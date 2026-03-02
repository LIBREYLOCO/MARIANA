import { useState, useCallback, useMemo } from 'react';
import { Heart, CheckCircle, X, RefreshCw } from 'lucide-react';
import { getRandomQuestions } from '../quizData';

const TOTAL        = 15;   // preguntas por sesión
const WINS_NEEDED  = 10;   // respuestas correctas para ganar
const MAX_FAILS    = 5;    // fallas permitidas antes de reiniciar

const PHOTO_ANIMS = [
  'enter-zoom-burst', 'enter-spin-in',   'enter-slide-left',
  'enter-slide-right','enter-polaroid',  'enter-rise-up',
  'enter-flip',       'enter-iris',
];

function pickAnim(exclude) {
  const pool = PHOTO_ANIMS.filter(a => a !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

function GameOverScreen({ fails, onRestart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center"
      style={{ background: 'radial-gradient(ellipse at 50% 50%, #1a0010 0%, #07000e 70%)' }}>

      {/* Sad hearts */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
        {[...Array(MAX_FAILS)].map((_, i) => (
          <Heart key={i} style={{
            width: 28, height: 28,
            color: '#ef4444', fill: '#ef4444',
            opacity: 0.9,
            filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.5))',
          }} />
        ))}
      </div>

      <div style={{ marginBottom: 12, fontSize: 10, fontFamily: 'system-ui', fontWeight: 700,
        letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(212,168,83,0.6)' }}>
        Recalibración Necesaria
      </div>

      <h2 style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)', fontWeight: 900, fontStyle: 'italic',
        lineHeight: 1.1, marginBottom: 20,
        background: 'linear-gradient(135deg, #f5e6c8, #c4687a)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        La memoria cuántica<br/>necesita reajustarse.
      </h2>

      <p style={{ fontSize: 15, fontFamily: 'system-ui', color: 'rgba(245,230,200,0.5)',
        lineHeight: 1.7, maxWidth: 380, marginBottom: 48 }}>
        Juntaste {fails} fallas. El rally de recuerdos se reinicia —
        pero esta vez ya sabes los caminos.
        <br/><br/>
        <em style={{ color: 'rgba(212,168,83,0.7)' }}>
          "La perseverancia también es coherencia."
        </em>
      </p>

      <button onClick={onRestart}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          padding: '18px 44px', borderRadius: 100,
          background: 'linear-gradient(135deg, #d4a853, #c4687a)',
          color: '#07000e', fontSize: 15, fontFamily: 'system-ui',
          fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          boxShadow: '0 0 40px rgba(212,168,83,0.25)',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <RefreshCw style={{ width: 18, height: 18 }} />
        Reiniciar el Rally
      </button>
    </div>
  );
}

export default function QuizScreen({ onComplete }) {
  const [sessionKey, setSessionKey]   = useState(0);   // fuerza re-mount al reiniciar
  const questions = useMemo(() => getRandomQuestions(TOTAL), [sessionKey]); // eslint-disable-line

  const [idx, setIdx]                 = useState(0);
  const [anim, setAnim]               = useState(PHOTO_ANIMS[0]);
  const [imgKey, setImgKey]           = useState(0);
  const [showHint, setShowHint]       = useState(false);
  const [shaking, setShaking]         = useState(false);
  const [answered, setAnswered]       = useState(null);   // null | 'correct' | 'wrong'
  const [selected, setSelected]       = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [failCount, setFailCount]     = useState(0);
  const [gameOver, setGameOver]       = useState(false);

  const current = questions[idx];

  const restart = useCallback(() => {
    setSessionKey(k => k + 1);
    setIdx(0);
    setAnim(PHOTO_ANIMS[0]);
    setImgKey(0);
    setShowHint(false);
    setShaking(false);
    setAnswered(null);
    setSelected(null);
    setCorrectCount(0);
    setFailCount(0);
    setGameOver(false);
  }, []);

  const advance = useCallback((newCorrect) => {
    const next = idx + 1;
    const newAnim = pickAnim(anim);
    setAnim(newAnim);
    setImgKey(k => k + 1);
    setAnswered(null);
    setSelected(null);
    setShowHint(false);

    if (newCorrect >= WINS_NEEDED) {
      setTimeout(onComplete, 400);
      return;
    }
    if (next < TOTAL) setIdx(next);
    else onComplete(); // agotó preguntas pero no llegó a 10 (no debería pasar)
  }, [idx, anim, onComplete]);

  const handleAnswer = useCallback((i) => {
    if (answered === 'correct' || gameOver) return;
    setSelected(i);

    if (i === current.correct) {
      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);
      setAnswered('correct');
      setTimeout(() => advance(newCorrect), 1000);
    } else {
      const newFails = failCount + 1;
      setFailCount(newFails);
      setAnswered('wrong');
      setShowHint(true);
      setShaking(true);
      setTimeout(() => {
        setShaking(false);
        setAnswered(null);
        setSelected(null);
        if (newFails >= MAX_FAILS) setGameOver(true);
      }, 700);
    }
  }, [current, answered, correctCount, failCount, gameOver, advance]);

  if (gameOver) return <GameOverScreen fails={failCount} onRestart={restart} />;

  const optionStyle = (i) => {
    if (selected === i && answered === 'correct') return {
      background: 'rgba(134,239,172,0.12)', border: '1.5px solid rgba(134,239,172,0.5)', color: '#fff',
    };
    if (selected === i && answered === 'wrong') return {
      background: 'rgba(248,113,113,0.1)', border: '1.5px solid rgba(248,113,113,0.4)', color: '#fca5a5',
    };
    return {
      background: 'rgba(245,230,200,0.03)',
      border: '1.5px solid rgba(245,230,200,0.08)',
      color: 'rgba(245,230,200,0.65)',
    };
  };

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'radial-gradient(ellipse at 50% 20%, #1a0030 0%, #07000e 70%)' }}>

      {/* ── Top progress bar ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3,
        background: 'rgba(255,255,255,0.05)', zIndex: 50 }}>
        <div style={{
          height: '100%',
          width: `${(correctCount / WINS_NEEDED) * 100}%`,
          background: 'linear-gradient(to right, #c4687a, #d4a853)',
          transition: 'width 0.7s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 0 12px rgba(212,168,83,0.6)',
        }} />
      </div>

      {/* ── Header ── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '28px 20px 12px', maxWidth: 560, margin: '0 auto', width: '100%',
      }}>

        {/* Left — question counter */}
        <div>
          <div style={{ fontSize: 10, fontFamily: 'system-ui', fontWeight: 700,
            letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4a853', marginBottom: 2 }}>
            Foto {idx + 1} · Rally
          </div>
          <div style={{ fontSize: 11, fontFamily: 'system-ui', color: 'rgba(245,230,200,0.3)', letterSpacing: '0.1em' }}>
            {WINS_NEEDED - correctCount} correctas para ganar
          </div>
        </div>

        {/* Right — two pill counters */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Correct counter */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 12px', borderRadius: 100,
            background: 'rgba(134,239,172,0.08)',
            border: '1px solid rgba(134,239,172,0.2)',
          }}>
            <CheckCircle style={{ width: 13, height: 13, color: '#86efac' }} />
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'system-ui', color: '#86efac' }}>
              {correctCount}/{WINS_NEEDED}
            </span>
          </div>

          {/* Fail counter */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 12px', borderRadius: 100,
            background: failCount > 0 ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${failCount > 0 ? 'rgba(248,113,113,0.3)' : 'rgba(255,255,255,0.08)'}`,
          }}>
            <X style={{ width: 13, height: 13, color: failCount > 0 ? '#f87171' : 'rgba(255,255,255,0.3)' }} />
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'system-ui',
              color: failCount >= MAX_FAILS - 1 ? '#f87171' : failCount > 0 ? '#fca5a5' : 'rgba(255,255,255,0.3)' }}>
              {failCount}/{MAX_FAILS}
            </span>
          </div>
        </div>
      </header>

      {/* ── Progress dots ── */}
      <div style={{
        display: 'flex', gap: 5, justifyContent: 'center',
        padding: '0 20px 16px', maxWidth: 560, margin: '0 auto', width: '100%',
        flexWrap: 'wrap',
      }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            height: 5, borderRadius: 10,
            transition: 'all 0.5s ease',
            width: i === idx ? 24 : i < idx ? 12 : 7,
            background: i < idx
              ? 'linear-gradient(to right, #c4687a, #d4a853)'
              : i === idx
              ? 'linear-gradient(to right, #d4a853, #c4687a)'
              : 'rgba(245,230,200,0.08)',
            boxShadow: i === idx ? '0 0 6px rgba(212,168,83,0.5)' : 'none',
          }} />
        ))}
      </div>

      {/* ── Card ── */}
      <main style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        maxWidth: 560, margin: '0 auto', width: '100%',
        padding: '0 16px 40px', gap: 0,
      }}>
        <div className={shaking ? 'animate-shake' : ''}
          style={{
            borderRadius: 24,
            overflow: 'hidden',
            border: '1.5px solid rgba(212,168,83,0.18)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
            background: '#08000f',
          }}>

          {/* ── PHOTO — centered with blurred backdrop ── */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 280,
            maxHeight: 380,
            overflow: 'hidden',
            background: '#08000f',
          }}>
            {/* Blurred background fills space */}
            <img
              key={`bg-${imgKey}`}
              src={`/photos/${current.photo}`}
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute', inset: -20,
                width: 'calc(100% + 40px)', height: 'calc(100% + 40px)',
                objectFit: 'cover', objectPosition: 'center',
                filter: 'blur(24px) brightness(0.28) saturate(1.3)',
              }}
            />

            {/* Main photo — natural proportions, centered */}
            <img
              key={`main-${imgKey}`}
              src={`/photos/${current.photo}`}
              alt={`Recuerdo ${idx + 1}`}
              className={anim}
              style={{
                position: 'relative', zIndex: 2,
                maxHeight: 360,
                maxWidth: '100%',
                width: 'auto',
                height: 'auto',
                display: 'block',
                objectFit: 'contain',
              }}
            />

            {/* Bottom gradient */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
              background: 'linear-gradient(to top, #08000f, transparent)',
              zIndex: 3, pointerEvents: 'none',
            }} />

            {/* Caption */}
            {current.caption && (
              <div style={{
                position: 'absolute', bottom: 10, left: 16, zIndex: 4,
              }}>
                <span style={{ fontSize: 10, fontFamily: 'system-ui', fontWeight: 700,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'rgba(245,230,200,0.6)' }}>
                  {current.caption}
                </span>
              </div>
            )}

            {/* Heart badge */}
            <div style={{
              position: 'absolute', top: 12, right: 12, zIndex: 4,
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(212,168,83,0.12)',
              border: '1px solid rgba(212,168,83,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Heart style={{ width: 13, height: 13, color: '#d4a853', fill: '#d4a853' }} />
            </div>
          </div>

          {/* ── QUESTION ── */}
          <div style={{ padding: '20px 20px 6px' }}>
            <p style={{
              fontSize: 'clamp(1rem, 3.2vw, 1.2rem)',
              fontWeight: 400, lineHeight: 1.5,
              color: '#f5e6c8', fontStyle: 'italic',
            }}>
              {current.question}
            </p>
          </div>

          {/* ── OPTIONS ── */}
          <div style={{ padding: '10px 14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {current.options.map((opt, i) => {
              const isCorrectSelected = selected === i && answered === 'correct';
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={answered === 'correct'}
                  style={{
                    ...optionStyle(i),
                    padding: '14px 18px',
                    borderRadius: 14,
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    transition: 'all 0.2s ease',
                    fontSize: 13,
                    lineHeight: 1.5,
                    fontFamily: 'system-ui',
                    cursor: answered === 'correct' ? 'default' : 'pointer',
                  }}
                  onMouseEnter={e => {
                    if (!answered) {
                      e.currentTarget.style.background = 'rgba(212,168,83,0.08)';
                      e.currentTarget.style.borderColor = 'rgba(212,168,83,0.28)';
                      e.currentTarget.style.color = '#f5e6c8';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!answered) Object.assign(e.currentTarget.style, optionStyle(i));
                  }}
                >
                  <span>{opt}</span>
                  {isCorrectSelected && (
                    <CheckCircle style={{ width: 16, height: 16, color: '#86efac', flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── HINT ── */}
          {showHint && (
            <div className="animate-fade-up" style={{
              margin: '0 14px 16px',
              padding: '12px 16px', borderRadius: 12,
              background: 'rgba(251,191,36,0.07)',
              border: '1px solid rgba(251,191,36,0.18)',
              color: '#fbbf24', fontSize: 12, fontFamily: 'system-ui',
              textAlign: 'center', lineHeight: 1.5,
            }}>
              ✦ {current.hint}
            </div>
          )}
        </div>

        {/* Lives remaining warning */}
        {failCount >= MAX_FAILS - 2 && failCount < MAX_FAILS && (
          <div className="animate-fade-up" style={{
            marginTop: 12, padding: '10px 16px', borderRadius: 12,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            color: '#f87171', fontSize: 12, fontFamily: 'system-ui', textAlign: 'center',
          }}>
            ⚠️ {MAX_FAILS - failCount} {MAX_FAILS - failCount === 1 ? 'falla restante' : 'fallas restantes'} antes de reiniciar
          </div>
        )}
      </main>
    </div>
  );
}
