export type UserRole = 'afiliado' | 'admin'
export type ConsultaTipo = 'consulta' | 'sugerencia'
export type ConsultaEstado = 'Recibida' | 'En Análisis' | 'Resuelta'

export interface Profile {
  id: string
  nombre: string
  apellido: string
  legajo: string
  dependencia: string
  celular: string
  email: string
  role: UserRole
  activo: boolean
  created_at: string
  updated_at: string
}

export interface Comunicado {
  id: string
  titulo: string
  resumen: string
  imagen_url: string | null
  documento_url: string | null
  documento_nombre: string | null
  es_publico: boolean
  publicado: boolean
  autor_id: string | null
  created_at: string
  updated_at: string
}

export interface Evento {
  id: string
  titulo: string
  descripcion: string | null
  fecha_inicio: string
  fecha_fin: string | null
  lugar: string | null
  color: string
  autor_id: string | null
  created_at: string
}

export interface Consulta {
  id: string
  tipo: ConsultaTipo
  asunto: string
  mensaje: string
  estado: ConsultaEstado
  afiliado_id: string
  leida_admin: boolean
  created_at: string
  updated_at: string
}

export interface Respuesta {
  id: string
  consulta_id: string
  admin_id: string
  mensaje: string
  created_at: string
}

export interface Acuerdo {
  id: string
  titulo: string
  descripcion: string | null
  archivo_url: string
  tipo: 'convenio' | 'acuerdo_salarial'
  anio: number | null
  activo: boolean
  created_at: string
}
