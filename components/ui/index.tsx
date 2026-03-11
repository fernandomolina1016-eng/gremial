import { cn } from '@/lib/utils'

// ── Badge ────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-amber-50 text-amber-700',
    danger:  'bg-red-50 text-red-700',
    info:    'bg-blue-50 text-blue-700',
  }
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}

// ── Card ─────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div className={cn(
      'bg-white rounded-xl border border-slate-200 shadow-sm',
      hover && 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
      className
    )}>
      {children}
    </div>
  )
}

// ── PageHeader ───────────────────────────────────────────────
interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1a3a5c] font-display">{title}</h1>
        {subtitle && <p className="text-slate-500 mt-1 text-sm">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}

// ── EmptyState ───────────────────────────────────────────────
interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  children?: React.ReactNode
}

export function EmptyState({ icon = '📭', title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-sm">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}

// ── Spinner ──────────────────────────────────────────────────
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }
  return (
    <div className="flex items-center justify-center p-8">
      <svg className={cn('animate-spin text-[#1a3a5c]', sizes[size])} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  )
}

// ── Textarea ─────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-semibold text-[#1e293b]">
          {label}
          {props.required && <span className="text-[#c0392b] ml-1">*</span>}
        </label>
      )}
      <textarea
        className={cn(
          'w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-150 resize-none',
          'bg-white text-[#1e293b] placeholder:text-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent',
          error ? 'border-red-400' : 'border-slate-200 hover:border-slate-300',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

// ── Select ───────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-semibold text-[#1e293b]">
          {label}
          {props.required && <span className="text-[#c0392b] ml-1">*</span>}
        </label>
      )}
      <select
        className={cn(
          'w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-150',
          'bg-white text-[#1e293b]',
          'focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent',
          error ? 'border-red-400' : 'border-slate-200 hover:border-slate-300',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
