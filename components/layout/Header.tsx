'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn, getInitials } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Menu, X, ChevronDown, Train, LogOut, User, LayoutDashboard } from 'lucide-react'
import type { Profile } from '@/types/database'

const NAV_PUBLIC = [
  { label: 'Inicio',        href: '/' },
  { label: 'Institucional', href: '/institucional' },
  { label: 'Noticias',      href: '/noticias' },
  { label: 'Acuerdos',      href: '/acuerdos' },
]

const NAV_AFILIADO = [
  { label: 'Comunicados',   href: '/comunicados-exclusivos' },
  { label: 'Calendario',    href: '/calendario' },
  { label: 'Mis Consultas', href: '/mis-consultas' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
    }
    getProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) setProfile(null)
      else getProfile()
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-[#1a3a5c] shadow-lg shadow-black/20'
        : 'bg-[#1a3a5c]/95 backdrop-blur-sm'
    )}>
      {/* Franja roja superior */}
      <div className="h-1 bg-[#c0392b]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-[#c0392b] rounded-lg flex items-center justify-center group-hover:bg-[#a93226] transition-colors">
              <Train className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-bold text-sm leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                Gremio Ferroviario
              </div>
              <div className="text-blue-200 text-[10px] uppercase tracking-wider">Portal Gremial</div>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_PUBLIC.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-white/10 text-white'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                )}
              >
                {item.label}
              </Link>
            ))}

            {profile && NAV_AFILIADO.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-white/10 text-white'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth area */}
          <div className="hidden lg:flex items-center gap-3">
            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#c0392b] rounded-full flex items-center justify-center text-xs font-bold">
                    {getInitials(profile.nombre, profile.apellido)}
                  </div>
                  <span className="text-sm font-medium">{profile.nombre}</span>
                  <ChevronDown className="w-4 h-4 text-blue-200" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Legajo {profile.legajo}</p>
                      <p className="text-sm font-semibold text-[#1a3a5c]">{profile.nombre} {profile.apellido}</p>
                    </div>
                    {profile.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Panel de administración
                      </Link>
                    )}
                    <Link
                      href="/perfil"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Mi perfil
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-blue-100 hover:text-white hover:bg-white/10">
                    Ingresar
                  </Button>
                </Link>
                <Link href="/registro">
                  <Button variant="secondary" size="sm">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-[#15304d] border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {NAV_PUBLIC.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(item.href) ? 'bg-white/10 text-white' : 'text-blue-100 hover:text-white hover:bg-white/10'
                )}
              >
                {item.label}
              </Link>
            ))}
            {profile && NAV_AFILIADO.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(item.href) ? 'bg-white/10 text-white' : 'text-blue-100 hover:text-white hover:bg-white/10'
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 flex gap-2">
              {profile ? (
                <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-red-300 px-3 py-2">
                  <LogOut className="w-4 h-4" /> Cerrar sesión
                </button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-white/30 text-white hover:bg-white hover:text-[#1a3a5c]">
                      Ingresar
                    </Button>
                  </Link>
                  <Link href="/registro" onClick={() => setOpen(false)} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">Registrarse</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
