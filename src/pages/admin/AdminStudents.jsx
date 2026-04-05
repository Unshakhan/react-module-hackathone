import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import * as XLSX from 'xlsx'
import toast from 'react-hot-toast'

export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const fetchStudents = async () => {
    const { data } = await supabase.from('students').select('*').order('created_at', { ascending: false })
    setStudents(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchStudents() }, [])

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: 'binary' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(sheet)
      // Expected columns: name, cnic, roll_number
      const toInsert = rows.map(r => ({ name: r.name || r.Name, cnic: String(r.cnic || r.CNIC), roll_number: String(r.roll_number || r['Roll Number'] || r.RollNumber), password: 'pending' }))
      const { error } = await supabase.from('students').upsert(toInsert, { onConflict: 'cnic' })
      setUploading(false)
      if (error) return toast.error('Error uploading: ' + error.message)
      toast.success(`${toInsert.length} students uploaded!`)
      fetchStudents()
    }
    reader.readAsBinaryString(file)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-blue-950 to-green-900 text-white px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-lg">👨‍🎓 Student Management</span>
        <Link to="/admin/dashboard" className="text-sm text-blue-200 hover:text-white">← Dashboard</Link>
      </nav>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-bold text-blue-900 text-lg mb-3">Upload Students via Excel</h2>
          <p className="text-sm text-gray-500 mb-4">Excel file should have columns: <strong>name, cnic, roll_number</strong></p>
          <label className="cursor-pointer inline-block bg-gradient-to-r from-blue-700 to-green-600 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition">
            {uploading ? 'Uploading...' : '📤 Upload Excel File'}
            <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcelUpload} />
          </label>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-blue-900 text-lg">All Students ({students.length})</h2>
          </div>
          {loading ? <div className="p-8 text-center text-gray-400">Loading...</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>{['Name','CNIC','Roll Number','Status','Created'].map(h => <th key={h} className="text-left px-5 py-3 font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">{s.name || 'N/A'}</td>
                      <td className="px-5 py-3 text-gray-600">{s.cnic}</td>
                      <td className="px-5 py-3 text-gray-600">{s.roll_number}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.password && s.password !== 'pending' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-600'}`}>
                          {s.password && s.password !== 'pending' ? 'Registered' : 'Not Signed Up'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">{new Date(s.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {students.length === 0 && <div className="py-12 text-center text-gray-400">No students yet. Upload an Excel file.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}