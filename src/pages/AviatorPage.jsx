import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fmt, Glow, Badge, Btn, Card } from '../components/UI';

const rnd = (min, max) => Math.random() * (max - min) + min;

const LiveBets = ({ phase, multiplier }) => {
  const names = ['R***ul','A***a','P***ya','V***s','M***i','S***h','K***n','D***p','N***a','J***i'];
  const [bets] = useState(() => names.map((n, i) => ({
    name: n, bet: [50,100,200,500,1000,2000][Math.floor(Math.random()*6)],
    cashedAt: Math.random() > 0.4 ? (1 + Math.random() * 8).toFixed(2) : null
  })));

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-d)', fontSize: 11, letterSpacing: 2, color: 'var(--muted)' }}>LIVE BETS</span>
        <Badge color='var(--green)'>{bets.length} PLAYERS</Badge>
      </div>
      <div style={{ maxHeight: 240, overflowY: 'auto' }}>
        {bets.map((b, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 18px', borderBottom: i < bets.length - 1 ? '1px solid rgba(22,32,80,0.5)' : 'none',
            transition: 'background .2s'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = ''}
          >
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%', fontSize: 11,
                background: `hsl(${i * 36},60%,40%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700
              }}>{b.name[0]}</div>
              <span style={{ fontSize: 13, color: 'var(--text2)' }}>{b.name}</span>
            </div>
            <span style={{ fontFamily: 'var(--font-d)', fontSize: 11, color: 'var(--muted)' }}>₹{b.bet}</span>
            <span style={{ fontFamily: 'var(--font-d)', fontSize: 12, color: b.cashedAt ? 'var(--accent)' : 'var(--text2)' }}>
              {b.cashedAt ? `${b.cashedAt}x` : '—'}
            </span>
            <span style={{ fontFamily: 'var(--font-d)', fontSize: 12, color: b.cashedAt ? 'var(--green)' : 'var(--text2)' }}>
              {b.cashedAt ? `+₹${fmt(Math.floor(b.bet * b.cashedAt))}` : 'In game'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AviatorPage({ balance, setBalance }) {
  const [phase, setPhase] = useState('waiting'); // waiting | flying | crashed
  const [multiplier, setMultiplier] = useState(1.0);
  const [betAmount, setBetAmount] = useState(100);
  const [betPlaced, setBetPlaced] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [cashOutAt, setCashOutAt] = useState(null);
  const [history, setHistory] = useState([4.2, 1.1, 12.5, 2.3, 1.05, 8.7, 3.2, 1.88, 25.0, 1.3]);
  const [countdown, setCountdown] = useState(5);
  const [message, setMessage] = useState(null); // { text, type }
  const [planeX, setPlaneX] = useState(8);
  const [planeY, setPlaneY] = useState(78);
  const [trail, setTrail] = useState([]);
  const animRef = useRef(null);
  const startTimeRef = useRef(null);
  const crashAtRef = useRef(null);
  const ctRef = useRef(null);

  const startRound = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setCashedOut(false);
    setCashOutAt(null);
    setMultiplier(1.0);
    setPlaneX(8);
    setPlaneY(78);
    setTrail([]);
    setPhase('waiting');
    setCountdown(5);

    let c = 5;
    ctRef.current = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(ctRef.current);
        beginFlight();
      }
    }, 1000);
  }, []);

  const beginFlight = () => {
    const crashAt = Math.random() < 0.15 ? rnd(1.0, 1.5) : rnd(1.5, 25);
    crashAtRef.current = crashAt;
    startTimeRef.current = Date.now();
    setPhase('flying');
    setMessage(null);

    const points = [];
    const tick = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const m = Math.pow(Math.E, elapsed * 0.38);
      const capped = Math.min(m, crashAt);
      const progress = Math.min((capped - 1) / Math.max(crashAt - 1, 0.1), 1);

      const nx = 8 + progress * 72;
      const ny = 78 - progress * 62;
      setMultiplier(capped);
      setPlaneX(nx);
      setPlaneY(ny);
      points.push({ x: nx, y: ny });
      if (points.length > 60) points.shift();
      setTrail([...points]);

      if (m >= crashAt) {
        setPhase('crashed');
        setMultiplier(crashAt);
        setHistory(h => [parseFloat(crashAt.toFixed(2)), ...h.slice(0, 9)]);
        if (betPlaced && !cashedOut) {
          setMessage({ text: `💥 CRASHED at ${crashAt.toFixed(2)}x — Lost ₹${fmt(betAmount)}`, type: 'loss' });
        }
        setBetPlaced(false);
        setTimeout(startRound, 3500);
        return;
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    startRound();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (ctRef.current) clearInterval(ctRef.current);
    };
  }, []);

  const placeBet = () => {
    if (phase !== 'waiting') return;
    if (betAmount > balance || betAmount <= 0) { setMessage({ text: '⚠️ Invalid bet amount!', type: 'warn' }); return; }
    setBetPlaced(true);
    setBalance(b => b - betAmount);
    setMessage({ text: `✅ Bet of ₹${fmt(betAmount)} placed!`, type: 'info' });
  };

  const cashOut = () => {
    if (!betPlaced || cashedOut || phase !== 'flying') return;
    const won = Math.floor(betAmount * multiplier);
    setCashedOut(true);
    setCashOutAt(multiplier.toFixed(2));
    setBalance(b => b + won);
    setMessage({ text: `🎉 Cashed out at ${multiplier.toFixed(2)}x — Won ₹${fmt(won)}!`, type: 'win' });
  };

  const quickBets = [50, 100, 200, 500, 1000, 2000, 5000];
  const msgColors = { win: { bg: 'rgba(0,230,118,0.12)', border: 'rgba(0,230,118,0.3)', color: 'var(--green)' }, loss: { bg: 'rgba(255,23,68,0.12)', border: 'rgba(255,23,68,0.3)', color: 'var(--red)' }, info: { bg: 'rgba(0,176,255,0.10)', border: 'rgba(0,176,255,0.25)', color: 'var(--blue)' }, warn: { bg: 'rgba(240,192,64,0.10)', border: 'rgba(240,192,64,0.25)', color: 'var(--accent)' } };

  // SVG trail path
  const pathD = trail.length > 1
    ? 'M ' + trail.map(p => `${p.x * 8} ${(p.y + 10) * 2.4}`).join(' L ')
    : '';

  return (
    <div style={{ paddingTop: 62, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px 48px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,rgba(255,107,53,0.2),rgba(255,107,53,0.05))', border: '1px solid rgba(255,107,53,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>✈️</div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 20, fontWeight: 900, letterSpacing: 3 }}>AVIATOR</h1>
              <div style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: 1 }}>Cash out before the plane flies away!</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Badge color='var(--red)'>🔴 LIVE</Badge>
            <Badge color='var(--green)'>RTP 97%</Badge>
            <Badge color='var(--blue)'>MAX 100x</Badge>
          </div>
        </div>

        {/* History */}
        <div style={{ display: 'flex', gap: 7, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-d)', letterSpacing: 1, marginRight: 4 }}>HISTORY:</span>
          {history.map((h, i) => (
            <div key={i} style={{
              background: h >= 2 ? 'rgba(0,230,118,0.12)' : 'rgba(255,23,68,0.12)',
              color: h >= 2 ? 'var(--green)' : 'var(--red)',
              border: `1px solid ${h >= 2 ? 'rgba(0,230,118,0.25)' : 'rgba(255,23,68,0.25)'}`,
              borderRadius: 20, padding: '3px 10px', fontSize: 11,
              fontFamily: 'var(--font-d)', fontWeight: 700
            }}>{h.toFixed(2)}x</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
          {/* Left: canvas + controls */}
          <div>
            {/* Game canvas */}
            <div style={{
              background: 'radial-gradient(ellipse at 30% 60%, rgba(255,107,53,0.05) 0%, var(--card) 60%)',
              border: '1px solid var(--border)', borderRadius: 18,
              position: 'relative', height: 320, overflow: 'hidden', marginBottom: 14
            }}>
              <Glow color={phase === 'crashed' && !cashedOut ? 'var(--red)' : phase === 'crashed' ? 'var(--green)' : 'var(--accent2)'} size={400} style={{ top: '50%', left: '40%', transform: 'translate(-50%,-50%)' }} />

              {/* Grid lines */}
              {[0.2,0.4,0.6,0.8].map(y => (
                <div key={y} style={{ position: 'absolute', left: 0, right: 0, top: `${y*100}%`, borderTop: '1px dashed rgba(255,255,255,0.04)' }} />
              ))}
              {[0.25,0.5,0.75].map(x => (
                <div key={x} style={{ position: 'absolute', top: 0, bottom: 0, left: `${x*100}%`, borderLeft: '1px dashed rgba(255,255,255,0.04)' }} />
              ))}

              {/* SVG trail */}
              {trail.length > 1 && phase === 'flying' && (
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }} viewBox='0 0 800 320' preserveAspectRatio='none'>
                  <defs>
                    <linearGradient id='trailGrad' x1='0%' y1='0%' x2='100%' y2='0%'>
                      <stop offset='0%' stopColor='#ff6b35' stopOpacity='0' />
                      <stop offset='100%' stopColor='#f0c040' stopOpacity='0.6' />
                    </linearGradient>
                  </defs>
                  <path d={pathD} fill='none' stroke='url(#trailGrad)' strokeWidth='2' />
                </svg>
              )}

              {/* Center display */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', zIndex: 2, pointerEvents: 'none' }}>
                {phase === 'waiting' && (
                  <div style={{ animation: 'fadeIn .3s ease' }}>
                    <div style={{ fontFamily: 'var(--font-d)', fontSize: 12, color: 'var(--muted)', letterSpacing: 2, marginBottom: 8 }}>NEXT ROUND IN</div>
                    <div style={{ fontFamily: 'var(--font-d)', fontSize: 88, fontWeight: 900, color: 'var(--accent)', lineHeight: 1, textShadow: '0 0 40px var(--glow)' }}>{countdown}</div>
                  </div>
                )}
                {phase === 'flying' && (
                  <div>
                    <div style={{ fontFamily: 'var(--font-d)', fontSize: 72, fontWeight: 900, color: 'var(--accent)', lineHeight: 1, textShadow: '0 0 50px var(--glow)' }}>
                      {multiplier.toFixed(2)}x
                    </div>
                    <div style={{ fontFamily: 'var(--font-d)', fontSize: 11, color: 'var(--accent)', letterSpacing: 2, marginTop: 6, opacity: 0.7 }}>FLYING...</div>
                  </div>
                )}
                {phase === 'crashed' && (
                  <div style={{ animation: 'crash-shake .4s ease' }}>
                    <div style={{ fontFamily: 'var(--font-d)', fontSize: 20, fontWeight: 900, letterSpacing: 3, color: cashedOut ? 'var(--green)' : 'var(--red)' }}>
                      {cashedOut ? '💰 CASHED OUT!' : '💥 FLEW AWAY!'}
                    </div>
                    <div style={{ fontFamily: 'var(--font-d)', fontSize: 60, fontWeight: 900, color: cashedOut ? 'var(--green)' : 'var(--red)', textShadow: cashedOut ? '0 0 30px var(--glow-g)' : '0 0 30px var(--glow-r)' }}>
                      {cashOutAt ? cashOutAt : multiplier.toFixed(2)}x
                    </div>
                  </div>
                )}
              </div>

              {/* Plane */}
              {phase !== 'crashed' && (
                <div style={{
                  position: 'absolute',
                  left: `${planeX}%`, top: `${planeY}%`,
                  fontSize: 30, transform: 'rotate(-20deg)',
                  filter: 'drop-shadow(0 0 12px rgba(240,192,64,0.9))',
                  zIndex: 3, transition: 'none',
                  animation: phase === 'waiting' ? 'float 3s ease-in-out infinite' : 'none'
                }}>✈️</div>
              )}
              {phase === 'crashed' && !cashedOut && (
                <div style={{ position: 'absolute', left: `${planeX}%`, top: `${planeY}%`, fontSize: 34, animation: 'float-crash .5s ease forwards', zIndex: 3 }}>💥</div>
              )}
              {phase === 'crashed' && cashedOut && (
                <div style={{ position: 'absolute', left: `${planeX}%`, top: `${planeY}%`, fontSize: 30, zIndex: 3 }}>✈️</div>
              )}

              {/* Multiplier axis labels */}
              {phase === 'flying' && [1, 2, 5, 10].map(v => (
                <div key={v} style={{
                  position: 'absolute', right: 10, top: `${80 - (v - 1) / 9 * 60}%`,
                  fontSize: 9, color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-d)'
                }}>{v}x</div>
              ))}
            </div>

            {/* Message */}
            {message && (
              <div style={{
                background: msgColors[message.type].bg,
                border: `1px solid ${msgColors[message.type].border}`,
                borderRadius: 10, padding: '11px 16px', marginBottom: 14,
                fontFamily: 'var(--font-d)', fontSize: 12, letterSpacing: 1,
                textAlign: 'center', color: msgColors[message.type].color,
                animation: 'fadeIn .3s ease'
              }}>{message.text}</div>
            )}

            {/* Bet controls */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Amount */}
                <div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 8, letterSpacing: 1.5, fontFamily: 'var(--font-d)' }}>BET AMOUNT (₹)</div>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10, overflow: 'hidden'
                  }}>
                    <button onClick={() => setBetAmount(b => Math.max(10, Math.floor(b / 2)))} style={{ padding: '13px 14px', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 14, fontWeight: 700, transition: 'background .15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,192,64,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}
                    >½</button>
                    <input
                      type='number' value={betAmount}
                      onChange={e => setBetAmount(Math.max(10, parseInt(e.target.value) || 10))}
                      style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text)', textAlign: 'center', fontFamily: 'var(--font-d)', fontSize: 18, fontWeight: 700, outline: 'none' }}
                    />
                    <button onClick={() => setBetAmount(b => b * 2)} style={{ padding: '13px 14px', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 14, fontWeight: 700, transition: 'background .15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,192,64,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}
                    >2×</button>
                  </div>
                  <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
                    {quickBets.map(b => (
                      <button key={b} onClick={() => setBetAmount(b)} style={{
                        background: betAmount === b ? 'rgba(240,192,64,0.15)' : 'var(--bg3)',
                        color: betAmount === b ? 'var(--accent)' : 'var(--muted)',
                        border: `1px solid ${betAmount === b ? 'rgba(240,192,64,0.4)' : 'var(--border)'}`,
                        borderRadius: 6, padding: '4px 8px', cursor: 'pointer',
                        fontSize: 10, fontFamily: 'var(--font-d)', letterSpacing: 0.5, transition: 'all .15s'
                      }}>₹{b >= 1000 ? (b / 1000) + 'K' : b}</button>
                    ))}
                  </div>
                </div>

                {/* Auto cashout */}
                <div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 8, letterSpacing: 1.5, fontFamily: 'var(--font-d)' }}>AUTO CASHOUT AT</div>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10, overflow: 'hidden'
                  }}>
                    <input
                      type='number' defaultValue={2.00} step={0.1} min={1.1}
                      style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text)', textAlign: 'center', fontFamily: 'var(--font-d)', fontSize: 18, fontWeight: 700, outline: 'none', padding: '13px 14px' }}
                    />
                    <span style={{ padding: '0 14px', color: 'var(--accent)', fontFamily: 'var(--font-d)', fontSize: 14 }}>x</span>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>
                    Potential: <span style={{ color: 'var(--green)', fontFamily: 'var(--font-d)' }}>₹{fmt(Math.floor(betAmount * 2))}</span>
                  </div>
                  <div style={{ marginTop: 4, fontSize: 11, color: 'var(--muted)' }}>
                    Balance: <span style={{ color: 'var(--green)', fontFamily: 'var(--font-d)' }}>₹{fmt(balance)}</span>
                  </div>
                </div>
              </div>

              {/* Bet/Cashout button */}
              <div style={{ marginTop: 16 }}>
                {!betPlaced ? (
                  <Btn
                    onClick={placeBet}
                    disabled={phase === 'flying' || phase === 'crashed'}
                    size='lg' style={{ width: '100%', fontSize: 14, letterSpacing: 2 }}
                  >
                    {phase === 'waiting' ? `BET ₹${fmt(betAmount)}` : phase === 'flying' ? '⏳ WAIT FOR NEXT ROUND' : '⏳ PREPARING ROUND...'}
                  </Btn>
                ) : (
                  <Btn
                    onClick={cashOut}
                    disabled={phase !== 'flying'}
                    variant={phase === 'flying' ? 'green' : 'dark'}
                    size='lg' style={{ width: '100%', fontSize: 14, letterSpacing: 2 }}
                  >
                    {phase === 'flying' ? `💰 CASH OUT ${multiplier.toFixed(2)}x → ₹${fmt(Math.floor(betAmount * multiplier))}` : '⏳ WAITING...'}
                  </Btn>
                )}
              </div>
            </div>
          </div>

          {/* Right: live bets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Round stats */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-d)', fontSize: 10, color: 'var(--muted)', letterSpacing: 2, marginBottom: 14 }}>ROUND STATS</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { l: 'TOTAL BET', v: '₹84,500', c: 'var(--text)' },
                  { l: 'PLAYERS', v: '234', c: 'var(--text)' },
                  { l: 'CASHED OUT', v: '178', c: 'var(--green)' },
                  { l: 'CRASHED', v: '56', c: 'var(--red)' },
                ].map(s => (
                  <div key={s.l} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 1.5, fontFamily: 'var(--font-d)' }}>{s.l}</div>
                    <div style={{ fontFamily: 'var(--font-d)', fontSize: 14, fontWeight: 700, color: s.c, marginTop: 4 }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <LiveBets phase={phase} multiplier={multiplier} />
          </div>
        </div>
      </div>
    </div>
  );
}