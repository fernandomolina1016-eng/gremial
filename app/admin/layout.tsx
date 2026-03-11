'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn, getInitials } from '@/lib/utils'
import { Train, LayoutDashboard, Users, FileText, Calendar, Inbox, BookOpen, Building2, LogOut, Menu } from 'lucide-react'

const NAV = [
  { label: 'Dashboard',     href: '/admin/dashboard',    icon: LayoutDashboard },
  { label: 'Usuarios',      href: '/admin/usuarios',      icon: Users },
  { label: 'Comunicados',   href: '/admin/comunicados',   icon: FileText },
  { label: 'Calendario',    href: '/admin/calendario',    icon: Calendar },
  { label: 'Bandeja',       href: '/admin/bandeja',       icon: Inbox, badge: true },
  { label: 'Acuerdos',      href: '/admin/acuerdos',      icon: BookOpen },
  { label: 'Institucional', href: '/admin/institucional', icon: Building2 },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<any>(null)
  const [pending, setPending] = useState(0)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const db = createClient() as any

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await db.auth.getUser()
      if (!user) return router.push('/login')
      const { data } = await db.from('profiles').select('*').eq('id', user.id).single()
      if (!data || data.role !== 'admin') return router.push('/')
      setProfile(data)
    }
    init()
    const loadPending = async () => {
      const { count } = await db.from('consultas').select('*', { count: 'exact', head: true }).eq('leida_admin', false)
      setPending(count ?? 0)
    }
    loadPending()
    const ch = db.channel('admin-consultas').on('postgres_changes', { event: '*', schema: 'public', table: 'consultas' }, loadPending).subscribe()
    return () => { db.removeChannel(ch) }
  }, [])

  const signOut = async () => { await db.auth.signOut(); router.push('/') }

  const Sidebar = () => (
    <aside className="bg-[#1a3a5c] flex flex-col h-full">
      <div className="h-1 bg-[#c0392b]" />
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/10">
        <div className="w-8 h-8 bg-[#c0392b] rounded-lg flex items-center justify-center"><Train className="w-4 h-4 text-white" /></div>
        <div>
          <div className="text-white text-sm font-bold" style={{fontFamily:'Playfair Display,serif'}}>Admin Panel</div>
          <div className="text-blue-300 text-[10px] uppercase tracking-wider">Gremio Ferroviario</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ label, href, icon: Icon, badge }) => (
          <Link key={href} href={href} onClick={() => setOpen(false)}
            className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all', pathname.startsWith(href) ? 'bg-white/15 text-white' : 'text-blue-200 hover:text-white hover:bg-white/10')}>
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{label}</span>
            {badge && pending > 0 && <span className="bg-[#c0392b] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{pending > 9 ? '9+' : pending}</span>}
          </Link>
        ))}
      </nav>
      {profile && (
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-8 h-8 bg-[#c0392b] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{getInitials(profile.nombre, profile.apellido)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{profile.nombre} {profile.apellido}</p>
              <p className="text-blue-300 text-[10px]">Administrador</p>
            </div>
            <button onClick={signOut} className="text-blue-300 hover:text-white transition-colors p-1"><LogOut className="w-4 h-4" /></button>
          </div>
          <Link href="/" className="block text-center text-[10px] text-blue-400 hover:text-blue-200 mt-1">← Ver sitio público</Link>
        </div>
      )}
    </aside>
  )

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <div className="hidden lg:block w-64 shrink-0 fixed left-0 top-0 bottom-0"><Sidebar /></div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 z-10"><Sidebar /></div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"><Menu className="w-5 h-5" /></button>
          <span className="text-sm font-semibold text-[#1a3a5c]">Admin Panel</span>
          {pending > 0 && <span className="ml-auto bg-[#c0392b] text-white text-xs font-bold rounded-full px-2 py-0.5">{pending}</span>}
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
