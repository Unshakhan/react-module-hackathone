import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllLeaves } from '../../features/leaves/leavesSlice'
import { supabase } from '../../lib/supabaseClient'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function AdminLeaves() {
  const dispatch = useDispatch()
  const { allLeaves } = useSelector((state) => state.leaves)
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => { dispatch(fetchAllLeaves()) }, [dispatch])

  const handleStatus = async (status) => {
    setUpdating(true)
    await supabase.from('leaves').update({ status }).eq('id', selectedLeave.id)
    toast.success(`Leave ${status}!`)
    setUpdating(false)
    setSelectedLeave(null)
    dispatch(fetchAllLeaves())
  }

  const statusColor = (s) => s === 'Approved' ? 'bg-green-100 text-green-700' : s === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-blue-950 to-green-900 text-white px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-lg">📋 Leave Management</span>
        <Link to="/admin/dashboard" className="text-sm text-blue-200 hover:text-white">← Dashboard</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-blue-900 text-lg">All Leave Requests ({allLeaves.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>{['Student','Roll No','Reason','Dates','Status','Action'].map(h => <th key={h} className="text-left px-5 py-3 font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allLeaves.map(leave => (
                  <tr key={leave.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{leave.student_name}</td>
                    <td className="px-5 py-3 text-gray-600">{leave.roll_number}</td>
                    <td className="px-5 py-3 text-gray-600 max-w-xs truncate">{leave.reason}</td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{leave.start_date} → {leave.end_date}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColor(leave.status)}`}>{leave.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => setSelectedLeave(leave)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200 transition">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {allLeaves.length === 0 && <div className="py-12 text-center text-gray-400">No leave requests yet</div>}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="bg-gradient-to-r from-blue-800 to-green-700 text-white p-6 rounded-t-2xl">
              <h2 className="text-xl font-black">Leave Request Details</h2>
              <span className={`text-xs font-bold px-2 py-1 rounded-full mt-2 inline-block ${statusColor(selectedLeave.status)}`}>{selectedLeave.status}</span>
            </div>
            <div className="p-6 space-y-3">
              <div><span className="text-sm text-gray-500 font-semibold">Student:</span> <span className="text-gray-800 font-medium">{selectedLeave.student_name}</span></div>
              <div><span className="text-sm text-gray-500 font-semibold">Roll No:</span> <span className="text-gray-800">{selectedLeave.roll_number}</span></div>
              <div><span className="text-sm text-gray-500 font-semibold">Dates:</span> <span className="text-gray-800">{selectedLeave.start_date} to {selectedLeave.end_date}</span></div>
              <div><span className="text-sm text-gray-500 font-semibold block mb-1">Reason:</span> <p className="text-gray-700 bg-gray-50 rounded-xl p-3 text-sm">{selectedLeave.reason}</p></div>
              {selectedLeave.image_url && (
                <div>
                  <span className="text-sm text-gray-500 font-semibold block mb-1">Attachment:</span>
                  <img src={selectedLeave.image_url} alt="Leave attachment" className="rounded-xl w-full max-h-48 object-cover" />
                </div>
              )}
              {selectedLeave.status === 'Pending' && (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleStatus('Rejected')} disabled={updating} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold hover:bg-red-600 transition">
                    ✕ Reject
                  </button>
                  <button onClick={() => handleStatus('Approved')} disabled={updating} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-bold hover:bg-green-700 transition">
                    ✓ Approve
                  </button>
                </div>
              )}
              <button onClick={() => setSelectedLeave(null)} className="w-full border border-gray-300 py-2.5 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}