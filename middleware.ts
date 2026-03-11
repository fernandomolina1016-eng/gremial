import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

// Rutas que requieren autenticación (afiliado o admin)
const PROTECTED_ROUTES = [
  '/comunicados-exclusivos',
  '/calendario',
  '/mis-consultas',
  '/perfil',
]

// Rutas que requieren rol admin
const ADMIN_ROUTES = [
  '/admin',
]

// Rutas que no deben mostrarse si ya estás logueado
const AUTH_ROUTES = [
  '/login',
  '/registro',
]

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request)
  const pathname = request.nextUrl.pathname

  // ── Rutas de admin ────────────────────────────────────────
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL('/login?redirect=' + pathname, request.url))
    }

    // Verificar que sea admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, activo')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin' || !profile.activo) {
      return NextResponse.redirect(new URL('/?error=no_autorizado', request.url))
    }
  }

  // ── Rutas protegidas (afiliado) ───────────────────────────
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL('/login?redirect=' + pathname, request.url))
    }

    // Verificar que esté activo
    const { data: profile } = await supabase
      .from('profiles')
      .select('activo')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.activo) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/login?error=cuenta_inactiva', request.url))
    }
  }

  // ── Si ya está logueado, redirigir fuera de login/registro ─
  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    if (user) {
      // Verificar rol para redirigir al lugar correcto
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
      return NextResponse.redirect(new URL('/comunicados-exclusivos', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
