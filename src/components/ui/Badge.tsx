import React, { HTMLAttributes } from 'react';

// ─── Badge Variants ─────────────────────────────────────────────────────────
// A single-source badge component for all pill/label patterns across the app.
// Replaces the 5+ scattered inline `text-sage bg-sage/10 rounded-full px-2.5`
// patterns — any color change now flows from one place.
//
// Usage:
//   <Badge variant="sage">Vedic</Badge>
//   <Badge variant="terracotta">Active</Badge>
//   <Badge variant="ghost">24 words</Badge>
//   <Badge variant="info">Info</Badge>
//   <Badge variant="sage" size="sm" caps>genre label</Badge>
// ────────────────────────────────────────────────────────────────────────────

type BadgeVariant = 'sage' | 'terracotta' | 'info' | 'ghost';
type BadgeSize   = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Color role of the badge */
  variant?: BadgeVariant;
  /** Size — sm matches the current xs tracking-wider caps labels, md is slightly larger */
  size?: BadgeSize;
  /** Whether to render uppercase + tracking-wider (genre/status labels) */
  caps?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  sage:       'text-sage       bg-sage/10       border-sage/20',
  terracotta: 'text-terracotta bg-terracotta/10 border-terracotta/20',
  info:       'text-dusty-blue bg-dusty-blue/10 border-dusty-blue/20',
  ghost:      'text-ghost      bg-deep          border-subtle',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-xs px-2.5 py-0.5',
  md: 'text-sm px-3    py-1',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'ghost',
      size    = 'sm',
      caps    = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const combined = [
      'inline-flex items-center font-bold rounded-full border w-fit leading-none',
      'transition-colors duration-200',
      variantStyles[variant],
      sizeStyles[size],
      caps ? 'uppercase tracking-wider' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span ref={ref} className={combined} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
