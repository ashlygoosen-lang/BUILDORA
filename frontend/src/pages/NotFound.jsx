import { Button, LogoMark } from '../components/brand'
import { usePageMeta } from '../lib/api'

export default function NotFound() {
  usePageMeta('Page not found')
  return (
    <main className="page-intro mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-8 py-20 text-center">
      <span className="mb-8 text-forest/40">
        <LogoMark size={44} />
      </span>
      <p className="text-[10px] font-semibold uppercase tracking-[2.1px] text-gold">404</p>
      <h1 className="font-heading mt-3 text-4xl font-semibold tracking-[-1.5px]">This plot is still empty.</h1>
      <p className="mt-4 text-sm leading-7 text-muted">The page you’re looking for doesn’t exist or has been moved.</p>
      <div className="mt-8">
        <Button href="/">Back to Home</Button>
      </div>
    </main>
  )
}
