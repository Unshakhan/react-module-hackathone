import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginStudent } from '../features/auth/authSlice'
import { supabase } from '../lib/supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function StudentLogin() {
  const [form, setForm] = useState({ cnic: '', password: '' })
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.from('students').select('*').eq('cnic', form.cnic).eq('password', form.password).single()
    setLoading(false)
    if (error || !data) return toast.error('Invalid CNIC or Password')
    dispatch(loginStudent(data))
    toast.success('Welcome back, ' + data.name + '!')
    navigate('/student/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-800 to-green-700 p-8 text-center text-white">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-blue-800 font-black text-lg">SMIT</span>
          </div>
          <h1 className="text-2xl font-black">Student Login</h1>
          <p className="text-blue-200 text-sm mt-1">Access your SMIT Connect portal</p>
        </div>
        <form onSubmit={handleLogin} className="p-8 space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">CNIC Number</label>
            <input type="text" required placeholder="e.g. 4210112345671" value={form.cnic}
              onChange={(e) => setForm({ ...form, cnic: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Password</label>
            <input type="password" required placeholder="Your password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-700 to-green-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition">
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-center text-sm text-gray-500">
            Don't have an account? <Link to="/student/signup" className="text-blue-700 font-semibold">Sign Up</Link>
          </p>
          <p className="text-center text-sm text-gray-500">
            <Link to="/" className="text-gray-400 hover:text-gray-600">← Back to Home</Link>
          </p>
        </form>
      </div>
    </div>
  )
}