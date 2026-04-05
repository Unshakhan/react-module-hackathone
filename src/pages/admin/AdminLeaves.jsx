import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllLeaves } from '../../features/leaves/leavesSlice'
import { supabase } from '../../lib/supabaseClient'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import smitLogo from '../../assets/smit-logo-removebg-preview.png'
import {
  FiFileText, FiArrowLeft, FiCheckCircle, FiXCircle,
  FiClock, FiEye, FiSearch, FiCalendar, FiUser, FiAlertCircle
} from 'react-icons/fi'

export default function AdminLeaves() {
  const dispatch = useDispatch()
  const { allLeaves } = useSelector((state) => state.leaves)
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    dispatch(fetchAllLeaves())
    setTimeout(() => setVisible(true), 100)
  }, [dispatch])

  const handleStatus = async (status) => {
    setUpdating(true)
    await supabase.from('leaves').update({ status }).eq('id', selectedLeave.id)
    toast.success(`Leave ${status}!`)
    setUpdating(false)
    setSelectedLeave(null)
    dispatch(fetchAllLeaves())
  }

  const filtered = allLeaves.filter(l => {
    const matchSearch = l.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.roll_number?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || l.status === filter
    return matchSearch && matchFilter
  })

  const pending = allLeaves.filter(l => l.status === 'Pending').length
  const approved = allLeaves.filter(l => l.status === 'Approved').length
  const rejected = allLeaves.filter(l => l.status === 'Rejected').length

  const statusStyle = (s) => {
    if (s === 'Approved') return 'bg-green-100 text-green-700'
    if (s === 'Rejected') return 'bg-red-100 text-red-600'
    return 'bg-yellow-100 text-yellow-700'
  }

  const statusIcon = (s) => {
    if (s === 'Approved') return <FiCheckCircle size={11} />
    if (s === 'Rejected') return <FiXCircle size={11} />
    return <FiClock size={11} />
  }

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
              <span className="font-black text-lg">Leave Management</span>
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Requests', value: allLeaves.length, icon: <FiFileText size={20} />, color: 'text-blue-700', bg: 'bg-blue-50' },
            { label: 'Pending', value: pending, icon: <FiClock size={20} />, color: 'text-yellow-700', bg: 'bg-yellow-50' },
            { label: 'Approved', value: approved, icon: <FiCheckCircle size={20} />, color: 'text-green-700', bg: 'bg-green-50' },
            { label: 'Rejected', value: rejected, icon: <FiXCircle size={20} />, color: 'text-red-600', bg: 'bg-red-50' },
          ].map(({ label, value, icon, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl p-5 shadow-sm border border-white`}>
              <div className={`${color} mb-2`}>{icon}</div>
              <div className={`text-2xl font-black ${color}`}>{value}</div>
              <div className="text-gray-500 text-sm">{label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="font-bold text-blue-900 text-lg flex items-center gap-2">
              <FiFileText size={18} /> Leave Requests ({allLeaves.length})
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search student..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-48 pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-1">
                {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition ${filter === f ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                  {['Student', 'Roll No', 'Reason', 'Date Range', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(leave => (
                  <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {(leave.student_name || 'S')[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{leave.student_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 font-semibold text-xs">{leave.roll_number}</td>
                    <td className="px-5 py-4 text-gray-600 max-w-xs">
                      <p className="truncate">{leave.reason}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <FiCalendar size={12} className="text-blue-500" />
                        {leave.start_date} → {leave.end_date}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${statusStyle(leave.status)}`}>
                        {statusIcon(leave.status)} {leave.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => setSelectedLeave(leave)}
                        className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                        <FiEye size={12} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <FiFileText size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">No leave requests found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-800 to-green-700 text-white p-6">
              <h2 className="text-xl font-black flex items-center gap-2">
                <FiFileText size={18} /> Leave Request Details
              </h2>
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full mt-2 ${statusStyle(selectedLeave.status)}`}>
                {statusIcon(selectedLeave.status)} {selectedLeave.status}
              </span>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                    <FiUser size={11} /> Student
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">{selectedLeave.student_name}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                    <FiAlertCircle size={11} /> Roll Number
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">{selectedLeave.roll_number}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                  <FiCalendar size={11} /> Date Range
                </div>
                <p className="font-semibold text-gray-800 text-sm">{selectedLeave.start_date} → {selectedLeave.end_date}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
                  <FiFileText size={11} /> Reason
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{selectedLeave.reason}</p>
              </div>

              {selectedLeave.image_url && (
                <div>
                  <p className="text-gray-400 text-xs mb-2">Attachment</p>
                  <img src={selectedLeave.image_url} alt="attachment"
                    className="rounded-xl w-full max-h-48 object-cover border border-gray-100" />
                </div>
              )}

              {selectedLeave.status === 'Pending' && (
                <div className="flex gap-3">
                  <button onClick={() => handleStatus('Rejected')} disabled={updating}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition disabled:opacity-60">
                    <FiXCircle size={16} /> Reject
                  </button>
                  <button onClick={() => handleStatus('Approved')} disabled={updating}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition disabled:opacity-60">
                    <FiCheckCircle size={16} /> Approve
                  </button>
                </div>
              )}

              <button onClick={() => setSelectedLeave(null)}
                className="w-full border border-gray-200 py-2.5 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}