'use client';

import Link from 'next/link';
import Image from 'next/image';

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
  // Height of the logo image based on size prop
  const heights = {
    small: 28,
    medium: 36,
    large: 44,
  };

  const h = heights[size];
  // The logo.png aspect ratio is roughly 3.2:1 (wide with text), icon-only ~1:1
  // When showText=false, show just the icon portion (square crop via object-fit)
  const w = showText ? Math.round(h * 3.2) : h;

  const logoContent = (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        flexShrink: 0,
      }}
    >
      {showText ? (
        <Image
          src="/logo.png"
          alt="Befach International"
          width={w}
          height={h}
          style={{
            height: h,
            width: 'auto',
            objectFit: 'contain',
          }}
          priority
        />
      ) : (
        <div style={{
          width: h,
          height: h,
          overflow: 'hidden',
          position: 'relative',
          flexShrink: 0,
        }}>
          <Image
            src="/logo.png"
            alt="Befach"
            width={200}
            height={60}
            style={{
              height: h,
              width: 'auto',
              objectFit: 'cover',
              objectPosition: 'left center',
            }}
            priority
          />
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
