import { useState, useEffect } from 'react';
import { MapPin, Plane, Mountain, Sparkles, Heart, Calendar, Star } from 'lucide-react';

const confirmations = [
  { label: "Vuelo Mariana  ·  Iberia / AA",     status: "✓ Confirmado" },
  { label: "Gaylord Rockies Resort  ·  8 noches", status: "✓ Confirmado" },
  { label: "Retiro Encephalon  ·  Dr. Joe",       status: "✓ Confirmado" },
  { label: "JEEP Wrangler  ·  Renta",            status: "✓ Confirmado" },
  { label: "One Ski Hill Place  ·  Breckenridge", status: "✓ Confirmado" },
];

const highlights = [
  { icon: MapPin,    color: '#c4687a', bg: 'rgba(196,104,122,0.1)',
    title: "Gaylord Rockies Resort", desc: "Aurora, Colorado · Mountain View Upgrade — despertarás frente a los picos nevados." },
  { icon: Sparkles,  color: '#d4a853', bg: 'rgba(212,168,83,0.1)',
    title: "Retiro Encephalon 2026", desc: "7 días de inmersión con Dr. Joe Dispenza para conectar con el vacío cuántico." },
  { icon: Plane,     color: '#93c5fd', bg: 'rgba(147,197,253,0.1)',
    title: "Vuelos Iberia / American", desc: "MAD → DFW → DEN · Confort, espacio y asientos ya elegidos contigo en mente." },
  { icon: Mountain,  color: '#6ee7b7', bg: 'rgba(110,231,183,0.1)',
    title: "Breckenridge Post-Retiro", desc: "One Ski Hill Place · 3 días en las pistas de esquí, en el corazón de la montaña." },
];

