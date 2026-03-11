'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, PageHeader, Badge, EmptyState, Spinner } from '@/components/ui'
import { formatDate, getInitials } from '@/lib/utils'
import { Search, Shield, User, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Profile } from '@/types/database'

export default function UsuariosPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const supabase = createClient()
  // Cast to any para evitar conflictos de tipos en mutaciones
  const db = supabase as any

  const loadUsers = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setUsers(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadUsers()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id)
    })
  }, [])

  const filtered = users.filter(u =>
    `${u.nombre} ${u.apellido} ${u.email} ${u.legajo}`.toLowerCase().includes(search.toLowerCase())
  )

  const toggleRole = async (user: Profile) => {
    if (user.id === currentUserId) {
      toast.error('No podés cambiar tu propio rol')
      return
    }
    const newRole = user.role === 'admin' ? 'afiliado' : 'admin'
    const { error } = await db
      .from('profiles')
      .update({ role: newRole })
      .eq('id', user.id)
    if (error) {
      toast.error('Error al cambiar rol')
    } else {
      toast.success(`Rol cambiado a ${newRole}`)
      loadUsers()
    }
  }

  const toggleActivo = async (user: Profile) => {
    if (user.id === currentUserId) {
      toast.error('No podés desactivar tu propia cuenta')
      return
    }
    const { error } = await db
      .from('profiles')
      .update({ activo: !user.activo })
      .eq('id', user.id)
    if (error) {
      toast.error('Error al cambiar estado')
    } else {
      toast.success(user.activo ? 'Usuario desactivado' : 'Usuario activado')
      loadUsers()
    }
  }

  const deleteUser = async (user: Profile) => {
    if (user.id === currentUserId) {
      toast.error('No podés eliminar tu propia cuenta')
      return
    }
    if (!confirm(`¿Eliminar a ${user.nombre} ${user.apellido}? Esta acción no se puede deshacer.`)) return
    const { error } = await db.from('profiles').delete().eq('id', user.id)
    if (error) {
      toast.error('Error al eliminar usuario')
    } else {
      toast.success('Usuario eliminado')
      loadUsers()
    }
  }

  return (
    <div>
      <PageHeader
        title="Gestión de usuarios"
        subtitle={`${users.length} usuarios registrados`}
      >
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o legajo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] w-72"
          />
        </div>
      </PageHeader>

      <Card>
        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <EmptyState icon="👥" title="Sin usuarios" description="No se encontraron usuarios con ese criterio" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Usuario</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Legajo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Dependencia</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rol</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Registrado</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(user => (
                  <tr key={user.id} className={`hover:bg-slate-50 transition-colors ${!user.activo ? 'opacity-50' : ''}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#DBEAFE] rounded-full flex items-center justify-center text-[#1a3a5c] text-xs font-bold shrink-0">
                          {getInitials(user.nombre, user.apellido)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{user.nombre} {user.apellido}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-slate-700 font-mono">{user.legajo}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-slate-600">{user.dependencia}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === 'admin' ? 'danger' : 'info'}>
                        {user.role === 'admin' ? (
                          <><Shield className="w-3 h-3 mr-1" />Admin</>
                        ) : (
                          <><User className="w-3 h-3 mr-1" />Afiliado</>
                        )}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-slate-500">{formatDate(user.created_at, 'dd/MM/yyyy')}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleRole(user)}
                          title={user.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                          className="p-1.5 text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
                          disabled={user.id === currentUserId}
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleActivo(user)}
                          title={user.activo ? 'Desactivar' : 'Activar'}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          disabled={user.id === currentUserId}
                        >
                          {user.activo
                            ? <ToggleRight className="w-4 h-4" />
                            : <ToggleLeft className="w-4 h-4" />
                          }
                        </button>
                        <button
                          onClick={() => deleteUser(user)}
                          title="Eliminar"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={user.id === currentUserId}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
