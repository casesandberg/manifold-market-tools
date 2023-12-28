import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Layout } from '@/components/Layout'
import { DataProvider } from '@/components/DataProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Manifold Tools',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`flex min-h-full bg-[#F1F1F2] antialiased ${inter.className}`}>
        <DataProvider>
          <div className="w-full">
            <Layout>{children}</Layout>
          </div>
        </DataProvider>
      </body>
    </html>
  )
}
