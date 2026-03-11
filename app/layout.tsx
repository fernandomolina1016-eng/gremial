import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'Gremio Ferroviario',
    template: '%s | Gremio Ferroviario',
  },
  description: 'Portal oficial del Gremio de Trabajadores Ferroviarios. Comunicados, acuerdos, calendario y más.',
  keywords: ['gremio', 'ferroviario', 'sindicato', 'trabajadores', 'trenes'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              fontFamily: 'Source Sans 3, sans-serif',
              fontSize: '14px',
              borderRadius: '8px',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#f8fafc' } },
            error:   { iconTheme: { primary: '#c0392b', secondary: '#f8fafc' } },
          }}
        />
      </body>
    </html>
  )
}