export default function RevealScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#07000e', color: '#f5e6c8' }}>

      {/* ══ HERO HEADER ══ */}
      <div className="relative overflow-hidden" style={{
        background: 'radial-gradient(ellipse at 50% 0%, #280040 0%, #07000e 65%)',
        padding: '80px 24px 120px',
        textAlign: 'center',
      }}>
        {/* Decorative rings */}
        {[300, 500, 700].map((s, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none"
            style={{
              width: s, height: s,
              border: `1px solid rgba(212,168,83,${0.08 - i * 0.02})`,
              top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
            }} />
        ))}

        {/* Shooting stars */}
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', height: 1, width: 180,
            background: 'linear-gradient(to right, transparent, rgba(212,168,83,0.6), transparent)',
            top: `${15 + i * 30}%`, left: -200,
            animation: `shooting-star ${5 + i}s linear ${i * 2}s infinite`,
            opacity: 0,
          }} />
        ))}

        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1.2s cubic-bezier(0.16,1,0.3,1)',
          position: 'relative', zIndex: 10,
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '8px 24px', borderRadius: 100,
            border: '1px solid rgba(212,168,83,0.3)',
            background: 'rgba(212,168,83,0.06)',
            marginBottom: 32,
          }}>
            <span style={{ fontSize: 10, fontFamily: 'system-ui', fontWeight: 700,
              letterSpacing: '0.35em', textTransform: 'uppercase', color: '#d4a853' }}>
              ✦  15 / 15  ·  Sincronización Completada  ✦
            </span>
          </div>

          {/* Main title */}
          <div style={{
            fontSize: 'clamp(3.5rem, 14vw, 9rem)',
            fontWeight: 900, lineHeight: 0.9,
            fontStyle: 'italic', letterSpacing: '-0.02em',
            marginBottom: 16,
          }}>
            <div style={{ color: '#f5e6c8' }}>¡FELIZ</div>
            <div style={{
              background: 'linear-gradient(135deg, #d4a853 0%, #c4687a 50%, #d4a853 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 100%',
              animation: 'shimmer 4s linear infinite',
            }}>CUMPLEAÑOS!</div>
          </div>

          {/* Ornament */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 28 }}>
            <div style={{ height: 1, width: 60, background: 'linear-gradient(to right, transparent, rgba(212,168,83,0.5))' }} />
            <Heart style={{ width: 18, height: 18, color: '#c4687a', fill: '#c4687a', animation: 'heartbeat 1.5s ease infinite' }} />
            <div style={{ height: 1, width: 60, background: 'linear-gradient(to left, transparent, rgba(212,168,83,0.5))' }} />
          </div>

          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: 300, lineHeight: 1.7,
            color: 'rgba(245,230,200,0.7)', maxWidth: 560, margin: '0 auto' }}>
            Has demostrado que cada momento que hemos vivido
            vive también en ti. El universo ha respondido:
            <strong style={{ color: '#f5e6c8', display: 'block', marginTop: 8 }}>Denver nos espera.</strong>
          </p>
        </div>
      </div>

      {/* ══ CONTENT ══ */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px 80px', marginTop: -60 }}>
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>

          {/* ── Trip card ── */}
          <div style={{
            gridColumn: '1 / -1',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
            border: '1px solid rgba(212,168,83,0.2)',
            borderRadius: 28, padding: '36px 32px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s ease 0.3s',
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, marginBottom: 32 }}>
              <div>
                <p style={{ fontSize: 10, fontFamily: 'system-ui', fontWeight: 700, letterSpacing: '0.3em',
                  textTransform: 'uppercase', color: '#d4a853', marginBottom: 8 }}>
                  Tu Experiencia de Vida
                </p>
                <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, lineHeight: 1.1,
                  color: '#f5e6c8', fontStyle: 'italic' }}>
                  Denver:<br/>Week Long Retreat
                </h2>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #d4a853, #c4687a)',
                borderRadius: 20, padding: '20px 28px',
                textAlign: 'center', minWidth: 130,
              }}>
                <Calendar style={{ width: 16, height: 16, color: '#07000e', margin: '0 auto 4px', opacity: 0.7 }} />
                <div style={{ fontSize: 10, fontWeight: 800, color: '#07000e', letterSpacing: '0.2em', opacity: 0.7 }}>ABRIL</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#07000e', lineHeight: 1 }}>04–10</div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#07000e', letterSpacing: '0.2em', opacity: 0.7 }}>2026</div>
              </div>
            </div>

            {/* 4 highlights grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 20, borderTop: '1px solid rgba(212,168,83,0.1)', paddingTop: 28,
            }}>
              {highlights.map((h, i) => {
                const Icon = h.icon;
                return (
                  <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                      background: h.bg, border: `1px solid ${h.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon style={{ width: 20, height: 20, color: h.color }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#f5e6c8', marginBottom: 4 }}>{h.title}</p>
                      <p style={{ fontSize: 12, fontFamily: 'system-ui', color: 'rgba(245,230,200,0.5)', lineHeight: 1.5 }}>{h.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Confirmation list ── */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(212,168,83,0.15)',
            borderRadius: 24, padding: '28px 24px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s ease 0.5s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6ee7b7',
                boxShadow: '0 0 8px rgba(110,231,183,0.6)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 11, fontFamily: 'system-ui', fontWeight: 700,
                letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f5e6c8' }}>
                Validación Cuántica
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {confirmations.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, fontFamily: 'system-ui', color: 'rgba(245,230,200,0.5)', lineHeight: 1.4 }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: 12, fontFamily: 'system-ui', fontWeight: 700,
                    color: '#6ee7b7', whiteSpace: 'nowrap' }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Love note ── */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(196,104,122,0.15), rgba(212,168,83,0.08))',
            border: '1px solid rgba(196,104,122,0.25)',
            borderRadius: 24, padding: '32px 28px',
            position: 'relative', overflow: 'hidden',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s ease 0.7s',
          }}>
            {/* Watermark heart */}
            <Heart style={{
              position: 'absolute', bottom: -20, right: -20,
              width: 120, height: 120, color: 'rgba(212,168,83,0.06)', fill: 'currentColor',
            }} />
            <Heart style={{
              width: 24, height: 24, color: '#c4687a', fill: '#c4687a', marginBottom: 16,
              animation: 'heartbeat 2s ease infinite',
            }} />
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', fontWeight: 300, lineHeight: 1.8,
              fontStyle: 'italic', color: 'rgba(245,230,200,0.85)', marginBottom: 24 }}>
              "Este no es solo un regalo de cumpleaños — es una inversión en nuestro futuro compartido.
              Gracias por ser mi compañera de viaje en esta dimensión y en todas las que faltan por descubrir."
            </p>
            <div style={{ borderTop: '1px solid rgba(212,168,83,0.15)', paddingTop: 20 }}>
              <p style={{ fontSize: 22, fontWeight: 900, fontStyle: 'italic',
                background: 'linear-gradient(135deg, #d4a853, #c4687a)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Te amo.
              </p>
              <p style={{ fontSize: 10, fontFamily: 'system-ui', letterSpacing: '0.3em',
                textTransform: 'uppercase', color: 'rgba(245,230,200,0.3)', marginTop: 4 }}>
                Tu Co-Creador
              </p>
            </div>
          </div>

          {/* ── Manifestation quote ── */}
          <div style={{
            gridColumn: '1 / -1',
            background: 'linear-gradient(135deg, rgba(212,168,83,0.08), rgba(7,0,14,0))',
            border: '1px solid rgba(212,168,83,0.15)',
            borderRadius: 24, padding: '32px 28px',
            textAlign: 'center', position: 'relative',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s ease 0.9s',
          }}>
            <Star style={{ width: 20, height: 20, color: '#d4a853', fill: '#d4a853',
              margin: '0 auto 16px', animation: 'heartbeat 3s ease infinite' }} />
            <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', fontStyle: 'italic',
              fontWeight: 300, color: 'rgba(245,230,200,0.7)', lineHeight: 1.8,
              maxWidth: 600, margin: '0 auto' }}>
              "A partir de hoy, no esperes a estar en Denver para ser feliz. Empieza a ser
              la Mariana que ya estuvo allí, que ya sanó, que ya amó profundamente y sin miedo."
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
