import { useEffect } from 'react'
import { useLocation, useNavigationType, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { MotionScene, ScrollProgress, CursorRing, IntroLoader } from './components/motion'
import { ContentPage } from './components/PageContent'
import { TransitionProvider } from './lib/transition'
import Home from './pages/Home'
import Developments from './pages/Developments'
import DevelopmentDetail from './pages/DevelopmentDetail'
import NotFound from './pages/NotFound'
import Admin from './pages/Admin'
import Construction from './pages/Construction'
import Equipment from './pages/Equipment'
import Apply from './pages/Apply'

function Site() {
  const location = useLocation()
  const navType = useNavigationType()
  useEffect(() => {
    if (navType === 'POP') window.scrollTo(0, 0)
  }, [location.pathname, navType])
  return (
    <TransitionProvider>
      <IntroLoader />
      <ScrollProgress />
      <CursorRing />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <div id="main" tabIndex={-1}>
        <MotionScene key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/developments" element={<Developments />} />
            <Route path="/developments/:slug" element={<DevelopmentDetail />} />
            <Route path="/construction" element={<Construction />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/apply" element={<Apply />} />
            {['about', 'landowners', 'investors', 'how-it-works', 'impact', 'contact'].map((p) => (
              <Route key={p} path={`/${p}`} element={<ContentPage page={p} />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MotionScene>
      </div>
      <Footer />
    </TransitionProvider>
  )
}

export default function App() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/admin')) return <Admin />
  return <Site />
}
