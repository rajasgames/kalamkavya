import React, { ReactNode } from 'react';
import { Label } from './Label';

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  error,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      {React.isValidElement(children) 
        ? React.cloneElement(children as React.ReactElement, { id, error, 'aria-invalid': !!error }) 
        : children}
      {error && (
        <p className="text-xs text-destructive font-medium">{error}</p>
      )}
    </div>
  );
};
