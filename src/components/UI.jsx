import React from 'react';

export const fmt = (n) => Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });

export const Glow = ({ color = 'var(--accent)', size = 200, style = {} }) => (
  <div style={{
    position: 'absolute', borderRadius: '50%',
    width: size, height: size, background: color,
    filter: 'blur(80px)', opacity: 0.12, pointerEvents: 'none', ...style
  }} />
);

export const Badge = ({ children, color = 'var(--accent)' }) => (
  <span style={{
    background: color + '22', color, border: `1px solid ${color}55`,
    borderRadius: 4, padding: '2px 9px', fontSize: 10,
    fontFamily: 'var(--font-d)', letterSpacing: 1, fontWeight: 700,
    display: 'inline-block', whiteSpace: 'nowrap'
  }}>{children}</span>
);

export const Btn = ({ children, onClick, variant = 'primary', disabled, style = {}, size = 'md' }) => {
  const pad = size === 'sm' ? '8px 16px' : size === 'lg' ? '15px 32px' : '11px 22px';
  const fs = size === 'sm' ? 11 : size === 'lg' ? 14 : 13;
  const map = {
    primary: { background: 'linear-gradient(135deg,#f0c040,#e8a020)', color: '#04080f', boxShadow: '0 4px 20px rgba(240,192,64,0.35)' },
    danger:  { background: 'linear-gradient(135deg,#ff1744,#d500f9)', color: '#fff', boxShadow: '0 4px 20px rgba(255,23,68,0.35)' },
    ghost:   { background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)55', boxShadow: 'none' },
    green:   { background: 'linear-gradient(135deg,#00e676,#00b0ff)', color: '#04080f', boxShadow: '0 4px 20px rgba(0,230,118,0.35)' },
    dark:    { background: 'var(--card2)', color: 'var(--text)', border: '1px solid var(--border2)', boxShadow: 'none' },
    red:     { background: 'linear-gradient(135deg,#ff1744,#ff6b35)', color: '#fff', boxShadow: '0 4px 20px rgba(255,23,68,0.3)' },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...map[variant], padding: pad, borderRadius: 8, border: map[variant].border || 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-d)', fontWeight: 700, fontSize: fs,
      letterSpacing: 1, opacity: disabled ? 0.45 : 1,
      transition: 'transform .15s, box-shadow .15s, opacity .15s',
      whiteSpace: 'nowrap', ...style
    }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
    >{children}</button>
  );
};

export const Input = ({ label, type = 'text', value, onChange, placeholder, icon, readOnly }) => (
  <div style={{ marginBottom: 18 }}>
    {label && <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 7, letterSpacing: 1.5, fontFamily: 'var(--font-d)' }}>{label}</div>}
    <div style={{ position: 'relative' }}>
      {icon && <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, userSelect: 'none' }}>{icon}</span>}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}
        style={{
          width: '100%', background: readOnly ? 'var(--bg2)' : 'var(--bg3)',
          border: '1px solid var(--border2)', borderRadius: 10,
          padding: icon ? '13px 14px 13px 44px' : '13px 16px',
          color: 'var(--text)', fontSize: 15, outline: 'none', transition: 'border .2s',
          fontFamily: 'var(--font-b)', cursor: readOnly ? 'default' : 'text'
        }}
        onFocus={e => { if (!readOnly) e.target.style.borderColor = 'var(--accent)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--border2)'; }}
      />
    </div>
  </div>
);

export const Card = ({ children, style = {} }) => (
  <div style={{
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 18, position: 'relative', overflow: 'hidden', ...style
  }}>{children}</div>
);

export const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: 22 }}>
    <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 16, fontWeight: 700, letterSpacing: 3, color: 'var(--text)' }}>{children}</h2>
    {sub && <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>{sub}</p>}
  </div>
);