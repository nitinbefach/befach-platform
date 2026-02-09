'use client';

import Link from 'next/link';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  linkTo?: string;
  className?: string;
}

export default function Logo({
  size = 'medium',
  showText = true,
  linkTo = '/',
  className = ''
}: LogoProps) {
  const sizes = {
    small: { icon: 32, textSize: '1rem', taglineSize: '0.5rem' },
    medium: { icon: 40, textSize: '1.25rem', taglineSize: '0.6rem' },
    large: { icon: 48, textSize: '1.5rem', taglineSize: '0.7rem' },
  };

  const { icon, textSize, taglineSize } = sizes[size];

  const logoContent = (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none'
      }}
    >
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 60 60"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* 3D Box Logo */}
        <polygon points="30,5 55,17 30,29 5,17" fill="#8B5A2B"/>
        <polygon points="30,29 55,17 55,43 30,55" fill="#F57C00"/>
        <polygon points="5,17 30,29 30,55 5,43" fill="#A0522D"/>
      </svg>

      {showText && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          lineHeight: 1.1
        }}>
          <span style={{
            fontSize: textSize,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: 700,
            color: '#F57C00',
            letterSpacing: '0.5px'
          }}>BEFACH</span>
          <span style={{
            fontSize: taglineSize,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: 500,
            color: 'var(--text-secondary, #78716c)',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>INTERNATIONAL</span>
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link href={linkTo} style={{ textDecoration: 'none' }}>
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}