import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useEffect, useState, useRef } from 'react'
import {
  FiUsers, FiBookOpen, FiAward, FiCheckCircle,
  FiArrowRight, FiArrowLeft, FiStar, FiClock,
  FiTrendingUp, FiShield, FiCode, FiMonitor,
  FiCamera, FiCpu
} from 'react-icons/fi'
import smitLogo from '../assets/smit-logo-removebg-preview.png'

const carouselImages = [
  {
    url: 'https://res.cloudinary.com/saylani-welfare/image/upload/v1654923364/website-images/dynamic/c6fdf6af-51d5-4388-97ef-6cf10eb73aca.jpg',
    title: 'World-Class IT Education',
    sub: 'Transforming lives through technology'
  },
  {
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZXxds1A64HmfpbQ9Y0KiX6ctiI9g_T2F0kQ&s',
    title: 'Learn From Industry Experts',
    sub: 'Hands-on training with real projects'
  },
  {
    url: 'https://res.cloudinary.com/saylani-welfare/image/upload/v1654923364/website-images/dynamic/c6fdf6af-51d5-4388-97ef-6cf10eb73aca.jpg',
    title: 'Build Your Future Today',
    sub: '100% free courses for deserving students'
  },
]

const typingWords = ['Web Development', 'AI & Machine Learning', 'Cybersecurity', 'Graphic Design', 'Mobile Apps']

const courses = [
  { icon: <FiCode size={28} />, name: 'Web & Mobile Dev', duration: '6 Months', color: 'from-blue-500 to-blue-700' },
  { icon: <FiCpu size={28} />, name: 'AI & Machine Learning', duration: '6 Months', color: 'from-green-500 to-green-700' },
  { icon: <FiCamera size={28} />, name: 'Graphic Design', duration: '3 Months', color: 'from-teal-500 to-teal-700' },
  { icon: <FiShield size={28} />, name: 'Cybersecurity', duration: '4 Months', color: 'from-indigo-500 to-indigo-700' },
]

