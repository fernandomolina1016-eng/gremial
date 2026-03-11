import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

// ── Tailwind class merging ───────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Formateo de fechas en español ───────────────────────────
export function formatDate(date: string | Date, pattern = "d 'de' MMMM 'de' yyyy") {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, pattern, { locale: es })
}

export function formatDateShort(date: string | Date) {
  return formatDate(date, 'dd/MM/yyyy')
}

export function formatDateTime(date: string | Date) {
  return formatDate(date, "d 'de' MMMM yyyy, HH:mm")
}

// ── Storage URLs ─────────────────────────────────────────────
export function getPublicUrl(bucket: string, path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
}

// ── Truncar texto ────────────────────────────────────────────
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

// ── Iniciales de nombre ──────────────────────────────────────
export function getInitials(nombre: string, apellido: string): string {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
}

// ── Badge de estado de consulta ──────────────────────────────
export function getEstadoConfig(estado: string) {
  const configs: Record<string, { label: string; color: string; bg: string }> = {
    'Recibida':     { label: 'Recibida',     color: 'text-blue-700',  bg: 'bg-blue-50' },
    'En Análisis':  { label: 'En Análisis',  color: 'text-amber-700', bg: 'bg-amber-50' },
    'Resuelta':     { label: 'Resuelta',     color: 'text-green-700', bg: 'bg-green-50' },
  }
  return configs[estado] ?? { label: estado, color: 'text-gray-700', bg: 'bg-gray-50' }
}

// ── Tipo de archivo icon ─────────────────────────────────────
export function getFileIcon(filename: string | null): string {
  if (!filename) return '📎'
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return '📄'
  if (ext === 'docx' || ext === 'doc') return '📝'
  if (ext === 'xlsx' || ext === 'xls') return '📊'
  return '📎'
}
