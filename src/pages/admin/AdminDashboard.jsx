import { useSelector, useDispatch } from 'react-redux'
import { logoutAdmin } from '../../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { admin } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ students: 0, courses: 0, leaves: 0, admissions: 0 })
  const [newAdmin, setNewAdmin] = useState({ name: '', username: '', password: '' })
  const [addingAdmin, setAddingAdmin] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      const [s, c, l, a] = await Promise.all([
        supabase.from('students').select('id', { count: 'exact', head: true }),
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('leaves').select('id', { count: 'exact', head: true }),
        supabase.from('admissions').select('id', { count: 'exact', head: true }),
      ])
      setStats({ students: s.count || 0, courses: c.count || 0, leaves: l.count || 0, admissions: a.count || 0 })
    }
    fetchStats()
  }, [])

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    setAddingAdmin(true)
    const { error } = await supabase.from('admins').insert(newAdmin)
    setAddingAdmin(false)
    if (error) return toast.error('Username already exists')
    toast.success('New admin added!')
    setNewAdmin({ name: '', username: '', password: '' })
  }

  const navLinks = [
    { to: '/admin/students', label: '👨‍🎓 Manage Students', color: 'from-blue-600 to-blue-700' },
    { to: '/admin/courses', label: '📚 Manage Courses', color: 'from-green-600 to-green-700' },
    { to: '/admin/leaves', label: '📋 Manage Leaves', color: 'from-teal-600 to-teal-700' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="bg-gradient-to-r from-blue-950 to-green-900 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-900 font-black text-xs">SMIT</span>
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-blue-200">👤 {admin?.name}</span>
          <button onClick={() => { dispatch(logoutAdmin()); navigate('/admin/login') }}
            className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-full transition">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-blue-900 mb-6">Dashboard Overview</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[['Students', stats.students, '👨‍🎓', 'bg-blue-50'],['Courses', stats.courses, '📚', 'bg-green-50'],['Leaves', stats.leaves, '📋', 'bg-teal-50'],['Applications', stats.admissions, '🎓', 'bg-indigo-50']].map(([label, val, icon, bg]) => (
            <div key={label} className={`${bg} rounded-2xl p-6 shadow-sm`}>
              <div className="text-3xl mb-2">{icon}</div>
              <div className="text-3xl font-black text-blue-900">{val}</div>
              <div className="text-gray-500 text-sm">{label}</div>
            </div>
          ))}
        </div>

        {/* Quick Nav */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {navLinks.map(({ to, label, color }) => (
            <Link key={to} to={to} className={`bg-gradient-to-r ${color} text-white p-6 rounded-2xl font-bold text-lg hover:opacity-90 transition transform hover:scale-105 shadow-md`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Add New Admin */}
        <div className="bg-white rounded-2xl shadow-sm p-6 max-w-lg">
          <h2 className="font-bold text-blue-900 text-lg mb-4">➕ Add New Admin</h2>
          <form onSubmit={handleAddAdmin} className="space-y-3">
            {[['Full Name','name','text'],['Username','username','text'],['Password','password','password']].map(([label,key,type]) => (
              <div key={key}>
                <label className="text-sm font-semibold text-gray-700 block mb-1">{label}</label>
                <input type={type} required value={newAdmin[key]} onChange={(e) => setNewAdmin({ ...newAdmin, [key]: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <button type="submit" disabled={addingAdmin} className="w-full bg-gradient-to-r from-blue-700 to-green-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition">
              {addingAdmin ? 'Adding...' : 'Add Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}