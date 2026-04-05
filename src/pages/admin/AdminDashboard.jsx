import { useSelector, useDispatch } from 'react-redux'
import { logoutAdmin } from '../../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import smitLogo from '../../assets/smit-logo-removebg-preview.png'
import {
  FiUsers, FiBookOpen, FiFileText, FiLogOut,
  FiUserPlus, FiGrid, FiChevronRight, FiShield,
  FiTrendingUp, FiAward, FiEye
} from 'react-icons/fi'

export default function AdminDashboard() {
  const { admin } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ students: 0, courses: 0, leaves: 0, admissions: 0 })
  const [newAdmin, setNewAdmin] = useState({ name: '', username: '', password: '' })
  const [addingAdmin, setAddingAdmin] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
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
    toast.success('New admin added successfully!')
    setNewAdmin({ name: '', username: '', password: '' })
  }

  const statCards = [
    { label: 'Total Students', value: stats.students, icon: <FiUsers size={22} />, color: 'from-blue-600 to-blue-700', bg: 'bg-blue-50', text: 'text-blue-700' },
    { label: 'Courses', value: stats.courses, icon: <FiBookOpen size={22} />, color: 'from-green-600 to-green-700', bg: 'bg-green-50', text: 'text-green-700' },
    { label: 'Leave Requests', value: stats.leaves, icon: <FiFileText size={22} />, color: 'from-teal-600 to-teal-700', bg: 'bg-teal-50', text: 'text-teal-700' },
    { label: 'Applications', value: stats.admissions, icon: <FiAward size={22} />, color: 'from-indigo-600 to-indigo-700', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  ]

  const navLinks = [
    { to: '/admin/students', icon: <FiUsers size={20} />, label: 'Manage Students', desc: 'Upload & view all students', color: 'from-blue-700 to-blue-800', hover: 'hover:from-blue-600 hover:to-blue-700' },
    { to: '/admin/courses', icon: <FiBookOpen size={20} />, label: 'Manage Courses', desc: 'Add, edit & update courses', color: 'from-green-700 to-green-800', hover: 'hover:from-green-600 hover:to-green-700' },
    { to: '/admin/leaves', icon: <FiFileText size={20} />, label: 'Manage Leaves', desc: 'Approve or reject requests', color: 'from-teal-700 to-teal-800', hover: 'hover:from-teal-600 hover:to-teal-700' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="bg-gradient-to-r from-blue-950 to-green-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden p-1">
              <img src={smitLogo} alt="SMIT" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-black text-lg text-white">SMIT Connect</span>
              <div className="text-green-400 text-xs font-medium -mt-0.5">Admin Panel</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
              <FiShield size={14} className="text-green-400" />
              <span className="text-white text-sm font-medium">{admin?.name}</span>
            </div>
            <button
              onClick={() => { dispatch(logoutAdmin()); navigate('/admin/login') }}
              className="flex items-center gap-2 bg-red-500/80 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200">
              <FiLogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className={`max-w-6xl mx-auto px-4 py-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-green-800 rounded-2xl p-6 mb-8 text-white relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '25px 25px' }} />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm font-semibold mb-1">Welcome back,</p>
              <h1 className="text-3xl font-black">{admin?.name} 👋</h1>
              <p className="text-blue-200 mt-1 text-sm">Here's what's happening with SMIT Connect today.</p>
            </div>
            <div className="hidden md:block">
              <img src={smitLogo} alt="SMIT" className="w-20 h-20 object-contain opacity-80" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon, color, bg, text }, i) => (
            <div key={label}
              style={{ transitionDelay: `${i * 100}ms` }}
              className={`${bg} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-white`}>
              <div className={`${text} mb-3`}>{icon}</div>
              <div className={`text-3xl font-black ${text}`}>{value}</div>
              <div className="text-gray-500 text-sm mt-1 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Quick Nav Cards */}
        <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
          <FiGrid size={18} /> Quick Actions
        </h2>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {navLinks.map(({ to, icon, label, desc, color, hover }) => (
            <Link key={to} to={to}
              className={`bg-gradient-to-br ${color} ${hover} text-white p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-xl group`}>
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition">
                {icon}
              </div>
              <h3 className="font-bold text-lg">{label}</h3>
              <p className="text-white/70 text-sm mt-1">{desc}</p>
              <div className="flex items-center gap-1 mt-4 text-white/80 text-sm font-semibold group-hover:gap-2 transition-all">
                <FiEye size={14} /> View <FiChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Add New Admin */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-900 to-green-800 px-6 py-4 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FiUserPlus size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">Add New Admin</h2>
              <p className="text-blue-200 text-xs">Grant admin access to a new user</p>
            </div>
          </div>
          <form onSubmit={handleAddAdmin} className="p-6">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {[
                ['Full Name', 'name', 'text', 'John Doe'],
                ['Username', 'username', 'text', 'johndoe'],
                ['Password', 'password', 'password', '••••••••']
              ].map(([label, key, type, placeholder]) => (
                <div key={key}>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">{label}</label>
                  <input
                    type={type}
                    required
                    placeholder={placeholder}
                    value={newAdmin[key]}
                    onChange={(e) => setNewAdmin({ ...newAdmin, [key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={addingAdmin}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-700 to-green-600 text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-[1.02] shadow-md disabled:opacity-60">
              <FiUserPlus size={16} />
              {addingAdmin ? 'Adding Admin...' : 'Add Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}