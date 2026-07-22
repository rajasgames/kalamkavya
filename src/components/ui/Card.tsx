import { HTMLAttributes, forwardRef } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  noPad?: boolean;
  hoverable?: boolean;
  variant?: 'default' | 'glass';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className = '', noPad = false, hoverable = false, variant = 'default', children, ...props },
    ref
  ) => {
    const baseStyles = 'border border-subtle rounded-xl overflow-hidden flex flex-col';

    const variantStyles = {
      default:
        'bg-surface shadow-soft text-primary',
      glass: 'bg-surface/80 backdrop-blur-xl text-primary border-white/20 dark:border-white/10',
    };

    const hoverStyles = hoverable
      ? 'hover:-translate-y-[2px] hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)] hover:border-amber-from/30 transition-all duration-200 ease-out cursor-pointer'
      : '';

    const padStyles = noPad ? '' : 'p-5';

    const combinedClassName = [baseStyles, variantStyles[variant], hoverStyles, padStyles, className]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
