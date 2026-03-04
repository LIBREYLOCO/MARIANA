import { useState, useEffect, useRef } from 'react';

/* ─── Timing ─────────────────────────────────────────────────────── */
const ACT1_DURATION = 7000;   // heaven / romantic phrase
const ACT2_DURATION = 3500;   // virus destroys screen
// Act 3 is permanent (broken screen)

/* ─── Firework particle ──────────────────────────────────────────── */
function Spark({ x, y, color, angle, dist, delay, size }) {
    return (
        <div style={{
            position: 'absolute',
            left: x, top: y,
            width: size, height: size,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 ${size * 2}px ${color}`,
            animation: `spark-fly 1.6s ease-out ${delay}s forwards`,
            '--tx': `${Math.cos(angle) * dist}px`,
            '--ty': `${Math.sin(angle) * dist}px`,
            pointerEvents: 'none',
            opacity: 0,
        }} />
    );
}

function Firework({ x, y }) {
    const colors = ['#d4a853', '#c4687a', '#f5e6c8', '#ff9de2', '#ffd700', '#ff6b9d', '#c084fc'];
    const count = 28;
    return (
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {Array.from({ length: count }, (_, i) => (
                <Spark
                    key={i}
                    x={x} y={y}
                    color={colors[i % colors.length]}
                    angle={(i / count) * Math.PI * 2}
                    dist={80 + Math.random() * 120}
                    delay={Math.random() * 0.4}
                    size={3 + Math.random() * 4}
                />
            ))}
        </div>
    );
}

/* ─── Lightning bolt (Act 2) ─────────────────────────────────────── */
function Lightning({ style }) {
    const points = [];
    let x = Math.random() * 100;
    let y = 0;
    for (let i = 0; i < 10; i++) {
        points.push(`${x}%,${y}%`);
        x += (Math.random() - 0.5) * 30;
        y += 10;
    }
    return (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }}>
            <polyline
                points={points.join(' ')}
                fill="none"
                stroke={`rgba(${80 + Math.random() * 175},${Math.random() * 50},${200 + Math.random() * 55},0.9)`}
                strokeWidth={2 + Math.random() * 3}
                style={{ animation: `lightning-flash 0.25s ease ${Math.random() * 1}s 8 alternate` }}
            />
        </svg>
    );
}

/* ─── Crack overlay (Act 3) ─────────────────────────────────────── */
function CrackOverlay() {
    // Static crack lines radiating from center-bottom area
    const cracks = [
        'M 50%,85% L 20%,40% L 5%,10%',
        'M 50%,85% L 35%,55% L 15%,30%',
        'M 50%,85% L 55%,50% L 70%,15%',
        'M 50%,85% L 65%,60% L 90%,35%',
        'M 50%,85% L 75%,70% L 95%,55%',
        'M 50%,85% L 25%,70% L 8%,60%',
        'M 50%,85% L 45%,65% L 30%,80%',
    ];
    return (
        <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 40, pointerEvents: 'none' }}>
            {cracks.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="rgba(255,50,50,0.7)" strokeWidth={1 + (i % 3) * 0.5} />
            ))}
            {/* Glass shard fills */}
            <polygon points="10%,0% 40%,0% 20%,30%" fill="rgba(255,0,0,0.04)" stroke="rgba(255,50,50,0.3)" strokeWidth="0.5" />
            <polygon points="60%,0% 95%,0% 80%,25%" fill="rgba(255,0,0,0.04)" stroke="rgba(255,50,50,0.3)" strokeWidth="0.5" />
            <polygon points="0%,40% 25%,50% 10%,70%" fill="rgba(255,0,0,0.04)" stroke="rgba(255,50,50,0.3)" strokeWidth="0.5" />
            <polygon points="75%,30% 100%,20% 100%,60%" fill="rgba(255,0,0,0.04)" stroke="rgba(255,50,50,0.3)" strokeWidth="0.5" />
        </svg>
    );
}

/* ─── Glitch label (Act 2/3) ─────────────────────────────────────── */
function GlitchText({ text, style, active }) {
    return (
        <div style={{ position: 'relative', display: 'inline-block', ...style }}>
            {active && (
                <>
                    <div style={{
                        position: 'absolute', inset: 0, color: '#ff003c',
                        animation: 'glitch-r 0.15s steps(1) infinite',
                        clipPath: 'inset(30% 0 40% 0)',
                    }}>{text}</div>
                    <div style={{
                        position: 'absolute', inset: 0, color: '#00eaff',
                        animation: 'glitch-b 0.18s steps(1) 0.05s infinite',
                        clipPath: 'inset(60% 0 10% 0)',
                    }}>{text}</div>
                </>
            )}
            <div>{text}</div>
        </div>
    );
}

/* ─── Matrix rain (Act 3) ─────────────────────────────────────── */
function MatrixRain() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        const ctx = canvas.getContext('2d');
        const chars = '01アΩ∞ψERROR!!!VIRUS∆ψ量子ERROR';
        const cw = 14;
        const cols = Math.floor(canvas.width / cw);
        const drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -canvas.height / cw));
        let id;
        const draw = () => {
            ctx.fillStyle = 'rgba(0,0,0,0.07)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drops.forEach((_, i) => {
                const ch = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillStyle = Math.random() < 0.1
                    ? `rgba(255,0,60,${0.7 + Math.random() * 0.3})`
                    : `rgba(0,${100 + Math.floor(Math.random() * 155)},${20 + Math.floor(Math.random() * 40)},${0.3 + Math.random() * 0.6})`;
                ctx.font = `${10 + Math.floor(Math.random() * 4)}px monospace`;
                ctx.fillText(ch, i * cw, drops[i] * cw);
                if (drops[i] * cw > canvas.height && Math.random() > 0.975) drops[i] = 0;
                else drops[i]++;
            });
            id = requestAnimationFrame(draw);
        };
        id = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(id);
    }, []);
    return (
        <canvas ref={canvasRef} style={{
            position: 'fixed', inset: 0, width: '100%', height: '100%',
            zIndex: 1, pointerEvents: 'none', opacity: 0.6,
        }} />
    );
}

/* ─── Fireworks shower (Act 1) ─────────────────────────────────── */
function FireworksLayer() {
    const [works, setWorks] = useState([]);
    useEffect(() => {
        const add = () => {
            setWorks(prev => [
                ...prev.slice(-30),
                { id: Math.random(), x: `${10 + Math.random() * 80}%`, y: `${10 + Math.random() * 70}%` },
            ]);
        };
        add();
        const id = setInterval(add, 350);
        return () => clearInterval(id);
    }, []);
    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
            {works.map(w => <Firework key={w.id} x={w.x} y={w.y} />)}
        </div>
    );
}

/* ─── Main export ─────────────────────────────────────────────────── */
export default function TrampaScreen({ onBack }) {
    const [act, setAct] = useState(1); // 1 = heaven, 2 = collapse, 3 = broken
    const [dotPhase, setDotPhase] = useState(0); // 0=dots hidden,1=dots appear,2=virus dot grows
    const [lightnings, setLightnings] = useState([]);
    const [screenFlash, setScreenFlash] = useState(false);

    /* ── Act 1 → show dots after 4s, then virus at 6s, Act2 at 7s ── */
    useEffect(() => {
        const t1 = setTimeout(() => setDotPhase(1), 4200);      // dots appear
        const t2 = setTimeout(() => setDotPhase(2), 5800);      // virus dot glows
        const t3 = setTimeout(() => setAct(2), ACT1_DURATION);  // collapse begins
        return () => [t1, t2, t3].forEach(clearTimeout);
    }, []);

    /* ── Act 2: lightning bolts + screen flash, then Act 3 ── */
    useEffect(() => {
        if (act !== 2) return;
        setScreenFlash(true);
        const bolts = Array.from({ length: 8 }, (_, i) => ({ id: i }));
        setLightnings(bolts);
        const t = setTimeout(() => setAct(3), ACT2_DURATION);
        return () => clearTimeout(t);
    }, [act]);

    /* ─── Act 1 — Heaven ─── */
    if (act === 1) return (
        <>
            <style>{`
        @keyframes spark-fly {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        @keyframes float-3d {
          0%,100% { transform: perspective(900px) rotateX(6deg) rotateY(-3deg) translateY(0px); }
          50%      { transform: perspective(900px) rotateX(2deg) rotateY(3deg) translateY(-12px); }
        }
        @keyframes glow-pulse {
          0%,100% { text-shadow: 0 0 30px #d4a853aa, 0 4px 60px #c4687a88, 2px 6px 0 #8b5500, 4px 10px 0 #5a3300; }
          50%      { text-shadow: 0 0 60px #d4a853ff, 0 4px 80px #c4687acc, 2px 6px 0 #8b5500, 4px 10px 0 #5a3300; }
        }
        @keyframes dot-appear {
          from { opacity: 0; transform: scale(0); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes virus-pulse {
          0%,100% { transform: scale(1); box-shadow: 0 0 10px #ff003c; background: #ff003c; }
          50%      { transform: scale(2.5); box-shadow: 0 0 40px #ff003c, 0 0 80px #ff003c; background: #ff5500; }
        }
        @keyframes rising-glow {
          0%   { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes heart-float {
          0%   { transform: translateY(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(-120px) scale(0); opacity: 0; }
        }
      `}</style>

            {/* Background */}
            <div style={{
                position: 'fixed', inset: 0,
                background: 'radial-gradient(ellipse at 50% 50%, #1a0035 0%, #07000e 70%)',
                overflow: 'hidden',
            }}>
                <FireworksLayer />

                {/* Floating hearts */}
                {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        left: `${5 + i * 8}%`,
                        bottom: '10%',
                        fontSize: 18 + (i % 3) * 8,
                        animation: `heart-float ${3 + (i % 4)}s ease-out ${i * 0.5}s infinite`,
                        zIndex: 3,
                    }}>
                        {i % 2 === 0 ? '🌹' : '💛'}
                    </div>
                ))}

                {/* 3D Romantic phrase */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 10,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '40px 24px', textAlign: 'center',
                }}>
                    <div style={{
                        animation: 'float-3d 4s ease-in-out infinite, rising-glow 1.5s ease forwards',
                        perspective: '1000px',
                        maxWidth: 680,
                    }}>
                        {/* 3D-effect label */}
                        <div style={{
                            fontSize: 10, fontFamily: 'system-ui', fontWeight: 800,
                            letterSpacing: '0.4em', textTransform: 'uppercase',
                            color: '#d4a853', marginBottom: 28,
                            opacity: 0.8,
                        }}>
                            ✦  Para ti  ✦
                        </div>

                        <div style={{
                            fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
                            fontWeight: 900,
                            fontStyle: 'italic',
                            lineHeight: 1.4,
                            color: '#f5e6c8',
                            animation: 'glow-pulse 3s ease infinite',
                            /* 3D layered shadow depth effect */
                            textShadow: `
                0 0 30px rgba(212,168,83,0.7),
                0 0 60px rgba(196,104,122,0.5),
                1px 2px 0 #8b5500,
                2px 4px 0 #7a4800,
                3px 6px 0 #6a3d00,
                4px 8px 0 #5a3300,
                5px 10px 20px rgba(0,0,0,0.8)
              `,
                            transform: 'perspective(900px) rotateX(6deg)',
                        }}>
                            "La vida, con toda su inmensidad,<br />
                            conspiró para que dos almas<br />
                            se encontraran.<br />
                            <span style={{ color: '#c4687a' }}>No fue casualidad.</span><br />
                            Fuiste tú, y fui yo,<br />
                            y fue el universo entero<br />
                            <span style={{
                                background: 'linear-gradient(135deg, #d4a853, #f5e6c8, #c4687a)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>diciéndonos: ahora</span>"
                        </div>

                        {/* Ellipsis with virus dot */}
                        {dotPhase > 0 && (
                            <div style={{
                                display: 'flex', justifyContent: 'center', gap: 10,
                                marginTop: 28,
                                fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
                                fontWeight: 900,
                            }}>
                                {[0, 1, 2].map(i => (
                                    <span key={i} style={{
                                        display: 'inline-block',
                                        color: dotPhase === 2 && i === 2 ? '#ff003c' : '#d4a853',
                                        animation: dotPhase > 0
                                            ? `dot-appear 0.4s ease ${i * 0.25}s forwards${dotPhase === 2 && i === 2 ? ', virus-pulse 0.5s ease 0.7s infinite' : ''}`
                                            : 'none',
                                        opacity: dotPhase > 0 ? undefined : 0,
                                        width: dotPhase === 2 && i === 2 ? 18 : 12,
                                        height: dotPhase === 2 && i === 2 ? 18 : 12,
                                        borderRadius: '50%',
                                        background: dotPhase === 2 && i === 2 ? '#ff003c' : '#d4a853',
                                        boxShadow: dotPhase === 2 && i === 2 ? '0 0 20px #ff003c' : '0 0 8px #d4a853',
                                        marginTop: 8,
                                        transition: 'all 0.3s ease',
                                    }} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );

    /* ─── Act 2 — Collapse ─── */
    if (act === 2) return (
        <>
            <style>{`
        @keyframes spark-fly {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        @keyframes screen-shake {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          10%      { transform: translate(-8px, 4px) rotate(-0.5deg); }
          20%      { transform: translate(8px, -5px) rotate(0.5deg); }
          30%      { transform: translate(-10px, 2px) rotate(-1deg); }
          40%      { transform: translate(6px, -7px) rotate(0.8deg); }
          50%      { transform: translate(-6px, 5px) rotate(-0.5deg); }
          60%      { transform: translate(9px, -3px) rotate(1deg); }
          70%      { transform: translate(-7px, 6px) rotate(-0.8deg); }
          80%      { transform: translate(5px, -4px) rotate(0.5deg); }
          90%      { transform: translate(-4px, 3px) rotate(-0.3deg); }
        }
        @keyframes lightning-flash {
          0%,100% { opacity: 0; }
          50%      { opacity: 1; }
        }
        @keyframes rgb-split {
          0%   { clip-path: inset(0 0 95% 0); transform: translate(-5px, 0); }
          33%  { clip-path: inset(33% 0 33% 0); transform: translate(5px, 0); }
          66%  { clip-path: inset(66% 0 0% 0); transform: translate(-3px, 0); }
          100% { clip-path: inset(85% 0 0% 0); transform: translate(3px, 0); }
        }
        @keyframes virus-expand {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(60); opacity: 0; }
        }
        @keyframes white-flash {
          0%,100% { opacity: 0; }
          15%,45% { opacity: 0.15; }
          30%      { opacity: 0.4; }
        }
        @keyframes corrupt-text {
          0%,100% { filter: none; }
          25%      { filter: blur(3px) hue-rotate(90deg); }
          50%      { filter: blur(1px) hue-rotate(180deg) saturate(5); }
          75%      { filter: blur(4px) hue-rotate(270deg); }
        }
      `}</style>

            <div style={{
                position: 'fixed', inset: 0,
                background: '#000',
                animation: 'screen-shake 0.12s linear infinite',
                overflow: 'hidden',
            }}>
                {/* White flash */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'white',
                    animation: 'white-flash 0.3s ease infinite',
                    zIndex: 50, pointerEvents: 'none',
                }} />

                {/* Red overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at 50% 50%, rgba(255,0,60,0.3) 0%, transparent 70%)',
                    zIndex: 5,
                }} />

                {/* Corrupted romantic text vestiges */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'corrupt-text 0.2s steps(1) infinite',
                }}>
                    <div style={{
                        fontSize: 'clamp(1.4rem,4vw,2.4rem)',
                        fontWeight: 900, fontStyle: 'italic',
                        color: '#f5e6c8', textAlign: 'center',
                        filter: 'blur(2px)',
                        opacity: 0.5,
                    }}>
                        "...ahora..."
                    </div>
                </div>

                {/* RGB split clone layers */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 15,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <div style={{
                        fontSize: 'clamp(1.4rem,4vw,2.4rem)', fontWeight: 900, fontStyle: 'italic',
                        color: '#ff003c', animation: 'rgb-split 0.15s steps(1) infinite',
                        position: 'absolute',
                    }}>
                        "...ahora..."
                    </div>
                    <div style={{
                        fontSize: 'clamp(1.4rem,4vw,2.4rem)', fontWeight: 900, fontStyle: 'italic',
                        color: '#00eaff', animation: 'rgb-split 0.18s steps(1) 0.06s infinite',
                        position: 'absolute',
                    }}>
                        "...ahora..."
                    </div>
                </div>

                {/* Lightning bolts */}
                {lightnings.map(l => <Lightning key={l.id} style={{ zIndex: 20 }} />)}

                {/* Glitch horizontal scan lines */}
                {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} style={{
                        position: 'absolute', left: 0, right: 0,
                        top: `${(i * 5) + Math.random() * 3}%`,
                        height: 2 + Math.random() * 4,
                        background: `rgba(${Math.random() < 0.5 ? '255,0,60' : '0,234,255'},${0.2 + Math.random() * 0.5})`,
                        zIndex: 25, pointerEvents: 'none',
                        animation: `lightning-flash ${0.1 + Math.random() * 0.3}s steps(1) ${Math.random() * 0.5}s infinite`,
                    }} />
                ))}

                {/* Virus expanding dot from center */}
                <div style={{
                    position: 'absolute', left: '50%', top: '50%',
                    width: 20, height: 20, borderRadius: '50%',
                    background: '#ff003c', marginLeft: -10, marginTop: -10,
                    animation: 'virus-expand 2s cubic-bezier(0.4,0,1,1) forwards',
                    zIndex: 30,
                    boxShadow: '0 0 60px #ff003c',
                }} />
            </div>
        </>
    );

    /* ─── Act 3 — Broken Screen ─── */
    return (
        <>
            <style>{`
        @keyframes spark-fly {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        @keyframes lightning-flash {
          0%,100% { opacity: 0; }
          50%      { opacity: 1; }
        }
        @keyframes glitch-r {
          0%  { transform: translate(-3px,  1px); }
          33% { transform: translate( 3px, -2px); }
          66% { transform: translate(-2px,  3px); }
        }
        @keyframes glitch-b {
          0%  { transform: translate( 3px, -1px); }
          33% { transform: translate(-3px,  2px); }
          66% { transform: translate( 2px, -3px); }
        }
        @keyframes broken-flicker {
          0%,92%,100% { opacity: 1; }
          94%          { opacity: 0.4; }
          96%          { opacity: 0.8; }
          98%          { opacity: 0.3; }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes error-pulse {
          0%,100% { box-shadow: 0 0 20px rgba(255,0,60,0.4), inset 0 0 20px rgba(255,0,60,0.1); }
          50%      { box-shadow: 0 0 50px rgba(255,0,60,0.8), inset 0 0 30px rgba(255,0,60,0.2); }
        }
        @keyframes rose-appear {
          from { opacity: 0; transform: scale(0) rotate(-20deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes spin-circle {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

            <div style={{
                position: 'fixed', inset: 0,
                background: '#020002',
                overflow: 'hidden',
                animation: 'broken-flicker 4s ease infinite',
            }}>
                <MatrixRain />
                <CrackOverlay />

                {/* Sporadic horizontal glitch bars */}
                {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} style={{
                        position: 'absolute', left: 0, right: 0,
                        top: `${i * 8 + Math.random() * 4}%`,
                        height: 1 + (i % 3),
                        background: i % 3 === 0
                            ? 'rgba(255,0,60,0.3)'
                            : i % 3 === 1
                                ? 'rgba(0,234,255,0.2)'
                                : 'rgba(255,255,255,0.1)',
                        zIndex: 45, pointerEvents: 'none',
                        animation: `lightning-flash ${0.8 + i * 0.4}s steps(1) ${i * 0.2}s infinite`,
                    }} />
                ))}

                {/* Scanline */}
                <div style={{
                    position: 'absolute', left: 0, right: 0, height: 3,
                    background: 'rgba(255,0,60,0.15)',
                    zIndex: 46, pointerEvents: 'none',
                    animation: 'scanline 3s linear infinite',
                }} />

                {/* ── MAIN ERROR BOX ── */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 50,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '24px',
                }}>
                    <div style={{
                        background: 'rgba(5, 0, 10, 0.92)',
                        border: '2px solid rgba(255, 0, 60, 0.7)',
                        borderRadius: 8,
                        padding: '40px 36px 36px',
                        maxWidth: 480, width: '100%',
                        textAlign: 'center',
                        backdropFilter: 'blur(10px)',
                        animation: 'error-pulse 2s ease infinite',
                        position: 'relative',
                        /* Glitch border flicker */
                        outline: '1px solid rgba(0,234,255,0.15)',
                        outlineOffset: 4,
                    }}>
                        {/* Corner decorations — broken corners */}
                        {['top:0;left:0', 'top:0;right:0', 'bottom:0;left:0', 'bottom:0;right:0'].map((pos, i) => (
                            <div key={i} style={{
                                position: 'absolute',
                                ...Object.fromEntries(pos.split(';').map(p => p.split(':'))),
                                width: 12, height: 12,
                                borderTop: i < 2 ? '2px solid #ff003c' : 'none',
                                borderBottom: i >= 2 ? '2px solid #ff003c' : 'none',
                                borderLeft: i % 2 === 0 ? '2px solid #ff003c' : 'none',
                                borderRight: i % 2 === 1 ? '2px solid #ff003c' : 'none',
                            }} />
                        ))}

                        {/* Error icon */}
                        <div style={{ fontSize: 48, marginBottom: 16, lineHeight: 1 }}>
                            <GlitchText text="⚠️" active style={{ fontSize: 48 }} />
                        </div>

                        {/* SYSTEM label */}
                        <div style={{
                            fontSize: 9, fontFamily: 'monospace', fontWeight: 700,
                            letterSpacing: '0.4em', textTransform: 'uppercase',
                            color: 'rgba(255,0,60,0.6)', marginBottom: 12,
                        }}>
                            SISTEMA — ERROR CRÍTICO
                        </div>

                        {/* CÓDIGO INCORRECTO */}
                        <GlitchText
                            text="CÓDIGO INCORRECTO"
                            active
                            style={{
                                fontSize: 'clamp(1.6rem,5vw,2.4rem)',
                                fontWeight: 900,
                                fontFamily: 'monospace',
                                color: '#ff003c',
                                letterSpacing: '0.05em',
                                marginBottom: 24,
                                display: 'block',
                            }}
                        />

                        {/* Divider */}
                        <div style={{
                            height: 1,
                            background: 'linear-gradient(to right, transparent, rgba(255,0,60,0.4), transparent)',
                            marginBottom: 24,
                        }} />

                        {/* Message */}
                        <div style={{
                            fontSize: 'clamp(1rem,3vw,1.25rem)',
                            fontWeight: 300,
                            fontStyle: 'italic',
                            color: 'rgba(245,230,200,0.85)',
                            lineHeight: 1.7,
                            marginBottom: 20,
                        }}>
                            Tu código llegará
                            <br />
                            con unas flores
                        </div>

                        {/* Roses */}
                        <div style={{
                            display: 'flex', justifyContent: 'center', gap: 10,
                            fontSize: 32,
                        }}>
                            {['🌹', '🌹', '🌹', '🌹', '🌹'].map((r, i) => (
                                <span key={i} style={{
                                    display: 'inline-block',
                                    animation: `rose-appear 0.5s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.15}s both`,
                                }}>
                                    {r}
                                </span>
                            ))}
                        </div>

                        {/* Spinning circle badge */}
                        <div style={{
                            display: 'flex', justifyContent: 'center',
                            marginTop: 24, marginBottom: 4,
                        }}>
                            <div style={{
                                position: 'relative', width: 140, height: 140,
                                animation: 'spin-circle 6s linear infinite',
                            }}>
                                <svg viewBox="0 0 140 140" width="140" height="140">
                                    <defs>
                                        <path
                                            id="circlePath"
                                            d="M 70,70 m -52,0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0"
                                        />
                                    </defs>
                                    {/* Faint circle guide */}
                                    <circle cx="70" cy="70" r="52"
                                        fill="none"
                                        stroke="rgba(255,0,60,0.18)"
                                        strokeWidth="1"
                                    />
                                    {/* Spinning text */}
                                    <text fill="rgba(255,0,60,0.85)" style={{ fontSize: 10.5, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.18em' }}>
                                        <textPath href="#circlePath">
                                            ¿PENSASTE QUE SERÍA TAN FÁCIL? ★ ¿PENSASTE QUE SERÍA TAN FÁCIL? ★
                                        </textPath>
                                    </text>
                                </svg>
                                {/* Center element */}
                                <div style={{
                                    position: 'absolute', top: '50%', left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: 28,
                                    animation: 'spin-circle 6s linear infinite reverse',
                                }}>
                                    😈
                                </div>
                            </div>
                        </div>

                        {/* Footer system text */}
                        <div style={{
                            marginTop: 24,
                            fontSize: 9, fontFamily: 'monospace',
                            color: 'rgba(255,0,60,0.3)', letterSpacing: '0.2em',
                            marginBottom: 24,
                        }}>
                            ERR_CODE: 0x4E454E41 · PORTAL_LOCKED · RETRY_WITH_FLOWERS
                        </div>

                        {/* Back button */}
                        <button
                            onClick={onBack}
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,0,60,0.25)',
                                borderRadius: 8,
                                padding: '10px 28px',
                                color: 'rgba(245,230,200,0.5)',
                                fontSize: 11,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '0.25em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                width: '100%',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255,0,60,0.08)';
                                e.currentTarget.style.color = 'rgba(245,230,200,0.8)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                e.currentTarget.style.color = 'rgba(245,230,200,0.5)';
                            }}
                        >
                            ← Volver al inicio
                        </button>
                    </div>
                </div>            </div>
        </>
    );
}
