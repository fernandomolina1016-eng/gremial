import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function AfiliadoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-[65px] max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <Footer />
    </div>
  )
}
