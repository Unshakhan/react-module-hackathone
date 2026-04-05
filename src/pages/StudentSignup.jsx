import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function StudentSignup() {
  const [form, setForm] = useState({ cnic: '', roll_number: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    setLoading(true)
    // Check if student is pre-added by admin
    const { data: existing } = await supabase.from('students').select('*').eq('cnic', form.cnic).eq('roll_number', form.roll_number).single()
    if (!existing) {
      setLoading(false)
      return toast.error('You are not registered by admin. Contact SMIT office.')
    }
    if (existing.password && existing.password !== 'pending') {
      setLoading(false)
      return toast.error('Account already exists. Please login.')
    }
    const { error } = await supabase.from('students').update({ password: form.password }).eq('id', existing.id)
    setLoading(false)
    if (error) return toast.error('Error creating account')
    toast.success('Account created! Please login.')
    navigate('/student/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-800 to-green-700 p-8 text-center text-white">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-blue-800 font-black text-lg">SMIT</span>
          </div>
          <h1 className="text-2xl font-black">Student Sign Up</h1>
          <p className="text-blue-200 text-sm mt-1">Only admin-registered students can sign up</p>
        </div>
        <form onSubmit={handleSignup} className="p-8 space-y-4">
          {[['CNIC Number','cnic','text','4210112345671'],['Roll Number','roll_number','text','SMIT-001'],['Password','password','password',''],['Confirm Password','confirm','password','']].map(([label,key,type,ph]) => (
            <div key={key}>
              <label className="text-sm font-semibold text-gray-700 block mb-1">{label}</label>
              <input type={type} required placeholder={ph} value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-700 to-green-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have account? <Link to="/student/login" className="text-blue-700 font-semibold">Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}