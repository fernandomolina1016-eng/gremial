'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn, getInitials } from '@/lib/utils'
import {
  Train, LayoutDashboard, Users, FileText, Calendar,
  Inbox, BookOpen, Building2, LogOut, Menu, X, Bell, ChevronRight
} from 'lucide-react'
import type { Profile } from '@/types/database'

const NAV = [
  { label: 'Dashboard',     href: '/admin/dashboard',   icon: LayoutDashboard },
  { label: 'Usuarios',      href: '/admin/usuarios',     icon: Users },
  { label: 'Comunicados',   href: '/admin/comunicados',  icon: FileText },
  { label: 'Calendario',    href: '/admin/calendario',   icon: Calendar },
  { label: 'Bandeja',       href: '/admin/bandeja',      icon: Inbox, badge: true },
  { label: 'Acuerdos',      href: '/admin/acuerdos',     icon: BookOpen },
  { label: 'Institucional', href: '/admin/institucional',icon: Building2 },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [pendingCount, setPendingCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!data || data.role !== 'admin') return router.push('/')
      setProfile(data)
    }
    init()

    // Realtime: contar consultas no leídas
    const loadPending = async () => {
      const { count } = await supabase
        .from('consultas')
        .select('*', { count: 'exact', head: true })
        .eq('leida_admin', false)
      setPendingCount(count ?? 0)
    }
    loadPending()

    const channel = supabase
      .channel('consultas-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'consultas' }, loadPending)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={cn(
      'bg-[#1a3a5c] flex flex-col',
      mobile ? 'w-full' : 'w-64 min-h-screen fixed left-0 top-0 bottom-0'
    )}>
      <div className="h-1 bg-[#c0392b]" />

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/10">
        <div className="w-8 h-8 bg-[#c0392b] rounded-lg flex items-center justify-center">
          <Train className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-white text-sm font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
            Admin Panel
          </div>
          <div className="text-blue-300 text-[10px] uppercase tracking-wider">Gremio Ferroviario</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ label, href, icon: Icon, badge }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              pathname.startsWith(href)
                ? 'bg-white/15 text-white'
                : 'text-blue-200 hover:text-white hover:bg-white/10'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{label}</span>
            {badge && pendingCount > 0 && (
              <span className="bg-[#c0392b] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}
            {pathname.startsWith(href) && <ChevronRight className="w-3.5 h-3.5 text-white/50" />}
          </Link>
        ))}
      </nav>

      {/* User */}
      {profile && (
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
            <div className="w-8 h-8 bg-[#c0392b] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
              {getInitials(profile.nombre, profile.apellido)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{profile.nombre} {profile.apellido}</p>
              <p className="text-blue-300 text-[10px]">Administrador</p>
            </div>
            <button onClick={handleSignOut} className="text-blue-300 hover:text-white transition-colors p-1">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <Link href="/" className="block text-center text-[10px] text-blue-400 hover:text-blue-200 transition-colors mt-1">
            ← Ver sitio público
          </Link>
        </div>
      )}
    </aside>
  )

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar desktop */}
      <div className="hidden lg:block w-64 shrink-0">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#1a3a5c] z-10">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar mobile */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-[#1a3a5c]">Admin Panel</span>
          {pendingCount > 0 && (
            <span className="ml-auto bg-[#c0392b] text-white text-xs font-bold rounded-full px-2 py-0.5">
              {pendingCount} pendiente{pendingCount > 1 ? 's' : ''}
            </span>
          )}
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
