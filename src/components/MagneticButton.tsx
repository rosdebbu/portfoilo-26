import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  fillClassName?: string;
  strength?: number;
  textStrength?: number;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export function MagneticButton({
  children,
  className = '',
  fillClassName = 'bg-[#455CE9]',
  strength = 0.35,
  textStrength = 0.18,
  href,
  target,
  rel,
  onClick,
  ariaLabel,
}: MagneticButtonProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = outerRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);

    gsap.to(el, {
      x: relX * strength,
      y: relY * strength,
      duration: 0.45,
      ease: 'power3.out',
    });
    gsap.to(inner, {
      x: relX * textStrength,
      y: relY * textStrength,
      duration: 0.45,
      ease: 'power3.out',
    });
  };

  const handleLeave = () => {
    const el = outerRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.75, ease: 'elastic.out(1, 0.38)' });
    gsap.to(inner, { x: 0, y: 0, duration: 0.75, ease: 'elastic.out(1, 0.38)' });
  };

  const content = (
    <div
      ref={outerRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`magnetic-btn relative inline-flex cursor-pointer items-center justify-center overflow-hidden select-none ${className}`}
    >
      <span className={`magnetic-fill ${fillClassName}`} aria-hidden="true" />
      <span ref={innerRef} className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </div>
  );

  const wrapperClass = className.includes('w-full') ? 'block w-full sm:inline-block sm:w-auto' : 'inline-block';

  if (href) {
    return (
      <a href={href} target={target} rel={rel} aria-label={ariaLabel} onClick={onClick} className={wrapperClass}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className={`${wrapperClass} bg-transparent p-0 border-0`}>
      {content}
    </button>
  );
}
