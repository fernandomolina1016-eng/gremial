import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center text-center p-8">
      <div className="text-7xl mb-4">🚂</div>
      <h1 className="text-4xl font-bold text-[#1a3a5c] mb-2">404</h1>
      <p className="text-slate-600 mb-6">Página no encontrada</p>
      <Link href="/" className="inline-flex items-center gap-2 bg-[#1a3a5c] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#15304d] transition-colors">
        Ir al inicio
      </Link>
    </div>
  )
}
