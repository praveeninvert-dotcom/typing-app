import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Retro Typing Test',
  description: 'A retro terminal-style typing speed test',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
