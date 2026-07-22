import React, { ReactNode, ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      icon,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center transition-all duration-200 ease-out outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-from/50 cursor-pointer';

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
      md: 'px-4 py-2 text-sm font-semibold rounded-xl gap-2',
      lg: 'px-6 py-3 text-base font-bold rounded-xl gap-2.5',
    };

    // Variant styles
    const variantStyles = {
      primary:
        'bg-amber-from text-black font-bold border border-amber-from/40 shadow-[0_2px_8px_rgba(212,153,90,0.22)] hover:shadow-[0_4px_16px_rgba(212,153,90,0.35)] hover:bg-amber-from/90 active:scale-[0.98]',
      ghost:
        'text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-xl font-medium transition-colors',
      destructive:
        'text-clay hover:bg-clay/15 rounded-xl font-medium transition-colors',
    };

    // Disabled styles
    const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';

    // Combine classes
    const combinedClassName = [
      baseStyles,
      sizeStyles[size],
      variantStyles[variant],
      disabled || isLoading ? disabledStyles : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        className={combinedClassName}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <>
            {icon && <span className="inline-flex shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
