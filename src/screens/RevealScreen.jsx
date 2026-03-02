import { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Plane, Mountain, Sparkles, Heart, Calendar, Star, Car, Sunrise } from 'lucide-react';

// ── All 40 photos ──
const ALL_PHOTOS = [
  '1FB2E855-F6AF-4E18-8427-C17C3191F0A5.jpg',
  '2D6F07A6-E81B-4406-ACFE-2B4E4C7BC035.jpg',
  '2e43c1d9-06e4-4a64-a808-faeea6abcc4d.jpg',
  '6C775914-AD13-49D3-AF13-E4F5DB62CE5C 2.JPG',
  '6C775914-AD13-49D3-AF13-E4F5DB62CE5C.JPG',
  '6b6c39ca-2004-4484-ac7e-7ccbe6681e77.jpg',
  '93854d5e-ae81-43d2-bce8-c5c668471df7.jpg',
  'DA694ECE-B93E-4A8D-8C9E-007791367148.jpg',
  'F1650C79-690A-4D35-BBDC-BBFBC141B41B.JPG',
  'IMG_0360.jpeg', 'IMG_0517.jpeg', 'IMG_0542.jpeg',
  'IMG_1050.jpeg', 'IMG_1080.jpeg', 'IMG_1339.jpeg',
  'IMG_1382.jpeg', 'IMG_1400.jpeg', 'IMG_1630.jpeg',
  'IMG_2194 2.JPG', 'IMG_2466.JPG', 'IMG_2710.jpeg',
  'IMG_3024.jpeg', 'IMG_3152.jpeg', 'IMG_3740.jpeg',
  'IMG_4742.jpeg', 'IMG_4861.jpeg', 'IMG_4872.JPG',
  'IMG_4894.JPG',  'IMG_4923.JPG', 'IMG_5379.jpeg',
  'IMG_5533.JPG',  'IMG_5695.JPG', 'IMG_6214.jpeg',
  'IMG_6425.JPG',  'IMG_6512.jpeg','IMG_7451.JPG',
  'IMG_7747.jpeg', 'IMG_9195.jpeg','IMG_9353.jpeg',
  'IMG_9400.jpeg',
];

const QUANTUM_CHARS =
  '01アイウエオカキクケコサシスセソタチツテトψ∞∆Ωφℏ量子宇宙AMORVIDAMARIANAJC';

