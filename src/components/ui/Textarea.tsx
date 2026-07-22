import { TextareaHTMLAttributes, forwardRef, useEffect, useRef } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  variant?: 'default' | 'prose';
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, variant = 'default', autoResize = false, onChange, ...props }, ref) => {
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    // Merge refs
    const setRefs = (element: HTMLTextAreaElement | null) => {
      innerRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    useEffect(() => {
      if (!autoResize || !innerRef.current) return;
      const el = innerRef.current;
      
      const handleResize = () => {
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
      };

      handleResize(); // initial
      
      const observer = new ResizeObserver(() => handleResize());
      observer.observe(el);
      
      el.addEventListener('input', handleResize);
      return () => {
        observer.disconnect();
        el.removeEventListener('input', handleResize);
      };
    }, [autoResize]);

    const baseStyles =
      'w-full text-primary font-sans transition-all duration-200 ease-out focus:outline-none min-h-[80px]';

    if (variant === 'prose') {
      return (
        <div className={`relative border-l-2 border-transparent focus-within:border-amber-from pl-3 transition-colors duration-200 ${className}`}>
          <textarea
            ref={setRefs}
            className={`w-full bg-transparent border-none outline-none focus:ring-0 text-primary font-sans ${autoResize ? 'resize-none overflow-hidden' : 'resize-y'}`}
            onChange={onChange}
            {...props}
          />
        </div>
      );
    }

    const defaultStyles =
      'bg-elevated border border-subtle rounded-xl px-4 py-2.5 outline-none focus:outline-none focus-visible:outline-none focus:ring-1 focus:ring-amber-from/50 focus:border-amber-from/80';
    const errorStyles = error ? 'border-clay focus:ring-clay/50 focus:border-clay' : '';
    const resizeStyles = autoResize ? 'resize-none overflow-hidden' : 'resize-y';

    const combinedClassName = [baseStyles, defaultStyles, resizeStyles, errorStyles, className]
      .filter(Boolean)
      .join(' ');

    return <textarea ref={setRefs} className={combinedClassName} onChange={onChange} {...props} />;
  }
);
Textarea.displayName = 'Textarea';
