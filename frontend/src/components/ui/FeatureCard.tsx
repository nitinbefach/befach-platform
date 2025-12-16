import Link from 'next/link';

interface FeatureCardProps {
  href?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText?: string;
  onClick?: () => void;
}

export default function FeatureCard({ href, icon, title, description, linkText = 'Learn More →', onClick }: FeatureCardProps) {
  const content = (
    <>
      <div className="feature-icon">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="feature-link">{linkText}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="feature-card">
        {content}
      </Link>
    );
  }

  return (
    <div className="feature-card" onClick={onClick}>
      {content}
    </div>
  );
}

