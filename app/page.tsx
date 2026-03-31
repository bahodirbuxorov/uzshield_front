import { redirect } from 'next/navigation'

/**
 * Root page — immediately redirects to default locale dashboard.
 */
export default function RootPage() {
  redirect('/uz/dashboard')
}
