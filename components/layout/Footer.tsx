import Link from 'next/link'
import { Train, MapPin, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#1a3a5c] text-white mt-auto">
      <div className="h-1 bg-[#c0392b]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-[#c0392b] rounded-lg flex items-center justify-center"><Train className="w-5 h-5 text-white" /></div>
              <div>
                <div className="font-bold text-lg" style={{fontFamily:'Playfair Display,serif'}}>Gremio Ferroviario</div>
                <div className="text-blue-300 text-xs uppercase tracking-wider">Portal Gremial</div>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed max-w-sm">Defendemos los derechos de los trabajadores ferroviarios. Unidos por un mejor futuro laboral.</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider text-blue-300 font-semibold mb-3">Navegación</h4>
            <ul className="space-y-2">
              {[['/', 'Inicio'],['/institucional','Institucional'],['/noticias','Noticias'],['/acuerdos','Acuerdos'],['/registro','Registrarse']].map(([href, label]) => (
                <li key={href}><Link href={href} className="text-sm text-blue-200 hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-xs text-blue-300">© {new Date().getFullYear()} Gremio Ferroviario. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
