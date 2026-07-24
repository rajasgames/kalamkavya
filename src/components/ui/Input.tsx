import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  variant?: 'default' | 'prose';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, variant = 'default', ...props }, ref) => {
    const baseStyles =
      'w-full text-primary font-sans transition-all duration-200 ease-out focus:outline-none';

    if (variant === 'prose') {
      return (
        <div className={`relative border-l-2 border-transparent focus-within:border-amber-from pl-3 transition-colors duration-200 ${className}`}>
          <input
            ref={ref}
            className="w-full bg-transparent border-none outline-none focus:ring-0 text-primary font-sans"
            {...props}
          />
        </div>
      );
    }

    const defaultStyles =
      'bg-elevated border border-subtle rounded-xl px-4 py-2.5 outline-none focus:outline-none focus-visible:outline-none focus:ring-1 focus:ring-amber-from/50 focus:border-amber-from/80';
    const errorStyles = error ? 'border-destructive focus:ring-destructive/50 focus:border-destructive' : '';

    const combinedClassName = [baseStyles, defaultStyles, errorStyles, className]
      .filter(Boolean)
      .join(' ');

    return <input ref={ref} className={combinedClassName} {...props} />;
  }
);
Input.displayName = 'Input';
