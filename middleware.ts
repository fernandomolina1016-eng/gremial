import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const ADMIN_ROUTES    = ['/admin']
const PROTECTED_ROUTES = ['/comunicados-exclusivos', '/calendario', '/mis-consultas', '/perfil']
const AUTH_ROUTES     = ['/login', '/registro']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request)
  const { pathname } = request.nextUrl

  if (ADMIN_ROUTES.some(r => pathname.startsWith(r))) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
    const { data: profile } = await (supabase as any).from('profiles').select('role,activo').eq('id', user.id).single()
    if (!profile || profile.role !== 'admin' || !profile.activo)
      return NextResponse.redirect(new URL('/', request.url))
  }

  if (PROTECTED_ROUTES.some(r => pathname.startsWith(r))) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
  }

  if (AUTH_ROUTES.some(r => pathname.startsWith(r))) {
    if (user) return NextResponse.redirect(new URL('/comunicados-exclusivos', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