// ── Quantum Card ──
function QuantumCard({ visible }) {
  const [active, setActive] = useState(false);
  const canvasRef = useRef(null);
  const dropsRef  = useRef([]);

  // Stable idle scatter (deterministic)
  const idlePos = useMemo(() =>
    ALL_PHOTOS.map((_, i) => ({
      x: ((i * 47 + 11) % 200) - 100,
      y: ((i * 61 + 7)  % 160) - 80,
      r: ((i * 73)      % 60)  - 30,
    })), []);

  const [activePos, setActivePos] = useState(() =>
    ALL_PHOTOS.map(() => ({
      x: (Math.random() * 700 - 350),
      y: (Math.random() * 380 - 190),
      r: (Math.random() * 540 - 270),
      s: 0.45 + Math.random() * 0.75,
    }))
  );

  useEffect(() => {
    if (!active) return;

    // Randomise photos periodically
    const randomize = () => setActivePos(
      ALL_PHOTOS.map(() => ({
        x: (Math.random() * 700 - 350),
        y: (Math.random() * 380 - 190),
        r: (Math.random() * 540 - 270),
        s: 0.45 + Math.random() * 0.75,
      }))
    );
    randomize();
    const ticker = setInterval(randomize, 2600);

    // Matrix rain
    const canvas = canvasRef.current;
    if (!canvas) return () => clearInterval(ticker);
    const rect = canvas.getBoundingClientRect();
    canvas.width  = Math.floor(rect.width);
    canvas.height = Math.floor(rect.height);
    const ctx = canvas.getContext('2d');
    const cw = 14;
    const cols = Math.floor(canvas.width / cw);
    dropsRef.current = Array.from({ length: cols }, () =>
      Math.floor(Math.random() * -canvas.height / cw)
    );

    let animId;
    const draw = () => {
      ctx.fillStyle = 'rgba(7,0,14,0.055)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      dropsRef.current.forEach((_, i) => {
        const char  = QUANTUM_CHARS[Math.floor(Math.random() * QUANTUM_CHARS.length)];
        const isGold  = Math.random() < 0.07;
        const isWhite = Math.random() < 0.02;
        ctx.fillStyle = isGold
          ? `rgba(212,168,83,${0.65 + Math.random() * 0.35})`
          : isWhite
            ? `rgba(245,230,200,0.9)`
            : `rgba(0,${180 + Math.floor(Math.random() * 75)},${50 + Math.floor(Math.random() * 30)},${0.35 + Math.random() * 0.55})`;
        ctx.font = `${10 + Math.floor(Math.random() * 4)}px monospace`;
        ctx.fillText(char, i * cw, dropsRef.current[i] * cw);
        if (dropsRef.current[i] * cw > canvas.height && Math.random() > 0.975)
          dropsRef.current[i] = Math.floor(Math.random() * -12);
        else
          dropsRef.current[i]++;
      });
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      clearInterval(ticker);
      cancelAnimationFrame(animId);
      const c = canvasRef.current;
      if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height);
    };
  }, [active]);

  return (
    <div
      onClick={() => setActive(v => !v)}
      style={{
        height: 500, borderRadius: 28, overflow: 'hidden',
        position: 'relative', cursor: 'pointer',
        background: 'radial-gradient(ellipse at 50% 50%, #0d001f 0%, #07000e 100%)',
        border: active
          ? '1px solid rgba(0,220,80,0.35)'
          : '1px solid rgba(212,168,83,0.2)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 1s ease 1.05s',
        userSelect: 'none',
      }}
    >
      {/* ── Photos layer ── */}
      <div style={{ position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {ALL_PHOTOS.map((photo, i) => {
          const pos = active
            ? activePos[i]
            : { x: idlePos[i].x, y: idlePos[i].y, r: idlePos[i].r, s: 0.32 };
          return (
            <img
              key={photo}
              src={`/photos/${encodeURIComponent(photo)}`}
              alt=""
              style={{
                position: 'absolute',
                width: 78, height: 104,
                objectFit: 'cover',
                borderRadius: 6,
                border: active
                  ? '1px solid rgba(0,220,80,0.25)'
                  : '1px solid rgba(212,168,83,0.08)',
                transform: `translate(${pos.x}px,${pos.y}px) rotate(${pos.r}deg) scale(${pos.s ?? 0.32})`,
                opacity: active ? 0.72 : 0.10,
                transition: 'all 1.9s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: active ? '0 0 12px rgba(0,220,80,0.12)' : 'none',
              }}
            />
          );
        })}
      </div>

      {/* ── Matrix canvas ── */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          opacity: active ? 0.82 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none',
        }}
      />

      {/* ── Edge vignette ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(7,0,14,0.75) 100%)',
      }} />

      {/* ── Center UI ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 10, textAlign: 'center', padding: 24,
        pointerEvents: 'none',
      }}>
        {!active ? (
          <>
            {/* Idle rings */}
            {[80,130,180].map((s,i) => (
              <div key={i} style={{
                position: 'absolute', borderRadius: '50%', width: s, height: s,
                border: `1px solid rgba(212,168,83,${0.2 - i*0.05})`,
                animation: `ping-slow ${2+i*0.6}s ease-out ${i*0.4}s infinite`,
              }} />
            ))}
            <div style={{ fontSize: 44, marginBottom: 16, filter: 'drop-shadow(0 0 18px rgba(212,168,83,0.6))' }}>⚛️</div>
            <p style={{ fontSize: 10, fontFamily: 'system-ui', fontWeight: 700,
              letterSpacing: '0.4em', textTransform: 'uppercase',
              color: 'rgba(212,168,83,0.65)', marginBottom: 12 }}>
              Campo Cuántico de Memoria
            </p>
            <h3 style={{ fontSize: 'clamp(1.4rem,4vw,2.2rem)', fontWeight: 900, fontStyle: 'italic',
              color: '#f5e6c8', lineHeight: 1.1, marginBottom: 14 }}>
              Nuestros Momentos
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ height: 1, width: 30, background: 'linear-gradient(to right,transparent,rgba(212,168,83,0.4))' }} />
              <p style={{ fontSize: 10, fontFamily: 'system-ui', color: 'rgba(245,230,200,0.3)',
                letterSpacing: '0.3em', textTransform: 'uppercase' }}>toca para activar</p>
              <div style={{ height: 1, width: 30, background: 'linear-gradient(to left,transparent,rgba(212,168,83,0.4))' }} />
            </div>
          </>
        ) : (
          <div style={{
            background: 'rgba(7,0,14,0.6)', backdropFilter: 'blur(6px)',
            border: '1px solid rgba(0,220,80,0.3)', borderRadius: 18,
            padding: '18px 28px', textAlign: 'center',
          }}>
            <p style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700,
              letterSpacing: '0.35em', color: 'rgba(0,220,80,0.8)', marginBottom: 10 }}>
              CAMPO ACTIVO · {ALL_PHOTOS.length} MEMORIAS LIBERADAS
            </p>
            <p style={{ fontSize: 'clamp(1rem,3vw,1.5rem)', fontWeight: 900, fontStyle: 'italic',
              background: 'linear-gradient(135deg,#d4a853,#c4687a)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: 10 }}>
              Familia · Amor · Vida
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 10 }}>
              {['MADRID','DENVER','BRECKENRIDGE','AMOR'].map(w => (
                <span key={w} style={{
                  fontSize: 8, fontFamily: 'monospace', fontWeight: 800,
                  letterSpacing: '0.2em', color: 'rgba(212,168,83,0.7)',
                  background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.2)',
                  padding: '3px 8px', borderRadius: 6,
                }}>{w}</span>
              ))}
            </div>
            <p style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(0,220,80,0.4)',
              letterSpacing: '0.2em' }}>toca para cerrar</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────

