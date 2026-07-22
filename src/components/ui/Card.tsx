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
    const baseStyles = 'card card-bordered border-subtle rounded-xl';

    const variantStyles = {
      default:
        'bg-elevated shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)] text-primary',
      glass: 'bg-glass backdrop-blur-xl text-primary card-glass',
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
