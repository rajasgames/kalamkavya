import { ReactNode, forwardRef } from 'react';
import { Card, CardProps } from './Card';

export interface BentoBoxProps extends Omit<CardProps, 'variant' | 'title'> {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  variant?: 'default' | 'compact' | 'glass';
}

export const BentoBox = forwardRef<HTMLDivElement, BentoBoxProps>(
  ({ title, subtitle, icon, actions, variant = 'default', className = '', children, ...props }, ref) => {
    const isCompact = variant === 'compact';
    const cardVariant = variant === 'glass' ? 'glass' : 'default';

    return (
      <Card
        ref={ref}
        variant={cardVariant}
        noPad
        className={`flex flex-col h-full ${isCompact ? 'p-3' : 'p-5'} ${className}`}
        {...props}
      >
        <div className={`flex justify-between items-start ${children || actions ? 'mb-3' : ''}`}>
          <div>
            <h3
              className={`${
                isCompact ? 'text-[13px]' : 'text-[15px]'
              } font-serif font-semibold text-primary leading-tight`}
            >
              {title}
            </h3>
            {!isCompact && subtitle && <p className="text-sm text-secondary mt-1">{subtitle}</p>}
          </div>
          {icon && (
            <div className="flex-shrink-0 ml-3 text-secondary w-[20px] h-[20px] flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>

        {children && <div className="flex-1">{children}</div>}

        {actions && (
          <div className="flex flex-wrap items-center gap-2 pt-3 mt-auto border-t border-subtle">
            {actions}
          </div>
        )}
      </Card>
    );
  }
);

BentoBox.displayName = 'BentoBox';
