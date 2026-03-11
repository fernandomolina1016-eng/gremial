import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: { default: 'Gremio Ferroviario', template: '%s | Gremio Ferroviario' },
  description: 'Portal oficial del Gremio Ferroviario.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1e293b', color: '#f8fafc', fontSize: '14px', borderRadius: '8px' },
        }} />
      </body>
    </html>
  )
}
