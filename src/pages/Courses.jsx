import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from '../features/courses/coursesSlice'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'
import { FiClock, FiUser, FiCheckCircle, FiXCircle, FiArrowRight, FiBookOpen, FiSearch } from 'react-icons/fi'

// Real SMIT course images mapped by keywords
const getCourseImage = (name) => {
  const n = name.toLowerCase()
  if (n.includes('web') || n.includes('mern') || n.includes('mobile') || n.includes('app'))
    return 'https://idtpakistan.pk/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-17-at-11.52.21_e592aaa6-1024x670.jpg'
  if (n.includes('ai') || n.includes('machine') || n.includes('deep') || n.includes('python') || n.includes('learning'))
    return 'https://img.freepik.com/free-vector/isometric-neural-network-programmer-composition-with-isolated-icons-gear-brain-human-characters-computers-vector-illustration_1284-81062.jpg?semt=ais_hybrid&w=740&q=80'
  if (n.includes('graphic') || n.includes('design') || n.includes('ui') || n.includes('ux'))
    return 'https://safetytrainingcourses.com.pk/graphic%20designing.jpeg'
  if (n.includes('cyber') || n.includes('security') || n.includes('network'))
    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnKG_sQkfHBVv9ZaOOOL-MZnrd5xG1qfL0xA&s'
  if (n.includes('techno') || n.includes('kids') || n.includes('child'))
    return 'https://res.cloudinary.com/saylani-welfare/image/upload/v1764061749/SMIT/Courses/TKC.jpg'
  return 'https://idtpakistan.pk/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-17-at-11.52.21_e592aaa6-1024x670.jpg'
}

export default function Courses() {
  const dispatch = useDispatch()
  const { list: courses, loading } = useSelector((state) => state.courses)
  const { student } = useSelector((state) => state.auth)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [form, setForm] = useState({ student_name: '', cnic: '', phone: '', address: '' })
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => { dispatch(fetchCourses()) }, [dispatch])

  const filtered = courses.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || c.status === filter
    return matchSearch && matchFilter
  })

  const handleApply = async (e) => {
    e.preventDefault()
    if (!student) return toast.error('Please login first!')
    setSubmitting(true)
    const { error } = await supabase.from('admissions').insert({
      student_id: student.id,
      course_id: selectedCourse.id,
      student_name: form.student_name,
      cnic: form.cnic,
      phone: form.phone,
      address: form.address
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

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-green-800 text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-widest">
            <FiBookOpen size={12} /> 100% Free Courses
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">Available Courses</h1>
          <p className="text-blue-200 text-lg">Choose your path — transform your career with world-class IT skills</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Open', 'Closed'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${filter === f
                  ? 'bg-blue-800 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FiBookOpen size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No courses found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(course => (
              <div key={course.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.image_url || getCourseImage(course.name)}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://res.cloudinary.com/saylani-welfare/image/upload/v1764056998/SMIT/Courses/ITP.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {/* Status Badge on Image */}
                  <div className={`absolute top-3 right-3 flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${course.status === 'Open'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'}`}>
                    {course.status === 'Open'
                      ? <><FiCheckCircle size={11} /> Open</>
                      : <><FiXCircle size={11} /> Closed</>}
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-5">
                  <h3 className="font-black text-blue-900 text-lg leading-tight mb-3">{course.name}</h3>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <FiClock size={14} className="text-green-600" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <FiUser size={14} className="text-blue-600" />
                      <span>{course.instructor}</span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">{course.description}</p>

                  <button
                    onClick={() => course.status === 'Open' && setSelectedCourse(course)}
                    disabled={course.status !== 'Open'}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${course.status === 'Open'
                      ? 'bg-gradient-to-r from-blue-700 to-green-600 text-white hover:opacity-90 hover:scale-[1.02] shadow-md'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                    {course.status === 'Open'
                      ? <><span>Apply Now</span> <FiArrowRight size={15} /></>
                      : 'Admissions Closed'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results count */}
        {!loading && (
          <p className="text-gray-400 text-sm text-center mt-6">
            Showing {filtered.length} of {courses.length} courses
          </p>
        )}
      </div>

      {/* Apply Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease]">
            {/* Modal Header with course image */}
            <div className="relative h-32 overflow-hidden">
              <img
                src={getCourseImage(selectedCourse.name)}
                alt={selectedCourse.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-green-800/80 flex flex-col justify-end p-5">
                <h2 className="text-white font-black text-xl">Apply for Course</h2>
                <p className="text-green-300 text-sm">{selectedCourse.name}</p>
              </div>
            </div>

            <form onSubmit={handleApply} className="p-6 space-y-4">
              {[
                ['Full Name', 'student_name', 'text', 'Enter your full name'],
                ['CNIC (without dashes)', 'cnic', 'text', '4210112345671'],
                ['Phone Number', 'phone', 'tel', '03001234567'],
                ['Address', 'address', 'text', 'City, Province']
              ].map(([label, key, type, placeholder]) => (
                <div key={key}>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">{label}</label>
                  <input
                    type={type}
                    required
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setSelectedCourse(null)}
                  className="flex-1 border border-gray-200 py-3 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-blue-700 to-green-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2">
                  {submitting ? 'Submitting...' : <><span>Submit</span> <FiArrowRight size={15} /></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-blue-950 text-blue-300 text-center py-6 text-sm mt-8">
        © 2025 SMIT Connect Portal — Saylani Welfare International Trust
      </footer>
    </div>
  )
}