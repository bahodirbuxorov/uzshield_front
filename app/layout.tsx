import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | UzShield',
    default: 'UzShield — Cybersecurity Awareness Platform',
  },
  description:
    'UzShield helps Uzbek businesses train employees to recognize phishing attacks via simulated campaigns.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
