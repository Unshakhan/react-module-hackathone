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
          if (error) {
            skipCount++
          } else {
            successCount++
          }
        }

        setUploading(false)
        toast.success(`${successCount} students added! ${skipCount > 0 ? skipCount + ' skipped (already exist)' : ''}`)
        fetchStudents()
      } catch (err) {
        setUploading(false)
        toast.error('Excel file mein problem hai')
      }
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
          <h2 className="font-bold text-blue-900 text-lg mb-1">Upload Students via Excel</h2>
          <p className="text-sm text-gray-500 mb-4">
            Excel mein ye 3 columns honi chahiye: <strong>name</strong>, <strong>cnic</strong>, <strong>roll_number</strong>
          </p>
          <label className={`cursor-pointer inline-block px-6 py-3 rounded-xl font-bold text-white transition ${uploading ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-700 to-green-600 hover:opacity-90'}`}>
            {uploading ? '⏳ Uploading...' : '📤 Upload Excel File'}
            <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcelUpload} disabled={uploading} />
          </label>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-blue-900 text-lg">All Students ({students.length})</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    {['Name', 'CNIC', 'Roll Number', 'Status', 'Created'].map(h => (
                      <th key={h} className="text-left px-5 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">{s.name || 'N/A'}</td>
                      <td className="px-5 py-3 text-gray-600">{s.cnic}</td>
                      <td className="px-5 py-3 text-gray-600">{s.roll_number}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.password && s.password !== 'pending' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-600'}`}>
                          {s.password && s.password !== 'pending' ? '✅ Registered' : '⏳ Not Signed Up'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">{new Date(s.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {students.length === 0 && (
                <div className="py-12 text-center text-gray-400">No students yet. Upload an Excel file.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}