const posts = [
  { id: 1, title: 'New Batch Starting Soon!', desc: 'SMIT is launching new batches for Web Dev, AI, and Cybersecurity. Apply Now!', date: 'April 1, 2025', img: 'https://www.thenews.com.pk/assets/uploads/akhbar/2024-03-18/1169366_4580855_ertieter_akhbar.jpg' },
  { id: 2, title: 'Free Courses for Youth', desc: 'Saylani Welfare Trust offering 100% free IT courses for deserving students across Pakistan.', date: 'March 28, 2025', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZXxds1A64HmfpbQ9Y0KiX6ctiI9g_T2F0kQ&s' },
  { id: 3, title: 'Graduation Ceremony 2025', desc: 'Congratulations to our batch 12 graduates! Join us for the ceremony at SMIT Karachi.', date: 'March 20, 2025', img: 'https://i.brecorder.com/primary/2025/11/6911454f0c670.jpg' },
]

export default function Home() {
  const [current, setCurrent] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [visible, setVisible] = useState({})
  const sectionRefs = useRef([])

  // Carousel auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % carouselImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Typing effect
  useEffect(() => {
    const word = typingWords[wordIndex]
    let timeout
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1500)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setWordIndex(prev => (prev + 1) % typingWords.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, wordIndex])

  // Scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setVisible(prev => ({ ...prev, [e.target.id]: true }))
      }),
      { threshold: 0.15 }
    )
    sectionRefs.current.forEach(ref => ref && observer.observe(ref))
    return () => observer.disconnect()
  }, [])

  const addRef = (el, id) => {
    if (el) { el.id = id; sectionRefs.current.push(el) }
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Navbar />

      {/* HERO CAROUSEL */}
      <div className="relative h-[92vh] overflow-hidden">
        {carouselImages.map((img, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
            <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/75 to-green-900/60" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4">
          <img src={smitLogo} alt="SMIT" className="w-24 h-24 rounded-full object-contain bg-white p-2 mb-6 shadow-2xl" />

          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/40 text-green-300 text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-widest backdrop-blur-sm">
            <FiStar size={12} /> Saylani Mass IT Training
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight max-w-4xl">
            Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300">{displayed}<span className="animate-pulse">|</span></span>
            <br />For Free
          </h1>

          <p className="text-blue-200 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
            Join <strong className="text-white">10,000+</strong> students transforming their careers with world-class IT education — completely free.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/student/login" className="group flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30">
              Student Login <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/student/signup" className="group flex items-center gap-2 bg-white text-blue-900 hover:bg-blue-50 font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
              Sign Up Free <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/courses" className="flex items-center gap-2 border-2 border-white/60 hover:border-white hover:bg-white/10 backdrop-blur-sm font-bold px-8 py-4 rounded-full transition-all duration-300">
              View Courses <FiBookOpen size={16} />
            </Link>
          </div>
        </div>

        {/* Carousel Controls */}
        <button onClick={() => setCurrent(p => (p - 1 + carouselImages.length) % carouselImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition">
          <FiArrowLeft size={20} />
        </button>
        <button onClick={() => setCurrent(p => (p + 1) % carouselImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition">
          <FiArrowRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {carouselImages.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-3 bg-green-400' : 'w-3 h-3 bg-white/40'}`} />
          ))}
        </div>
      </div>

      {/* STATS */}
      <div ref={el => addRef(el, 'stats')}
        className={`bg-white py-14 shadow-sm transition-all duration-700 ${visible['stats'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
          {[
            { icon: <FiUsers size={28} />, num: '10,000+', label: 'Students Enrolled', color: 'text-blue-600' },
            { icon: <FiBookOpen size={28} />, num: '25+', label: 'Courses Available', color: 'text-green-600' },
            { icon: <FiAward size={28} />, num: '50+', label: 'Expert Instructors', color: 'text-teal-600' },
            { icon: <FiCheckCircle size={28} />, num: '100%', label: 'Free Education', color: 'text-indigo-600' },
          ].map(({ icon, num, label, color }) => (
            <div key={label} className="group">
              <div className={`${color} flex justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>{icon}</div>
              <div className={`text-3xl font-black ${color}`}>{num}</div>
              <div className="text-gray-500 text-sm mt-1 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* COURSES SECTION */}
      <div ref={el => addRef(el, 'courses')}
        className={`py-16 px-4 bg-gradient-to-br from-blue-950 to-green-900 transition-all duration-700 ${visible['courses'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-green-400 text-sm font-bold uppercase tracking-widest">What We Offer</span>
            <h2 className="text-4xl font-black text-white mt-2">Popular Courses</h2>
            <p className="text-blue-300 mt-3">Industry-relevant skills taught by expert instructors</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {courses.map((c, i) => (
              <div key={i} className={`bg-gradient-to-br ${c.color} p-6 rounded-2xl text-white hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer group`}>
                <div className="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition">
                  {c.icon}
                </div>
                <h3 className="font-bold text-lg leading-tight">{c.name}</h3>
                <div className="flex items-center gap-1 mt-2 text-white/80 text-sm">
                  <FiClock size={13} /> {c.duration}
                </div>
                <div className="mt-4 text-xs font-bold bg-white/20 px-3 py-1 rounded-full inline-block">Free Enrollment</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/courses" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105">
              View All Courses <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {/* WHY SMIT */}
      <div ref={el => addRef(el, 'why')}
        className={`py-16 px-4 bg-white transition-all duration-700 ${visible['why'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-green-600 text-sm font-bold uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-4xl font-black text-blue-900 mt-2">Why SMIT?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <FiCheckCircle size={24} />, title: '100% Free', desc: 'No tuition fees, no hidden charges. Education for everyone regardless of financial status.', color: 'bg-green-50 text-green-600' },
              { icon: <FiTrendingUp size={24} />, title: 'Industry Relevant', desc: 'Curriculum designed with industry experts to ensure job-ready skills upon graduation.', color: 'bg-blue-50 text-blue-600' },
              { icon: <FiAward size={24} />, title: 'Certified', desc: 'Receive internationally recognized certificates upon successful course completion.', color: 'bg-teal-50 text-teal-600' },
              { icon: <FiUsers size={24} />, title: 'Expert Mentors', desc: 'Learn from seasoned professionals with years of real-world industry experience.', color: 'bg-indigo-50 text-indigo-600' },
              { icon: <FiMonitor size={24} />, title: 'Practical Training', desc: 'Hands-on projects and assignments that prepare you for real work environments.', color: 'bg-purple-50 text-purple-600' },
              { icon: <FiShield size={24} />, title: 'Job Placement', desc: 'Dedicated placement support to help graduates find their dream IT jobs.', color: 'bg-orange-50 text-orange-600' },
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-blue-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LATEST UPDATES / POSTS */}
      <div ref={el => addRef(el, 'posts')}
        className={`py-16 px-4 bg-gray-50 transition-all duration-700 ${visible['posts'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-green-600 text-sm font-bold uppercase tracking-widest">Stay Updated</span>
            <h2 className="text-4xl font-black text-blue-900 mt-2">Latest News</h2>
            <p className="text-gray-500 mt-2">From our official Facebook page</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="relative overflow-hidden h-48">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 text-xs text-green-600 font-semibold mb-2">
                    <FiClock size={12} /> {post.date}
                  </div>
                  <h3 className="font-bold text-blue-900 text-lg leading-tight mb-2">{post.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{post.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div ref={el => addRef(el, 'cta')}
        className={`relative py-20 px-4 overflow-hidden transition-all duration-700 ${visible['cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-green-800" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <FiAward size={48} className="mx-auto mb-4 text-green-400" />
          <h2 className="text-4xl md:text-5xl font-black mb-4">Ready to Transform Your Career?</h2>
          <p className="text-blue-200 text-lg mb-8 leading-relaxed">
            Join thousands of students who have already taken the first step towards a successful IT career — absolutely free.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/student/signup" className="group flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-10 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg text-lg">
              Get Started Free <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/courses" className="flex items-center gap-2 border-2 border-white/60 hover:bg-white/10 font-bold px-10 py-4 rounded-full transition-all duration-300 text-lg">
              Browse Courses <FiBookOpen size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-blue-950 text-blue-300 text-center py-6 text-sm">
  © 2025 SMIT Connect Portal — Saylani Welfare International Trust
</footer>
    </div>
  )
}