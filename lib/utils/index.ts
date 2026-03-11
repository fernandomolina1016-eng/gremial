import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, pattern = "d 'de' MMMM 'de' yyyy") {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, pattern, { locale: es })
}

export function formatDateTime(date: string | Date) {
  return formatDate(date, "d 'de' MMMM yyyy, HH:mm")
}

export function truncate(text: string, max: number) {
  return text.length <= max ? text : text.slice(0, max).trimEnd() + '…'
}

export function getInitials(nombre: string, apellido: string) {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
}

export function getEstadoConfig(estado: string) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    'Recibida':    { label: 'Recibida',    color: 'text-blue-700',  bg: 'bg-blue-50' },
    'En Análisis': { label: 'En Análisis', color: 'text-amber-700', bg: 'bg-amber-50' },
    'Resuelta':    { label: 'Resuelta',    color: 'text-green-700', bg: 'bg-green-50' },
  }
  return map[estado] ?? { label: estado, color: 'text-gray-700', bg: 'bg-gray-50' }
}
