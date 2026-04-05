import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from '../../features/courses/coursesSlice'
import { supabase } from '../../lib/supabaseClient'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const emptyForm = { name: '', description: '', duration: '', instructor: '', status: 'Open' }

export default function AdminCourses() {
  const dispatch = useDispatch()
  const { list: courses, loading } = useSelector((state) => state.courses)
  const [modal, setModal] = useState(false)
  const [editCourse, setEditCourse] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => { dispatch(fetchCourses()) }, [dispatch])

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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-blue-950 to-green-900 text-white px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-lg">📚 Course Management</span>
        <div className="flex items-center gap-4">
          <button onClick={openAdd} className="bg-green-500 hover:bg-green-400 px-4 py-1.5 rounded-full text-sm font-bold transition">+ Add Course</button>
          <Link to="/admin/dashboard" className="text-sm text-blue-200 hover:text-white">← Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? <div className="text-center py-20 text-blue-700">Loading...</div> : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>{['Course Name','Duration','Instructor','Status','Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{c.name}</td>
                    <td className="px-5 py-3 text-gray-600">{c.duration}</td>
                    <td className="px-5 py-3 text-gray-600">{c.instructor}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${c.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{c.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => openEdit(c)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200 transition">✏️ Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="bg-gradient-to-r from-blue-800 to-green-700 text-white p-6 rounded-t-2xl">
              <h2 className="text-xl font-black">{editCourse ? 'Edit Course' : 'Add New Course'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Course Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {!editCourse && <>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Description</label>
                  <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Duration</label>
                  <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Instructor</label>
                  <input type="text" value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </>}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Course Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 border border-gray-300 py-2.5 rounded-xl text-gray-600 font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-blue-700 to-green-600 text-white py-2.5 rounded-xl font-bold hover:opacity-90">
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