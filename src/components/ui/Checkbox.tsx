import React, { forwardRef } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';

export const Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={`peer h-5 w-5 shrink-0 rounded border border-subtle bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-from/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-amber-from data-[state=checked]:to-amber-to data-[state=checked]:border-transparent data-[state=indeterminate]:bg-gradient-to-r data-[state=indeterminate]:from-amber-from data-[state=indeterminate]:to-amber-to data-[state=indeterminate]:border-transparent transition-all duration-200 ${className}`}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-[#1A1814]">
      {props.checked === 'indeterminate' ? (
        <Minus className="h-4 w-4" />
      ) : (
        <Check className="h-4 w-4 stroke-[3]" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = 'Checkbox';
