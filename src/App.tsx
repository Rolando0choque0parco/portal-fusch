import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './components/pages/Home'
import Members from './components/pages/Members'
import Careers from './components/pages/Careers'
import Documents from './components/pages/Documents'
import Suggestions from './components/pages/Suggestions'
import Admin from './components/pages/Admin'
import Activities from './components/pages/Activities'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/members" element={<Members />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/activities" element={<Activities />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App