'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, PageHeader, Badge, EmptyState, Spinner } from '@/components/ui'
import { formatDate, getInitials } from '@/lib/utils'
import { Shield, User, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function UsuariosPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [myId, setMyId] = useState('')
  const db = createClient() as any

  const load = async () => {
    setLoading(true)
    const { data } = await db.from('profiles').select('*').order('created_at', { ascending: false })
    setUsers(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    db.auth.getUser().then(({ data: { user } }: any) => { if (user) setMyId(user.id) })
  }, [])

  const filtered = users.filter(u => `${u.nombre} ${u.apellido} ${u.email} ${u.legajo}`.toLowerCase().includes(search.toLowerCase()))

  const toggleRole = async (u: any) => {
    if (u.id === myId) { toast.error('No podés cambiar tu propio rol'); return }
    const { error } = await db.from('profiles').update({ role: u.role === 'admin' ? 'afiliado' : 'admin' }).eq('id', u.id)
    if (error) toast.error('Error al cambiar rol')
    else { toast.success('Rol actualizado'); load() }
  }

  const toggleActivo = async (u: any) => {
    if (u.id === myId) { toast.error('No podés desactivar tu propia cuenta'); return }
    const { error } = await db.from('profiles').update({ activo: !u.activo }).eq('id', u.id)
    if (error) toast.error('Error al cambiar estado')
    else { toast.success(u.activo ? 'Usuario desactivado' : 'Usuario activado'); load() }
  }

  const deleteUser = async (u: any) => {
    if (u.id === myId) { toast.error('No podés eliminarte a vos mismo'); return }
    if (!confirm(`¿Eliminar a ${u.nombre} ${u.apellido}?`)) return
    const { error } = await db.from('profiles').delete().eq('id', u.id)
    if (error) toast.error('Error al eliminar')
    else { toast.success('Usuario eliminado'); load() }
  }

  return (
    <div>
      <PageHeader title="Usuarios" subtitle={`${users.length} registrados`}>
        <input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)}
          className="pl-4 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] w-64" />
      </PageHeader>
      <Card>
        {loading ? <Spinner /> : filtered.length === 0 ? <EmptyState icon="👥" title="Sin usuarios" /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Usuario','Legajo','Rol','Registrado','Acciones'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(u => (
                  <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${!u.activo ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#DBEAFE] rounded-full flex items-center justify-center text-[#1a3a5c] text-xs font-bold shrink-0">{getInitials(u.nombre, u.apellido)}</div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{u.nombre} {u.apellido}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-sm font-mono text-slate-700">{u.legajo}</span></td>
                    <td className="px-4 py-3">
                      <Badge variant={u.role === 'admin' ? 'danger' : 'info'}>
                        {u.role === 'admin' ? <><Shield className="w-3 h-3 mr-1" />Admin</> : <><User className="w-3 h-3 mr-1" />Afiliado</>}
                      </Badge>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs text-slate-500">{formatDate(u.created_at, 'dd/MM/yyyy')}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleRole(u)} disabled={u.id === myId} title="Cambiar rol" className="p-1.5 text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-30"><Shield className="w-4 h-4" /></button>
                        <button onClick={() => toggleActivo(u)} disabled={u.id === myId} title={u.activo ? 'Desactivar' : 'Activar'} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-30">{u.activo ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}</button>
                        <button onClick={() => deleteUser(u)} disabled={u.id === myId} title="Eliminar" className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"><Trash2 className="w-4 h-4" /></button>
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
