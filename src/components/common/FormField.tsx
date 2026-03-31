'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'date' | 'select' | 'textarea';
  value: string | number;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  step?: string;
  min?: string;
  max?: string;
  className?: string;
  disabled?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      name,
      type = 'text',
      value,
      onChange,
      options,
      placeholder,
      required,
      error,
      step,
      min,
      max,
      className,
      disabled,
    },
    ref
  ) => {
    const inputId = `field-${name}`;

    return (
      <div className={cn('space-y-2', className)}>
        <Label htmlFor={inputId} className="text-base font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>

        {type === 'select' ? (
          <Select
            value={String(value)}
            onValueChange={onChange}
            disabled={disabled}
          >
            <SelectTrigger
              id={inputId}
              className={cn(
                'w-full h-12 text-base',
                error && 'border-red-500 focus:ring-red-500'
              )}
            >
              <SelectValue placeholder={placeholder || `Valitse ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-base">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : type === 'textarea' ? (
          <Textarea
            id={inputId}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'min-h-[100px] text-base',
              error && 'border-red-500 focus:ring-red-500'
            )}
          />
        ) : (
          <Input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            step={step}
            min={min}
            max={max}
            disabled={disabled}
            className={cn(
              'h-12 text-base',
              error && 'border-red-500 focus:ring-red-500'
            )}
          />
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
