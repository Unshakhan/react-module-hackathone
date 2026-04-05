import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from '../features/courses/coursesSlice'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'

export default function Courses() {
  const dispatch = useDispatch()
  const { list: courses, loading } = useSelector((state) => state.courses)
  const { student } = useSelector((state) => state.auth)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [form, setForm] = useState({ student_name: '', cnic: '', phone: '', address: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { dispatch(fetchCourses()) }, [dispatch])

  const handleApply = async (e) => {
    e.preventDefault()
    if (!student) return toast.error('Please login first!')
    setSubmitting(true)
    const { error } = await supabase.from('admissions').insert({
      student_id: student.id, course_id: selectedCourse.id,
      student_name: form.student_name, cnic: form.cnic,
      phone: form.phone, address: form.address
    })
    setSubmitting(false)
    if (error) return toast.error('Already applied or error occurred')
    toast.success('Application submitted successfully!')
    setSelectedCourse(null)
    setForm({ student_name: '', cnic: '', phone: '', address: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-gradient-to-r from-blue-900 to-green-800 text-white py-12 text-center px-4">
        <h1 className="text-4xl font-black">Available Courses</h1>
        <p className="text-blue-200 mt-2">Choose your path — all courses are 100% free</p>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4">
        {loading ? (
          <div className="text-center py-20 text-blue-700 text-xl font-semibold">Loading courses...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1">
                <div className="bg-gradient-to-br from-blue-800 to-green-700 h-36 flex items-center justify-center">
                  <span className="text-white text-4xl">🎓</span>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-blue-900 text-lg leading-tight">{course.name}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${course.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {course.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-1">⏱ {course.duration}</p>
                  <p className="text-gray-500 text-sm mb-3">👨‍🏫 {course.instructor}</p>
                  <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                  <button
                    onClick={() => course.status === 'Open' && setSelectedCourse(course)}
                    disabled={course.status !== 'Open'}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition ${
                      course.status === 'Open'
                        ? 'bg-gradient-to-r from-blue-700 to-green-600 text-white hover:opacity-90'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {course.status === 'Open' ? 'Apply Now' : 'Admissions Closed'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="bg-gradient-to-r from-blue-800 to-green-700 text-white p-6 rounded-t-2xl">
              <h2 className="text-xl font-black">Apply for Course</h2>
              <p className="text-blue-200 text-sm mt-1">{selectedCourse.name}</p>
            </div>
            <form onSubmit={handleApply} className="p-6 space-y-4">
              {[['Full Name','student_name','text'],['CNIC (without dashes)','cnic','text'],['Phone Number','phone','tel'],['Address','address','text']].map(([label, key, type]) => (
                <div key={key}>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">{label}</label>
                  <input
                    type={type} required value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setSelectedCourse(null)} className="flex-1 border border-gray-300 py-2.5 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 bg-gradient-to-r from-blue-700 to-green-600 text-white py-2.5 rounded-xl font-bold hover:opacity-90 transition">
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}