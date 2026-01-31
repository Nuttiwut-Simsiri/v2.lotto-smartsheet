import { Suspense } from 'react'
import { BottomNavBar } from '../components/bottom-navbar'
import './globals.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Inter, Outfit } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
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
    <html lang="en" data-theme="dark" className={`${inter.variable} ${outfit.variable}`}>
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
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </body>
    </html>
  )
}

