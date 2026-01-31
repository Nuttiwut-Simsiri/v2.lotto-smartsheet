import { Suspense } from 'react'
import { BottomNavBar } from '../components/bottom-navbar'
import './globals.css'
import { Itim, Mali } from 'next/font/google';

const itim = Itim({
  weight: ['400'],
  subsets: ['latin', 'thai'],
  display: 'swap',
  variable: '--font-playful',
});

const mali = Mali({
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ['latin', 'thai'],
  display: 'swap',
  variable: '--font-friendly',
});

export const metadata = {
  title: 'Lotto Smartsheet | Intelligent Lottery Management',
  description: 'A modern, clean, and easy-to-use lottery management sheet developed with Next.js.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" data-theme="dark" className={`${itim.variable} ${mali.variable} font-friendly`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground overflow-x-hidden">
        <div className="flex flex-col min-h-screen pb-24">
          {children}
        </div>
        <Suspense fallback={null}>
          <BottomNavBar />
        </Suspense>
      </body>
    </html>
  )
}

