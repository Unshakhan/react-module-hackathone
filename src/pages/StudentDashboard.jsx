import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { logoutStudent } from '../features/auth/authSlice'
import { fetchStudentLeaves } from '../features/leaves/leavesSlice'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'

export default function StudentDashboard() {
  const { student } = useSelector((state) => state.auth)
  const { list: leaves } = useSelector((state) => state.leaves)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [leaveForm, setLeaveForm] = useState({ reason: '', start_date: '', end_date: '' })
  const [leaveImg, setLeaveImg] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [admissions, setAdmissions] = useState([])

  useEffect(() => {
    if (student) {
      dispatch(fetchStudentLeaves(student.id))
      supabase.from('admissions').select('*, courses(name)').eq('student_id', student.id).then(({ data }) => setAdmissions(data || []))
    }
  }, [student, dispatch])

  const handleLeaveSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    let image_url = null
    if (leaveImg) {
      const fileName = `leave_${Date.now()}_${leaveImg.name}`
      const { data: uploadData } = await supabase.storage.from('leave-images').upload(fileName, leaveImg)
      if (uploadData) {
        const { data: urlData } = supabase.storage.from('leave-images').getPublicUrl(fileName)
        image_url = urlData.publicUrl
      }
    }
    const { error } = await supabase.from('leaves').insert({
      student_id: student.id, student_name: student.name,
      roll_number: student.roll_number, reason: leaveForm.reason,
      start_date: leaveForm.start_date, end_date: leaveForm.end_date, image_url
    })
    setSubmitting(false)
    if (error) return toast.error('Failed to submit leave')
    toast.success('Leave request submitted!')
    setLeaveForm({ reason: '', start_date: '', end_date: '' })
    setLeaveImg(null)
    dispatch(fetchStudentLeaves(student.id))
    setActiveTab('leaves')
  }

  const statusColor = (s) => s === 'Approved' ? 'bg-green-100 text-green-700' : s === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-gradient-to-r from-blue-900 to-green-800 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-black">Welcome, {student?.name || 'Student'}! 👋</h1>
          <p className="text-blue-200 mt-1">Roll No: {student?.roll_number} | CNIC: {student?.cnic}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-sm w-fit">
          {[['overview','📊 Overview'],['leaves','📋 My Leaves'],['apply-leave','➕ Apply Leave'],['admissions','🎓 Admissions']].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${activeTab === tab ? 'bg-gradient-to-r from-blue-700 to-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-4">
            {[['Total Leaves',leaves.length,'📋'],['Approved',leaves.filter(l=>l.status==='Approved').length,'✅'],['Pending',leaves.filter(l=>l.status==='Pending').length,'⏳'],['Rejected',leaves.filter(l=>l.status==='Rejected').length,'❌'],['Applications',admissions.length,'🎓']].map(([label, val, icon]) => (
              <div key={label} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-3xl mb-2">{icon}</div>
                <div className="text-2xl font-black text-blue-900">{val}</div>
                <div className="text-gray-500 text-sm">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* My Leaves */}
        {activeTab === 'leaves' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-blue-900 text-lg">My Leave Requests</h2>
            </div>
            {leaves.length === 0 ? (
              <div className="py-12 text-center text-gray-400">No leave requests yet</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {leaves.map(leave => (
                  <div key={leave.id} className="p-5 flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{leave.reason}</p>
                      <p className="text-sm text-gray-500 mt-1">📅 {leave.start_date} to {leave.end_date}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor(leave.status)}`}>{leave.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Apply Leave */}
        {activeTab === 'apply-leave' && (
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-lg">
            <h2 className="font-bold text-blue-900 text-xl mb-6">Submit Leave Request</h2>
            <form onSubmit={handleLeaveSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Reason for Leave</label>
                <textarea required rows={3} value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describe your reason..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Start Date</label>
                  <input type="date" required value={leaveForm.start_date}
                    onChange={(e) => setLeaveForm({ ...leaveForm, start_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">End Date</label>
                  <input type="date" required value={leaveForm.end_date}
                    onChange={(e) => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Attachment (Optional)</label>
                <input type="file" accept="image/*" onChange={(e) => setLeaveImg(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm" />
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-blue-700 to-green-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition">
                {submitting ? 'Submitting...' : 'Submit Leave Request'}
              </button>
            </form>
          </div>
        )}

        {/* Admissions */}
        {activeTab === 'admissions' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-blue-900 text-lg">My Course Applications</h2>
            </div>
            {admissions.length === 0 ? (
              <div className="py-12 text-center text-gray-400">No applications yet</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {admissions.map(a => (
                  <div key={a.id} className="p-5 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{a.courses?.name}</p>
                      <p className="text-sm text-gray-500">Applied on {new Date(a.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor(a.status)}`}>{a.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}