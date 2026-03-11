import { cn } from '@/lib/utils'
import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, helperText, id, ...props }, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-[#1e293b]">
          {label}{props.required && <span className="text-[#c0392b] ml-1">*</span>}
        </label>
      )}
      <input ref={ref} id={inputId}
        className={cn(
          'w-full px-4 py-2.5 rounded-lg border text-sm transition-all bg-white text-[#1e293b] placeholder:text-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent',
          error ? 'border-red-400' : 'border-slate-200 hover:border-slate-300',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  )
})
Input.displayName = 'Input'
export { Input }
