// Tipos generados a mano a partir del schema SQL.
// Para regenerarlos automáticamente: npx supabase gen types typescript --project-id TU_PROJECT_ID

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'afiliado' | 'admin'
export type ConsultaTipo = 'consulta' | 'sugerencia'
export type ConsultaEstado = 'Recibida' | 'En Análisis' | 'Resuelta'
export type AcuerdoTipo = 'convenio' | 'acuerdo_salarial'
export type DocumentoCategoria = 'estatuto' | 'reglamento' | 'otro'

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

export interface EventoCalendario {
  id: string
  titulo: string
  descripcion: string | null
  fecha_inicio: string
  fecha_fin: string | null
  lugar: string | null
  color: string
  autor_id: string | null
  created_at: string
  updated_at: string
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
  // joins
  afiliado?: Profile
  respuestas?: RespuestaConsulta[]
}

export interface RespuestaConsulta {
  id: string
  consulta_id: string
  admin_id: string
  mensaje: string
  created_at: string
  // joins
  admin?: Profile
}

export interface InstitucionalSeccion {
  id: string
  slug: string
  titulo: string
  contenido: string
  orden: number
  activo: boolean
  updated_at: string
}

export interface Autoridad {
  id: string
  nombre: string
  cargo: string
  foto_url: string | null
  orden: number
  activo: boolean
  created_at: string
}

export interface DocumentoLegal {
  id: string
  titulo: string
  descripcion: string | null
  archivo_url: string
  categoria: DocumentoCategoria
  activo: boolean
  created_at: string
}

export interface Acuerdo {
  id: string
  titulo: string
  descripcion: string | null
  archivo_url: string
  tipo: AcuerdoTipo
  anio: number | null
  activo: boolean
  autor_id: string | null
  created_at: string
}

export interface Contacto {
  id: string
  direccion: string | null
  telefono: string | null
  email: string | null
  horarios: string | null
  mapa_embed: string | null
  updated_at: string
}

// ── Supabase Database type (para el cliente tipado) ──────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      comunicados: {
        Row: Comunicado
        Insert: Omit<Comunicado, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Comunicado, 'id' | 'created_at'>>
      }
      eventos_calendario: {
        Row: EventoCalendario
        Insert: Omit<EventoCalendario, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<EventoCalendario, 'id' | 'created_at'>>
      }
      consultas: {
        Row: Consulta
        Insert: Omit<Consulta, 'id' | 'created_at' | 'updated_at' | 'afiliado' | 'respuestas'>
        Update: Partial<Omit<Consulta, 'id' | 'created_at' | 'afiliado' | 'respuestas'>>
      }
      respuestas_consultas: {
        Row: RespuestaConsulta
        Insert: Omit<RespuestaConsulta, 'id' | 'created_at' | 'admin'>
        Update: Partial<Omit<RespuestaConsulta, 'id' | 'created_at'>>
      }
      institucional_secciones: {
        Row: InstitucionalSeccion
        Insert: Omit<InstitucionalSeccion, 'id' | 'updated_at'>
        Update: Partial<Omit<InstitucionalSeccion, 'id'>>
      }
      autoridades: {
        Row: Autoridad
        Insert: Omit<Autoridad, 'id' | 'created_at'>
        Update: Partial<Omit<Autoridad, 'id' | 'created_at'>>
      }
      documentos_legales: {
        Row: DocumentoLegal
        Insert: Omit<DocumentoLegal, 'id' | 'created_at'>
        Update: Partial<Omit<DocumentoLegal, 'id' | 'created_at'>>
      }
      acuerdos: {
        Row: Acuerdo
        Insert: Omit<Acuerdo, 'id' | 'created_at'>
        Update: Partial<Omit<Acuerdo, 'id' | 'created_at'>>
      }
      contacto: {
        Row: Contacto
        Insert: Omit<Contacto, 'id' | 'updated_at'>
        Update: Partial<Omit<Contacto, 'id'>>
      }
    }
    Functions: {
      is_admin: { Args: Record<never, never>; Returns: boolean }
      is_authenticated: { Args: Record<never, never>; Returns: boolean }
      get_my_role: { Args: Record<never, never>; Returns: string }
    }
  }
}
