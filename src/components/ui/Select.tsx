import React, { forwardRef } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  placeholder?: string;
  className?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  ({ placeholder = 'Select an option...', className = '', error, options, ...props }, ref) => {
    return (
      <SelectPrimitive.Root {...props}>
        <SelectPrimitive.Trigger
          ref={ref}
          className={`inline-flex items-center justify-between w-full bg-elevated border rounded-xl px-4 py-2.5 text-primary font-sans transition-all duration-200 ease-out outline-none focus:outline-none focus-visible:outline-none focus:ring-1 focus:ring-amber-from/50 focus:border-amber-from/80 ${
            error ? 'border-destructive focus:ring-destructive/50 focus:border-destructive' : 'border-subtle'
          } ${className}`}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="z-[100] overflow-hidden bg-elevated rounded-xl border border-subtle shadow-2xl backdrop-blur-xl"
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="p-1.5 max-h-80 overflow-y-auto scrollbar-hide">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex items-center px-8 py-2 text-sm font-medium text-primary rounded-lg cursor-pointer select-none outline-none focus:outline-none focus:bg-amber-from/15 focus:text-amber-from data-[disabled]:opacity-50 data-[disabled]:pointer-events-none transition-colors"
                >
                  <span className="absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center">
                    <SelectPrimitive.ItemIndicator>
                      <Check className="h-4 w-4 text-amber-from" />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  }
);
Select.displayName = 'Select';
