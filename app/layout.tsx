import type { Metadata } from 'next'
import { Press_Start_2P, VT323 } from 'next/font/google'
import './globals.css'

// Press Start 2P is NOT a variable font — weight must be specified
const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
  display: 'swap',
})

// VT323 is NOT a variable font — weight must be specified
const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TYPING.EXE',
  description: 'A retro terminal typing speed test. 60 seconds. Three difficulty levels.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${pressStart2P.variable} ${vt323.variable}`}>
      <body>{children}</body>
    </html>
  )
}