const confirmations = [
  { label: "Vuelo Mariana  ·  Iberia / AA",                status: "✓ Confirmado" },
  { label: "Gaylord Rockies Resort  ·  8 noches",          status: "✓ Confirmado" },
  { label: "Retiro Encephalon  ·  Dr. Joe",                status: "✓ Confirmado" },
  { label: "JEEP Wrangler  ·  Renta",                      status: "✓ Confirmado" },
  { label: "One Ski Hill Place  ·  Breckenridge  ·  3 noches", status: "✓ Confirmado" },
];

const highlights = [
  { icon: MapPin,   color: '#c4687a', bg: 'rgba(196,104,122,0.1)',
    title: "Gaylord Rockies Resort", desc: "Aurora, Colorado · Mountain View Upgrade — despertarás frente a los picos nevados." },
  { icon: Sparkles, color: '#d4a853', bg: 'rgba(212,168,83,0.1)',
    title: "Retiro Encephalon 2026", desc: "7 días de inmersión con Dr. Joe Dispenza para conectar con el vacío cuántico." },
  { icon: Plane,    color: '#93c5fd', bg: 'rgba(147,197,253,0.1)',
    title: "Vuelos Iberia / American", desc: "MAD → DFW → DEN · Confort, espacio y asientos ya elegidos contigo en mente." },
  { icon: Mountain, color: '#6ee7b7', bg: 'rgba(110,231,183,0.1)',
    title: "Breckenridge Post-Retiro", desc: "One Ski Hill Place · 3 días en las pistas de esquí, en el corazón de la montaña." },
];

const itinerary = [
  { date:'Jue 2 Abr',      icon:Plane,   color:'#93c5fd', bg:'rgba(147,197,253,0.08)', label:'Llegada Juan Carlos',       detail:'Vuelo AA2027/420 · QRO → DFW → DEN', sub:'Llega a Denver · 1:57 PM',                    tag:null },
  { date:'Vie 3 Abr',      icon:Plane,   color:'#c4687a', bg:'rgba(196,104,122,0.08)', label:'Llegada Mariana ✈',         detail:'MAD → DFW → DEN · Iberia / AA',       sub:'Juan Carlos ya te espera en Denver 🤍',       tag:null },
  { date:'Sáb 4 Abr',      icon:Sparkles,color:'#d4a853', bg:'rgba(212,168,83,0.08)',  label:'Inicio del Retiro',         detail:'Registro: 10:00 AM – 5:00 PM',        sub:'Apertura del salón: 5:30 PM · Inicio: 6:00 PM', tag:'ENCEPHALON' },
  { date:'Dom 5 – Jue 9',  icon:Sunrise, color:'#a78bfa', bg:'rgba(167,139,250,0.08)', label:'Retiro Dr. Joe Dispenza',   detail:'Sesiones intensivas · Gaylord Rockies',sub:'Inicio diario ~4:00 AM / 6:00 AM · Aurora, CO', tag:'5 DÍAS' },
  { date:'Vie 10 Abr',     icon:Star,    color:'#6ee7b7', bg:'rgba(110,231,183,0.08)', label:'Fin del Retiro',            detail:'Clausura aprox. 2:00 PM',             sub:'Integración y celebración 🌿',                tag:null },
  { date:'Vie 10 Abr',     icon:Car,     color:'#fbbf24', bg:'rgba(251,191,36,0.08)',  label:'Traslado a la Montaña',     detail:'Renta de auto · 3:30 PM · Denver Airport (Dollar)', sub:'Conducir a Breckenridge, Colorado', tag:null },
  { date:'Vie 10 – Lun 13',icon:Mountain,color:'#6ee7b7', bg:'rgba(110,231,183,0.08)', label:'Breckenridge',             detail:'One Ski Hill Place · Descanso e integración', sub:'3 noches en el corazón de la montaña nevada', tag:'3 NOCHES' },
  { date:'Lun 13 Abr',     icon:Plane,   color:'#93c5fd', bg:'rgba(147,197,253,0.08)', label:'Regreso a España',         detail:'Vuelo 5:44 PM · DEN → ORD → MAD',    sub:'Juan Carlos y Mariana viajan juntos a Madrid 🤍', tag:null },
  { date:'Mar 14 Abr',     icon:MapPin,  color:'#c4687a', bg:'rgba(196,104,122,0.08)', label:'Llegada a Madrid',         detail:'Aterrizaje Terminal 4S · 1:30 PM',     sub:'De vuelta a casa, transformados',             tag:null },
];

