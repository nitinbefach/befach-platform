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
    <div className={`logo-container ${className}`}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 60 60"
        xmlns="http://www.w3.org/2000/svg"
        className="logo-icon"
      >
        {/* 3D Box Logo */}
        <polygon points="30,5 55,17 30,29 5,17" fill="#8B5A2B"/>
        <polygon points="30,29 55,17 55,43 30,55" fill="#F57C00"/>
        <polygon points="5,17 30,29 30,55 5,43" fill="#A0522D"/>
      </svg>

      {showText && (
        <div className="logo-text">
          <span className="logo-name" style={{ fontSize: textSize }}>BEFACH</span>
          <span className="logo-tagline" style={{ fontSize: taglineSize }}>INTERNATIONAL</span>
        </div>
      )}

      <style jsx>{`
        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .logo-icon {
          flex-shrink: 0;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .logo-name {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 700;
          color: #F57C00;
          letter-spacing: 0.5px;
        }

        .logo-tagline {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 500;
          color: var(--text-secondary, #78716c);
          letter-spacing: 2px;
          text-transform: uppercase;
        }
      `}</style>
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
