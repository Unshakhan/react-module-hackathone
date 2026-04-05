import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import smitLogo from '../assets/smit-logo-removebg-preview.png'
<assets></assets>
import { logoutStudent } from '../features/auth/authSlice'
import { useState } from 'react'

export default function Navbar() {
  const { student } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logoutStudent())
    navigate('/')
  }

  return (
    <nav className="bg-gradient-to-r from-white via-blue-800 to-green-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          {/* <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-900 font-black text-sm">SMIT</span>
          </div> */}
          <img src={smitLogo} alt="SMIT Logo" className="w-10 h-10 rounded-full object-cover" />
          <span className="font-bold text-xl tracking-wide">SMIT Connect</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-green-300 transition">Home</Link>
          <Link to="/courses" className="hover:text-green-300 transition">Courses</Link>
          {student ? (
            <>
              <Link to="/student/dashboard" className="hover:text-green-300 transition">Dashboard</Link>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-full transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/student/login" className="hover:text-green-300 transition">Student Login</Link>
              <Link to="/admin/login" className="bg-green-500 hover:bg-green-600 px-4 py-1.5 rounded-full transition">Admin</Link>
            </>
          )}
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="text-2xl">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-blue-900 px-4 pb-4 flex flex-col gap-3 text-sm">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/courses" onClick={() => setMenuOpen(false)}>Courses</Link>
          {student ? (
            <>
              <Link to="/student/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="text-left text-red-400">Logout</button>
            </>
          ) : (
            <>
              <Link to="/student/login" onClick={() => setMenuOpen(false)}>Student Login</Link>
              <Link to="/admin/login" onClick={() => setMenuOpen(false)}>Admin Login</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}