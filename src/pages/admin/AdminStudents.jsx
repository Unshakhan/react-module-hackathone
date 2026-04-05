import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import * as XLSX from 'xlsx'
import toast from 'react-hot-toast'
import smitLogo from '../../assets/smit-logo-removebg-preview.png'
import {
  FiUsers, FiUpload, FiArrowLeft, FiCheckCircle,
  FiClock, FiSearch, FiUserCheck, FiUserX
} from 'react-icons/fi'

export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [visible, setVisible] = useState(false)

  const fetchStudents = async () => {
    const { data } = await supabase.from('students').select('*').order('created_at', { ascending: false })
    setStudents(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchStudents()
    setTimeout(() => setVisible(true), 100)
  }, [])

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const workbook = XLSX.read(evt.target.result, { type: 'binary' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(sheet)
        let successCount = 0
        let skipCount = 0
        for (const r of rows) {
          const student = {
            name: String(r.name || r.Name || '').trim(),
            cnic: String(r.cnic || r.CNIC || '').trim(),
            roll_number: String(r.roll_number || r['Roll Number'] || r.RollNumber || '').trim(),
            password: 'pending'
          }
          if (!student.cnic || !student.roll_number) continue
          const { error } = await supabase.from('students').insert(student)
          if (error) skipCount++
          else successCount++
        }
        setUploading(false)
        toast.success(`${successCount} students added!${skipCount > 0 ? ` ${skipCount} skipped.` : ''}`)
        fetchStudents()
      } catch {
        setUploading(false)
        toast.error('Excel file mein problem hai')
      }
    }
    reader.readAsBinaryString(file)
  }

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.cnic?.includes(search) ||
    s.roll_number?.toLowerCase().includes(search.toLowerCase())
  )

  const registered = students.filter(s => s.password && s.password !== 'pending').length
  const pending = students.length - registered

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-950 to-green-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden p-1">
              <img src={smitLogo} alt="SMIT" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-black text-lg">Student Management</span>
              <div className="text-green-400 text-xs -mt-0.5">SMIT Connect Admin</div>
            </div>
          </div>
          <Link to="/admin/dashboard"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition">
            <FiArrowLeft size={15} /> Dashboard
          </Link>
        </div>
      </nav>

      <div className={`max-w-6xl mx-auto px-4 py-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Students', value: students.length, icon: <FiUsers size={20} />, color: 'text-blue-700', bg: 'bg-blue-50' },
            { label: 'Registered', value: registered, icon: <FiUserCheck size={20} />, color: 'text-green-700', bg: 'bg-green-50' },
            { label: 'Pending Signup', value: pending, icon: <FiUserX size={20} />, color: 'text-yellow-700', bg: 'bg-yellow-50' },
          ].map(({ label, value, icon, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl p-5 shadow-sm border border-white`}>
              <div className={`${color} mb-2`}>{icon}</div>
              <div className={`text-2xl font-black ${color}`}>{value}</div>
              <div className="text-gray-500 text-sm">{label}</div>
            </div>
          ))}
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 mb-6">
          <div className="bg-gradient-to-r from-blue-900 to-green-800 px-6 py-4 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FiUpload size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">Upload Students via Excel</h2>
              <p className="text-blue-200 text-xs">Excel columns required: <strong>name, cnic, roll_number</strong></p>
            </div>
          </div>
          <div className="p-6">
            <label className={`cursor-pointer inline-flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:scale-[1.02] shadow-md ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-700 to-green-600 hover:opacity-90'}`}>
              <FiUpload size={18} />
              {uploading ? 'Uploading...' : 'Choose Excel File'}
              <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcelUpload} disabled={uploading} />
            </label>
            <p className="text-gray-400 text-xs mt-3">Supported formats: .xlsx, .xls</p>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="font-bold text-blue-900 text-lg flex items-center gap-2">
              <FiUsers size={18} /> All Students ({students.length})
            </h2>
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                  <tr>
                    {['#', 'Name', 'CNIC', 'Roll Number', 'Status', 'Joined'].map(h => (
                      <th key={h} className="text-left px-5 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((s, i) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-gray-400 font-mono text-xs">{i + 1}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {(s.name || 'S')[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{s.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600 font-mono text-xs">{s.cnic}</td>
                      <td className="px-5 py-3 text-gray-600 font-semibold">{s.roll_number}</td>
                      <td className="px-5 py-3">
                        {s.password && s.password !== 'pending' ? (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                            <FiCheckCircle size={11} /> Registered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">
                            <FiClock size={11} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs">
                        {new Date(s.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-16 text-center">
                  <FiUsers size={40} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400">No students found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}