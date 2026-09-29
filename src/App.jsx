import { useState } from 'react'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Recommend from './pages/Recommend.jsx'
import Search from './pages/Search.jsx'

export default function App() {
  const [page, setPage] = useState('home')

  const goTo = (p) => {
    setPage(p)
    window.scrollTo(0, 0)
  }

  return (
    <>
      <Nav page={page} goTo={goTo} />
      {page === 'home' && <Home goTo={goTo} />}
      {page === 'recommend' && <Recommend goTo={goTo} />}
      {page === 'search' && <Search goTo={goTo} />}
      <Footer />
    </>
  )
}
