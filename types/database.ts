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
// IMPORTANTE: Los tipos Insert/Update deben ser tipos planos (sin joins opcionales).
// Supabase los usa internamente para validar los parámetros de .insert() y .update().

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: {
          id: string
          nombre: string
          apellido: string
          legajo: string
          dependencia: string
          celular: string
          email: string
          role?: UserRole
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          nombre?: string
          apellido?: string
          legajo?: string
          dependencia?: string
          celular?: string
          email?: string
          role?: UserRole
          activo?: boolean
          updated_at?: string
        }
      }
      comunicados: {
        Row: Comunicado
        Insert: {
          id?: string
          titulo: string
          resumen: string
          imagen_url?: string | null
          documento_url?: string | null
          documento_nombre?: string | null
          es_publico?: boolean
          publicado?: boolean
          autor_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          titulo?: string
          resumen?: string
          imagen_url?: string | null
          documento_url?: string | null
          documento_nombre?: string | null
          es_publico?: boolean
          publicado?: boolean
          autor_id?: string | null
          updated_at?: string
        }
      }
      eventos_calendario: {
        Row: EventoCalendario
        Insert: {
          id?: string
          titulo: string
          descripcion?: string | null
          fecha_inicio: string
          fecha_fin?: string | null
          lugar?: string | null
          color?: string
          autor_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          titulo?: string
          descripcion?: string | null
          fecha_inicio?: string
          fecha_fin?: string | null
          lugar?: string | null
          color?: string
          autor_id?: string | null
          updated_at?: string
        }
      }
      consultas: {
        Row: {
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
        Insert: {
          id?: string
          tipo?: ConsultaTipo
          asunto: string
          mensaje: string
          estado?: ConsultaEstado
          afiliado_id: string
          leida_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          tipo?: ConsultaTipo
          asunto?: string
          mensaje?: string
          estado?: ConsultaEstado
          afiliado_id?: string
          leida_admin?: boolean
          updated_at?: string
        }
      }
      respuestas_consultas: {
        Row: {
          id: string
          consulta_id: string
          admin_id: string
          mensaje: string
          created_at: string
        }
        Insert: {
          id?: string
          consulta_id: string
          admin_id: string
          mensaje: string
          created_at?: string
        }
        Update: {
          mensaje?: string
        }
      }
      institucional_secciones: {
        Row: InstitucionalSeccion
        Insert: {
          id?: string
          slug: string
          titulo: string
          contenido?: string
          orden?: number
          activo?: boolean
          updated_at?: string
        }
        Update: {
          slug?: string
          titulo?: string
          contenido?: string
          orden?: number
          activo?: boolean
          updated_at?: string
        }
      }
      autoridades: {
        Row: Autoridad
        Insert: {
          id?: string
          nombre: string
          cargo: string
          foto_url?: string | null
          orden?: number
          activo?: boolean
          created_at?: string
        }
        Update: {
          nombre?: string
          cargo?: string
          foto_url?: string | null
          orden?: number
          activo?: boolean
        }
      }
      documentos_legales: {
        Row: DocumentoLegal
        Insert: {
          id?: string
          titulo: string
          descripcion?: string | null
          archivo_url: string
          categoria?: DocumentoCategoria
          activo?: boolean
          created_at?: string
        }
        Update: {
          titulo?: string
          descripcion?: string | null
          archivo_url?: string
          categoria?: DocumentoCategoria
          activo?: boolean
        }
      }
      acuerdos: {
        Row: Acuerdo
        Insert: {
          id?: string
          titulo: string
          descripcion?: string | null
          archivo_url: string
          tipo?: AcuerdoTipo
          anio?: number | null
          activo?: boolean
          autor_id?: string | null
          created_at?: string
        }
        Update: {
          titulo?: string
          descripcion?: string | null
          archivo_url?: string
          tipo?: AcuerdoTipo
          anio?: number | null
          activo?: boolean
          autor_id?: string | null
        }
      }
      contacto: {
        Row: Contacto
        Insert: {
          id?: string
          direccion?: string | null
          telefono?: string | null
          email?: string | null
          horarios?: string | null
          mapa_embed?: string | null
          updated_at?: string
        }
        Update: {
          direccion?: string | null
          telefono?: string | null
          email?: string | null
          horarios?: string | null
          mapa_embed?: string | null
          updated_at?: string
        }
      }
    }
    Functions: {
      is_admin: { Args: Record<never, never>; Returns: boolean }
      is_authenticated: { Args: Record<never, never>; Returns: boolean }
      get_my_role: { Args: Record<never, never>; Returns: string }
    }
  }
}
