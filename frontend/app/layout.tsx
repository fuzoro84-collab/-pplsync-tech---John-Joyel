import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DAsh - Notes Taking App',
  description: 'Your space to think, write, and create',
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
