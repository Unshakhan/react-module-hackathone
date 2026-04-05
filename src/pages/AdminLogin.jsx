import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginAdmin } from '../features/auth/authSlice'
import { supabase } from '../lib/supabaseClient'
import smitLogo from '../assets/smit-logo-removebg-preview.png'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [resetForm, setResetForm] = useState({ username: '', old_password: '', new_password: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.from('admins').select('*').eq('username', form.username).eq('password', form.password).single()
    setLoading(false)
    if (error || !data) return toast.error('Invalid credentials')
    dispatch(loginAdmin(data))
    toast.success('Admin logged in!')
    navigate('/admin/dashboard')
  }

  const handleReset = async (e) => {
    e.preventDefault()
    const { data } = await supabase.from('admins').select('*').eq('username', resetForm.username).eq('password', resetForm.old_password).single()
    if (!data) return toast.error('Invalid username or old password')
    await supabase.from('admins').update({ password: resetForm.new_password }).eq('id', data.id)
    toast.success('Password changed!')
    setResetMode(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-green-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-green-800 p-8 text-center text-white">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
            {/* <span className="text-blue-900 font-black text-lg">🔐</span> */}
            <img src={smitLogo} alt="SMIT Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-black">Admin Panel</h1>
          <p className="text-blue-200 text-sm mt-1">SMIT Connect Administration</p>
        </div>
        {!resetMode ? (
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Username</label>
              <input type="text" placeholder='admin' required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Password</label>
              <input type="password" placeholder='admin123' required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-800 to-green-700 text-white font-bold py-3 rounded-xl hover:opacity-90 transition">
              {loading ? 'Logging in...' : 'Admin Login'}
            </button>
            <button type="button" onClick={() => setResetMode(true)} className="w-full text-sm text-gray-500 hover:text-blue-700 transition">
              Forgot Password? Reset here
            </button>
            <p className="text-center text-sm"><Link to="/" className="text-gray-400 hover:text-gray-600">← Back to Home</Link></p>
          </form>
        ) : (
          <form onSubmit={handleReset} className="p-8 space-y-4">
            <h2 className="font-bold text-blue-900 text-lg">Reset Password</h2>
            {[['Username','username','text'],['Old Password','old_password','password'],['New Password','new_password','password']].map(([label,key,type]) => (
              <div key={key}>
                <label className="text-sm font-semibold text-gray-700 block mb-1">{label}</label>
                <input type={type} required value={resetForm[key]} onChange={(e) => setResetForm({ ...resetForm, [key]: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition">Change Password</button>
            <button type="button" onClick={() => setResetMode(false)} className="w-full text-sm text-gray-500 hover:text-blue-700">← Back to Login</button>
          </form>
        )}
      </div>
    </div>
  )
}