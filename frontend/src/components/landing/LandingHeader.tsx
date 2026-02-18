'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { safeStorage } from '@/lib/safeStorage';

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Check if user has completed onboarding before
    const hasOnboarded = safeStorage.getItem('befach-onboarding');
    if (hasOnboarded === 'true') {
      setIsReturningUser(true);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    document.body.style.overflow = !mobileMenuOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  const handleLogin = () => {
    if (isReturningUser) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding');
    }
  };

  return (
    <>
      <header className={`landing-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <Link href="/" className="logo">
            <img src="/logo.png" alt="Befach International" className="logo-img" />
          </Link>
          <nav className="nav-links">
            <a href="#" className="active">Home</a>
            <a href="#services">Services</a>
            <a href="#demo">Products</a>
            <a href="#testimonials">About</a>
            <a href="#cta">Contact</a>
          </nav>
          <div className="header-actions">
            <button className="btn btn-login" onClick={handleLogin}>
              {isReturningUser ? 'Go to Dashboard' : 'Login'}
            </button>
            {!isReturningUser && (
              <Link href="/onboarding" className="btn btn-primary header-cta">Start Free Trial</Link>
            )}
          </div>
          <button
            className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#" onClick={closeMenu}>Home</a>
        <a href="#services" onClick={closeMenu}>Services</a>
        <a href="#demo" onClick={closeMenu}>Products</a>
        <a href="#testimonials" onClick={closeMenu}>About</a>
        <a href="#cta" onClick={closeMenu}>Contact</a>
        <button className="btn btn-login mobile-login" onClick={() => { closeMenu(); handleLogin(); }}>
          {isReturningUser ? 'Go to Dashboard' : 'Login'}
        </button>
        {!isReturningUser && (
          <Link href="/onboarding" className="btn btn-primary mobile-cta" onClick={closeMenu}>
            Start Free Trial
          </Link>
        )}
      </div>

      <style jsx>{`
        .landing-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--landing-header-height);
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--landing-border-light);
          z-index: 1000;
          transition: box-shadow 0.3s;
        }

        .landing-header.scrolled {
          box-shadow: 0 1px 12px rgba(0, 0, 0, 0.06);
        }

        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          max-width: var(--landing-container);
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 48px);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          text-decoration: none;
        }

        .logo-img {
          height: 40px;
          width: auto;
          display: block;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-links a {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--landing-text-body);
          transition: color 0.2s;
          position: relative;
          text-decoration: none;
        }

        .nav-links a:hover {
          color: var(--landing-text-heading);
        }

        .nav-links a.active {
          color: var(--landing-text-heading);
          font-weight: 600;
        }

        .nav-links a.active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--landing-gradient-primary);
          border-radius: 2px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          text-decoration: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        .btn-login {
          padding: 10px 22px;
          font-size: 0.88rem;
          background: transparent;
          color: var(--landing-text-heading);
          border: 1.5px solid var(--landing-border);
        }

        .btn-login:hover {
          border-color: var(--landing-primary-end);
          color: var(--landing-primary-end);
          background: #fffbeb;
        }

        .btn-primary {
          background: var(--landing-primary-end);
          color: #ffffff;
        }

        .btn-primary:hover {
          background: #b45309;
        }

        .header-cta {
          padding: 10px 22px;
          font-size: 0.88rem;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          padding: 8px;
          z-index: 1001;
          background: none;
          border: none;
          cursor: pointer;
        }

        .hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--landing-text-heading);
          border-radius: 2px;
          transition: all 0.3s;
        }

        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        .mobile-nav {
          display: none;
          position: fixed;
          top: var(--landing-header-height);
          left: 0;
          right: 0;
          bottom: 0;
          background: #ffffff;
          z-index: 999;
          flex-direction: column;
          padding: 24px;
          gap: 4px;
          overflow-y: auto;
        }

        .mobile-nav.open {
          display: flex;
        }

        .mobile-nav a {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--landing-text-heading);
          padding: 14px 0;
          border-bottom: 1px solid var(--landing-border-light);
          text-decoration: none;
        }

        .mobile-login {
          margin-top: 16px;
          justify-content: center;
          width: 100%;
          padding: 14px;
          font-size: 1rem;
          border: 1.5px solid var(--landing-border);
          color: var(--landing-text-heading);
          background: transparent;
        }

        .mobile-login:hover {
          border-color: var(--landing-primary-end);
          color: var(--landing-primary-end);
        }

        .mobile-cta {
          margin-top: 8px;
          justify-content: center;
          width: 100%;
          padding: 14px;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .nav-links,
          .header-actions {
            display: none;
          }

          .hamburger {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}