// ─────────────────────────────────────────

export default function RevealScreen() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#07000e', color: '#f5e6c8' }}>

      {/* ══ HERO ══ */}
      <div className="relative overflow-hidden" style={{
        background: 'radial-gradient(ellipse at 50% 0%, #280040 0%, #07000e 65%)',
        padding: '80px 24px 120px', textAlign: 'center',
      }}>
        {[300,500,700].map((s,i) => (
          <div key={i} className="absolute rounded-full pointer-events-none" style={{
            width:s, height:s,
            border:`1px solid rgba(212,168,83,${0.08-i*0.02})`,
            top:'50%', left:'50%', transform:'translate(-50%,-50%)',
          }} />
        ))}
        {[...Array(3)].map((_,i) => (
          <div key={i} style={{
            position:'absolute', height:1, width:180,
            background:'linear-gradient(to right,transparent,rgba(212,168,83,0.6),transparent)',
            top:`${15+i*30}%`, left:-200,
            animation:`shooting-star ${5+i}s linear ${i*2}s infinite`, opacity:0,
          }} />
        ))}

        <div style={{
          opacity: visible?1:0, transform: visible?'translateY(0)':'translateY(30px)',
          transition:'all 1.2s cubic-bezier(0.16,1,0.3,1)', position:'relative', zIndex:10,
        }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:10,
            padding:'8px 24px', borderRadius:100,
            border:'1px solid rgba(212,168,83,0.3)', background:'rgba(212,168,83,0.06)', marginBottom:32,
          }}>
            <span style={{ fontSize:10, fontFamily:'system-ui', fontWeight:700,
              letterSpacing:'0.35em', textTransform:'uppercase', color:'#d4a853' }}>
              ✦  15 / 15  ·  Sincronización Completada  ✦
            </span>
          </div>

          <div style={{
            fontSize:'clamp(3.5rem,14vw,9rem)', fontWeight:900, lineHeight:0.9,
            fontStyle:'italic', letterSpacing:'-0.02em', marginBottom:16,
          }}>
            <div style={{ color:'#f5e6c8' }}>¡FELIZ</div>
            <div style={{
              background:'linear-gradient(135deg,#d4a853 0%,#c4687a 50%,#d4a853 100%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              backgroundSize:'200% 100%', animation:'shimmer 4s linear infinite',
            }}>CUMPLEAÑOS!</div>
          </div>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginBottom:28 }}>
            <div style={{ height:1, width:60, background:'linear-gradient(to right,transparent,rgba(212,168,83,0.5))' }} />
            <Heart style={{ width:18, height:18, color:'#c4687a', fill:'#c4687a', animation:'heartbeat 1.5s ease infinite' }} />
            <div style={{ height:1, width:60, background:'linear-gradient(to left,transparent,rgba(212,168,83,0.5))' }} />
          </div>

          <p style={{ fontSize:'clamp(1rem,2.5vw,1.3rem)', fontWeight:300, lineHeight:1.7,
            color:'rgba(245,230,200,0.7)', maxWidth:560, margin:'0 auto' }}>
            Has demostrado que cada momento que hemos vivido
            vive también en ti. El universo ha respondido:
            <strong style={{ color:'#f5e6c8', display:'block', marginTop:8 }}>Denver nos espera.</strong>
          </p>
        </div>
      </div>

      {/* ══ CONTENT ══ */}
      <div style={{ maxWidth:960, margin:'0 auto', padding:'0 20px 80px', marginTop:-60 }}>
        <div style={{ display:'grid', gap:20, gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))' }}>

          {/* ── Trip card ── */}
          <div style={{
            gridColumn:'1 / -1',
            background:'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))',
            border:'1px solid rgba(212,168,83,0.2)', borderRadius:28, padding:'36px 32px',
            backdropFilter:'blur(20px)', boxShadow:'0 30px 80px rgba(0,0,0,0.4)',
            opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(40px)',
            transition:'all 1s ease 0.3s',
          }}>
            <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'flex-start', gap:20, marginBottom:32 }}>
              <div>
                <p style={{ fontSize:10, fontFamily:'system-ui', fontWeight:700, letterSpacing:'0.3em',
                  textTransform:'uppercase', color:'#d4a853', marginBottom:8 }}>Tu Experiencia de Vida</p>
                <h2 style={{ fontSize:'clamp(1.8rem,5vw,2.8rem)', fontWeight:900, lineHeight:1.1,
                  color:'#f5e6c8', fontStyle:'italic' }}>
                  Denver:<br/>Week Long Retreat
                </h2>
              </div>
              <div style={{
                background:'linear-gradient(135deg,#d4a853,#c4687a)',
                borderRadius:20, padding:'20px 28px', textAlign:'center', minWidth:130,
              }}>
                <Calendar style={{ width:16, height:16, color:'#07000e', margin:'0 auto 4px', opacity:0.7 }} />
                <div style={{ fontSize:10, fontWeight:800, color:'#07000e', letterSpacing:'0.2em', opacity:0.7 }}>ABRIL</div>
                <div style={{ fontSize:36, fontWeight:900, color:'#07000e', lineHeight:1 }}>02–14</div>
                <div style={{ fontSize:10, fontWeight:800, color:'#07000e', letterSpacing:'0.2em', opacity:0.7 }}>2026</div>
              </div>
            </div>
            <div style={{
              display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',
              gap:20, borderTop:'1px solid rgba(212,168,83,0.1)', paddingTop:28,
            }}>
              {highlights.map((h,i) => {
                const Icon = h.icon;
                return (
                  <div key={i} style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
                    <div style={{
                      width:48, height:48, borderRadius:14, flexShrink:0,
                      background:h.bg, border:`1px solid ${h.color}30`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      <Icon style={{ width:20, height:20, color:h.color }} />
                    </div>
                    <div>
                      <p style={{ fontSize:15, fontWeight:700, color:'#f5e6c8', marginBottom:4 }}>{h.title}</p>
                      <p style={{ fontSize:12, fontFamily:'system-ui', color:'rgba(245,230,200,0.5)', lineHeight:1.5 }}>{h.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Itinerary ── */}
          <div style={{
            gridColumn:'1 / -1',
            background:'rgba(255,255,255,0.02)', border:'1px solid rgba(212,168,83,0.18)',
            borderRadius:28, padding:'36px 32px',
            opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(40px)',
            transition:'all 1s ease 0.45s',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:32 }}>
              <div style={{
                width:44, height:44, borderRadius:12, flexShrink:0,
                background:'rgba(212,168,83,0.1)', border:'1px solid rgba(212,168,83,0.25)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Calendar style={{ width:20, height:20, color:'#d4a853' }} />
              </div>
              <div>
                <p style={{ fontSize:10, fontFamily:'system-ui', fontWeight:700,
                  letterSpacing:'0.3em', textTransform:'uppercase', color:'#d4a853', marginBottom:2 }}>Abril 2026</p>
                <h3 style={{ fontSize:22, fontWeight:900, fontStyle:'italic', color:'#f5e6c8', lineHeight:1 }}>
                  Itinerario Completo del Viaje
                </h3>
              </div>
            </div>
            <div style={{ position:'relative' }}>
              <div style={{
                position:'absolute', left:19, top:8, bottom:8, width:1,
                background:'linear-gradient(to bottom,rgba(212,168,83,0.4),rgba(196,104,122,0.2),rgba(212,168,83,0.1))',
              }} />
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {itinerary.map((item,i) => {
                  const Icon = item.icon;
                  const isLast = i === itinerary.length-1;
                  return (
                    <div key={i} style={{ display:'flex', gap:20, paddingBottom:isLast?0:24, position:'relative' }}>
                      <div style={{
                        width:40, height:40, borderRadius:'50%', flexShrink:0,
                        background:item.bg, border:`1.5px solid ${item.color}60`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        position:'relative', zIndex:2, boxShadow:`0 0 12px ${item.color}20`,
                      }}>
                        <Icon style={{ width:16, height:16, color:item.color }} />
                      </div>
                      <div style={{
                        flex:1, paddingTop:8,
                        borderBottom:isLast?'none':'1px solid rgba(212,168,83,0.06)',
                        paddingBottom:isLast?0:20,
                      }}>
                        <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:8, marginBottom:4 }}>
                          <span style={{
                            fontSize:10, fontFamily:'system-ui', fontWeight:700,
                            letterSpacing:'0.2em', textTransform:'uppercase',
                            color:item.color, background:item.bg,
                            padding:'3px 10px', borderRadius:100, border:`1px solid ${item.color}30`,
                          }}>{item.date}</span>
                          {item.tag && (
                            <span style={{
                              fontSize:9, fontFamily:'system-ui', fontWeight:800,
                              letterSpacing:'0.2em', textTransform:'uppercase', color:'#07000e',
                              background:'linear-gradient(135deg,#d4a853,#c4687a)',
                              padding:'3px 10px', borderRadius:100,
                            }}>{item.tag}</span>
                          )}
                        </div>
                        <p style={{ fontSize:15, fontWeight:700, color:'#f5e6c8', marginBottom:3 }}>{item.label}</p>
                        <p style={{ fontSize:12, fontFamily:'system-ui', color:'rgba(245,230,200,0.55)', marginBottom:2, lineHeight:1.5 }}>{item.detail}</p>
                        <p style={{ fontSize:11, fontFamily:'system-ui', color:'rgba(245,230,200,0.35)', lineHeight:1.4 }}>{item.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Confirmation list ── */}
          <div style={{
            background:'rgba(255,255,255,0.03)', border:'1px solid rgba(212,168,83,0.15)',
            borderRadius:24, padding:'28px 24px',
            opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(40px)',
            transition:'all 1s ease 0.6s',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:'#6ee7b7',
                boxShadow:'0 0 8px rgba(110,231,183,0.6)', animation:'pulse 2s infinite' }} />
              <span style={{ fontSize:11, fontFamily:'system-ui', fontWeight:700,
                letterSpacing:'0.2em', textTransform:'uppercase', color:'#f5e6c8' }}>
                Validación Cuántica
              </span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {confirmations.map((item,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:13, fontFamily:'system-ui', color:'rgba(245,230,200,0.5)', lineHeight:1.4 }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize:12, fontFamily:'system-ui', fontWeight:700, color:'#6ee7b7', whiteSpace:'nowrap' }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Return to Madrid photo card ── */}
          <div style={{
            background:'rgba(255,255,255,0.02)', border:'1px solid rgba(212,168,83,0.18)',
            borderRadius:28, overflow:'hidden',
            opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(40px)',
            transition:'all 1s ease 0.7s',
          }}>
            <div style={{ position:'relative', height:180, overflow:'hidden' }}>
              <img src="/photos/6b6c39ca-2004-4484-ac7e-7ccbe6681e77.jpg" alt=""
                style={{ position:'absolute', inset:0, width:'100%', height:'100%',
                  objectFit:'cover', objectPosition:'center', filter:'brightness(0.75)' }} />
              <div style={{ position:'absolute', inset:0,
                background:'linear-gradient(to bottom,transparent 30%,rgba(7,0,14,0.85) 100%)' }} />
              <div style={{
                position:'absolute', top:14, left:14,
                display:'inline-flex', alignItems:'center', gap:7,
                padding:'5px 14px', borderRadius:100,
                background:'rgba(7,0,14,0.5)', border:'1px solid rgba(212,168,83,0.35)',
                backdropFilter:'blur(8px)',
              }}>
                <Plane style={{ width:12, height:12, color:'#d4a853' }} />
                <span style={{ fontSize:9, fontFamily:'system-ui', fontWeight:800,
                  letterSpacing:'0.3em', textTransform:'uppercase', color:'#d4a853' }}>
                  Lun 13 · DEN → MAD
                </span>
              </div>
            </div>
            <div style={{ padding:'22px 26px' }}>
              <p style={{ fontSize:10, fontFamily:'system-ui', fontWeight:700,
                letterSpacing:'0.3em', textTransform:'uppercase', color:'#d4a853', marginBottom:10 }}>
                El Regreso
              </p>
              <p style={{ fontSize:'clamp(0.95rem,2.5vw,1.05rem)', fontWeight:300,
                fontStyle:'italic', color:'rgba(245,230,200,0.85)', lineHeight:1.7 }}>
                "Regreso a Madrid juntos, después de un viaje inolvidable y llenos de energía."
              </p>
            </div>
          </div>

          {/* ── Breckenridge showcase ── */}
          <div style={{
            gridColumn:'1 / -1',
            borderRadius:28, overflow:'hidden', position:'relative',
            opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(40px)',
            transition:'all 1s ease 0.85s',
            boxShadow:'0 40px 100px rgba(0,0,0,0.5)',
          }}>
            <div style={{
              background:'linear-gradient(170deg,#0a1628 0%,#0d2240 25%,#1a3a5c 50%,#2d5a8e 70%,#3d7ab5 85%,#6ba3d6 100%)',
              padding:'56px 40px 0', position:'relative', overflow:'hidden',
            }}>
              {[...Array(18)].map((_,i) => (
                <div key={i} style={{
                  position:'absolute', borderRadius:'50%',
                  width:i%3===0?3:2, height:i%3===0?3:2,
                  background:'white',
                  top:`${5+(i*17)%45}%`, left:`${(i*13+7)%95}%`,
                  opacity:0.4+(i%4)*0.15,
                  animation:`heartbeat ${2+(i%3)}s ease ${i*0.3}s infinite`,
                }} />
              ))}
              <div style={{
                position:'absolute', top:0, left:0, right:0, height:'60%',
                background:'radial-gradient(ellipse at 30% 20%,rgba(110,231,183,0.12) 0%,transparent 60%),radial-gradient(ellipse at 70% 30%,rgba(147,197,253,0.10) 0%,transparent 55%)',
                pointerEvents:'none',
              }} />
              <div style={{ position:'relative', zIndex:2, marginBottom:32 }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:8,
                  padding:'6px 18px', borderRadius:100,
                  background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)',
                  marginBottom:20 }}>
                  <span style={{ fontSize:9, fontFamily:'system-ui', fontWeight:800,
                    letterSpacing:'0.35em', textTransform:'uppercase', color:'#93c5fd' }}>
                    ✦  Post-Retiro · Aventura de Montaña  ✦
                  </span>
                </div>
                <h3 style={{ fontSize:'clamp(2rem,6vw,3.5rem)', fontWeight:900, fontStyle:'italic',
                  color:'#ffffff', lineHeight:1, marginBottom:10, textShadow:'0 2px 20px rgba(0,0,0,0.4)' }}>
                  Breckenridge,
                </h3>
                <h3 style={{ fontSize:'clamp(2rem,6vw,3.5rem)', fontWeight:900, fontStyle:'italic',
                  color:'#ffffff', lineHeight:1, marginBottom:20, textShadow:'0 2px 20px rgba(0,0,0,0.4)' }}>
                  Colorado
                </h3>
                <p style={{ fontSize:'clamp(0.9rem,2vw,1.05rem)', fontWeight:300, color:'rgba(255,255,255,0.65)', maxWidth:480, lineHeight:1.7 }}>
                  Después de siete días transformando tu mente en el retiro, la montaña te espera
                  para integrar, respirar y celebrar lo que eres ahora.
                </p>
              </div>
              <svg viewBox="0 0 960 220" xmlns="http://www.w3.org/2000/svg"
                style={{ display:'block', width:'100%', marginBottom:-2, position:'relative', zIndex:2 }}>
                <polygon points="0,220 120,60 240,220"   fill="#1a3a5c" opacity="0.7" />
                <polygon points="100,220 260,30 420,220"  fill="#1e4470" opacity="0.8" />
                <polygon points="300,220 480,10 660,220"  fill="#234f80" />
                <polygon points="480,10 450,55 510,55"    fill="white"   opacity="0.9" />
                <polygon points="260,30 237,68 283,68"    fill="white"   opacity="0.75" />
                <polygon points="500,220 650,70 800,220"  fill="#0d2240" />
                <polygon points="640,220 760,90 880,220"  fill="#091828" />
                <polygon points="750,220 870,100 990,220" fill="#060f1a" />
                <polygon points="650,70 630,100 670,100"  fill="white"   opacity="0.7" />
                <polygon points="760,90 743,118 777,118"  fill="white"   opacity="0.65" />
                <rect x="0" y="195" width="960" height="25" fill="#e8f4fd" opacity="0.9" rx="4" />
                <ellipse cx="200" cy="195" rx="140" ry="18" fill="white" opacity="0.4" />
                <ellipse cx="600" cy="195" rx="180" ry="20" fill="white" opacity="0.35" />
              </svg>
            </div>
            <div style={{
              background:'linear-gradient(135deg,#060f1a,#0a1628)',
              padding:'28px 40px', display:'flex', flexWrap:'wrap', gap:32, alignItems:'center',
              borderTop:'1px solid rgba(147,197,253,0.15)',
            }}>
              {[
                { emoji:'🏔️', label:'Altitud',       val:'2,926 m' },
                { emoji:'🎿', label:'Pistas de esquí', val:'187 km' },
                { emoji:'🏨', label:'Alojamiento',    val:'One Ski Hill Place' },
                { emoji:'🌙', label:'Noches',         val:'3 noches  ·  Abr 10–13' },
              ].map((item,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:24 }}>{item.emoji}</span>
                  <div>
                    <p style={{ fontSize:10, fontFamily:'system-ui', fontWeight:700,
                      letterSpacing:'0.2em', textTransform:'uppercase',
                      color:'rgba(147,197,253,0.5)', marginBottom:2 }}>{item.label}</p>
                    <p style={{ fontSize:14, fontWeight:700, color:'#f5e6c8' }}>{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ══ Quantum card + Love note side by side ══ */}
          <div style={{
            gridColumn:'1 / -1',
            display:'flex', gap:20, flexWrap:'wrap', alignItems:'stretch',
          }}>
            {/* Quantum card — 2/3 width */}
            <div style={{ flex:'2 1 380px' }}>
              <QuantumCard visible={visible} />
            </div>

            {/* Love note — 1/3 width */}
            <div style={{
              flex:'1 1 260px',
              background:'linear-gradient(135deg,rgba(196,104,122,0.15),rgba(212,168,83,0.08))',
              border:'1px solid rgba(196,104,122,0.25)',
              borderRadius:28, padding:'32px 28px',
              position:'relative', overflow:'hidden',
              opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(40px)',
              transition:'all 1s ease 1.15s',
              display:'flex', flexDirection:'column', justifyContent:'space-between',
            }}>
              {/* Watermark heart */}
              <Heart style={{
                position:'absolute', bottom:-20, right:-20,
                width:120, height:120, color:'rgba(212,168,83,0.06)', fill:'currentColor',
              }} />
              <div>
                <Heart style={{
                  width:24, height:24, color:'#c4687a', fill:'#c4687a', marginBottom:20,
                  animation:'heartbeat 2s ease infinite',
                }} />
                <p style={{ fontSize:'clamp(0.95rem,2.5vw,1.05rem)', fontWeight:300, lineHeight:1.85,
                  fontStyle:'italic', color:'rgba(245,230,200,0.85)', marginBottom:24 }}>
                  "Este no es solo un regalo de cumpleaños —<br />
                  es una inversión en nuestro futuro compartido.<br />
                  <br />
                  Gracias por ser mi compañera de viaje en esta{' '}
                  <strong style={{ color:'#f5e6c8', fontStyle:'normal', fontWeight:700 }}>HISTORIA DE VIDA</strong>{' '}
                  y en todas las que faltan por descubrir."
                </p>
              </div>
              <div style={{ borderTop:'1px solid rgba(212,168,83,0.15)', paddingTop:20 }}>
                <p style={{ fontSize:22, fontWeight:900, fontStyle:'italic',
                  background:'linear-gradient(135deg,#d4a853,#c4687a)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  Te amo.
                </p>
                <p style={{ fontSize:10, fontFamily:'system-ui', letterSpacing:'0.25em',
                  textTransform:'uppercase', color:'rgba(245,230,200,0.3)', marginTop:6, lineHeight:1.5 }}>
                  Tu Compañero de Vida<br />por Elección
                </p>
              </div>
            </div>
          </div>

          {/* ── Manifestation quote ── */}
          <div style={{
            gridColumn:'1 / -1',
            background:'linear-gradient(135deg,rgba(212,168,83,0.08),rgba(7,0,14,0))',
            border:'1px solid rgba(212,168,83,0.15)',
            borderRadius:24, padding:'32px 28px',
            textAlign:'center', position:'relative',
            opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(40px)',
            transition:'all 1s ease 1.3s',
          }}>
            <Star style={{ width:20, height:20, color:'#d4a853', fill:'#d4a853',
              margin:'0 auto 16px', animation:'heartbeat 3s ease infinite' }} />
            <p style={{ fontSize:'clamp(1rem,2.5vw,1.15rem)', fontStyle:'italic',
              fontWeight:300, color:'rgba(245,230,200,0.7)', lineHeight:1.9,
              maxWidth:600, margin:'0 auto', textAlign:'center' }}>
              "A partir de hoy, no esperes a estar en Denver para ser feliz.<br />
              Empieza a ser la Mariana que ya estuvo allí,<br />
              que ya sanó, que ya amó profundamente y sin miedo."
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
