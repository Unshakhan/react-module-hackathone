import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from '../../features/courses/coursesSlice'
import { supabase } from '../../lib/supabaseClient'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import smitLogo from '../../assets/smit-logo-removebg-preview.png'
import {
  FiBookOpen, FiPlus, FiEdit2, FiArrowLeft,
  FiCheckCircle, FiXCircle, FiClock, FiUser, FiSearch
} from 'react-icons/fi'

const emptyForm = { name: '', description: '', duration: '', instructor: '', status: 'Open' }

export default function AdminCourses() {
  const dispatch = useDispatch()
  const { list: courses, loading } = useSelector((state) => state.courses)
  const [modal, setModal] = useState(false)
  const [editCourse, setEditCourse] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    dispatch(fetchCourses())
    setTimeout(() => setVisible(true), 100)
  }, [dispatch])

  const openEdit = (course) => {
    setEditCourse(course)
    setForm({ name: course.name, description: course.description, duration: course.duration, instructor: course.instructor, status: course.status })
    setModal(true)
  }

  const openAdd = () => { setEditCourse(null); setForm(emptyForm); setModal(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    if (editCourse) {
      const { error } = await supabase.from('courses').update({ name: form.name, status: form.status }).eq('id', editCourse.id)
      if (error) toast.error('Error updating course')
      else toast.success('Course updated!')
    } else {
      const { error } = await supabase.from('courses').insert(form)
      if (error) toast.error('Error adding course')
      else toast.success('Course added!')
    }
    setSaving(false)
    setModal(false)
    dispatch(fetchCourses())
  }

  const filtered = courses.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
  const openCount = courses.filter(c => c.status === 'Open').length
  const closedCount = courses.filter(c => c.status === 'Closed').length

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
              <span className="font-black text-lg">Course Management</span>
              <div className="text-green-400 text-xs -mt-0.5">SMIT Connect Admin</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openAdd}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-105">
              <FiPlus size={16} /> Add Course
            </button>
            <Link to="/admin/dashboard"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition">
              <FiArrowLeft size={15} /> Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className={`max-w-6xl mx-auto px-4 py-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Courses', value: courses.length, icon: <FiBookOpen size={20} />, color: 'text-blue-700', bg: 'bg-blue-50' },
            { label: 'Open', value: openCount, icon: <FiCheckCircle size={20} />, color: 'text-green-700', bg: 'bg-green-50' },
            { label: 'Closed', value: closedCount, icon: <FiXCircle size={20} />, color: 'text-red-600', bg: 'bg-red-50' },
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
              <FiBookOpen size={18} /> All Courses ({courses.length})
            </h2>
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                  <tr>
                    {['Course Name', 'Duration', 'Instructor', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FiBookOpen size={15} className="text-white" />
                          </div>
                          <span className="font-semibold text-gray-800">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <FiClock size={13} className="text-green-600" /> {c.duration}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <FiUser size={13} className="text-blue-600" /> {c.instructor}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${c.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {c.status === 'Open' ? <FiCheckCircle size={11} /> : <FiXCircle size={11} />}
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => openEdit(c)}
                          className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                          <FiEdit2 size={12} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-16 text-center">
                  <FiBookOpen size={40} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400">No courses found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-800 to-green-700 text-white p-6">
              <h2 className="text-xl font-black flex items-center gap-2">
                {editCourse ? <FiEdit2 size={18} /> : <FiPlus size={18} />}
                {editCourse ? 'Edit Course' : 'Add New Course'}
              </h2>
              {editCourse && <p className="text-blue-200 text-sm mt-1">Only name and status can be updated</p>}
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Course Name</label>
                <input type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              {!editCourse && (
                <>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">Description</label>
                    <textarea rows={2} value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1.5">Duration</label>
                      <input type="text" value={form.duration} placeholder="e.g. 6 Months"
                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1.5">Instructor</label>
                      <input type="text" value={form.instructor} placeholder="Sir Name"
                        onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                </>
              )}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Course Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)}
                  className="flex-1 border border-gray-200 py-2.5 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-gradient-to-r from-blue-700 to-green-600 text-white py-2.5 rounded-xl font-bold hover:opacity-90 transition text-sm flex items-center justify-center gap-2">
                  {saving ? 'Saving...' : editCourse ? 'Update Course' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}