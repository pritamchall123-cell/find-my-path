import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';

const quotes = [
  { text: "The future belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "Choose a job you love, and you will never have to work a day in your life.", author: "Confucius" },
  { text: "Your career is your business. It's time for you to manage it as a CEO.", author: "Dorit Sasson" },
  { text: "Success is where preparation and opportunity meet.", author: "Bobby Unser" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
];

const audiences = [
  { emoji: '🎒', title: 'Class 10 Students', desc: "Choosing a stream feels huge. We help you explore broadly before deciding — no pressure, just clarity.", color: 'from-sky-400 to-blue-500' },
  { emoji: '📘', title: 'Class 12 Students', desc: "Picking a degree with the destination in mind, not just a subject you're okay at.", color: 'from-violet-400 to-purple-500' },
  { emoji: '🎓', title: 'College Students', desc: "Turn your degree into a real plan — skills, projects, and a roadmap to job-readiness.", color: 'from-fuchsia-400 to-pink-500' },
  { emoji: '💼', title: 'Fresh Graduates', desc: "Degree in hand, path unclear? See every government and private door it opens.", color: 'from-amber-400 to-orange-500' },
];

const steps = [
  { num: '01', title: 'Discover', desc: 'Take a structured assessment of your interests, aptitude, and preferences.' },
  { num: '02', title: 'Explore', desc: 'Browse 25+ careers across tech, business, design, science, and more.' },
  { num: '03', title: 'Understand', desc: 'See exactly why a career fits you — no mystery, no black box.' },
  { num: '04', title: 'Compare', desc: 'Weigh 2-3 careers side by side before committing to anything.' },
  { num: '05', title: 'Plan', desc: 'Get an AI-built roadmap from wherever you stand today to job-ready.' },
  { num: '06', title: 'Learn & Build', desc: 'Follow skill-building steps and real project ideas at every stage.' },
  { num: '07', title: 'Track', desc: 'Watch your readiness grow with a visual, skill-by-skill dashboard.' },
];

const roadmapTypes = [
  { emoji: '🧭', title: 'Stream → Degree → Skills', desc: "For Class 10 students: starts with Science/Commerce/Arts, then the right degree, then the skills roadmap." },
  { emoji: '🎯', title: 'Degree → Skills → Job-Ready', desc: "For Class 12 & college students: starts directly from your chosen degree and builds toward your target career." },
  { emoji: '🏛️', title: 'Government vs Private Paths', desc: "See both worlds from the same degree — competitive exams and eligibility vs. skills, projects, and interviews." },
  { emoji: '🔁', title: 'Switch & Re-plan Anytime', desc: "Change your target career and your roadmap rebuilds instantly — nothing is locked in forever." },
];

const futureCareers = [
  { emoji: '🤖', title: 'AI & Machine Learning', desc: 'From ML Engineer to AI Ethics roles — one of the fastest-growing fields in India and globally.' },
  { emoji: '🔐', title: 'Cybersecurity', desc: 'Every company online needs defenders — demand is outpacing supply year after year.' },
  { emoji: '☁️', title: 'Cloud & DevOps', desc: 'As businesses move to the cloud, engineers who can build and run that infrastructure are in constant demand.' },
  { emoji: '🧬', title: 'Biotech & Healthcare Tech', desc: 'Where medicine meets technology — genomics, health data, and medical devices.' },
  { emoji: '🌱', title: 'Sustainability & Green Tech', desc: 'Climate-focused engineering, renewable energy, and ESG roles are growing fast.' },
  { emoji: '🎮', title: 'Creator Economy & Digital Media', desc: 'Content, design, and digital marketing careers that didn\'t exist a decade ago.' },
];

function RevealSection({ children, className }) {
  const [ref, visible] = useScrollReveal();
  return (
    <section ref={ref} className={`reveal ${visible ? 'reveal-visible' : ''} ${className || ''}`}>
      {children}
    </section>
  );
}

function Home() {
  const [current, setCurrent] = useState(0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700 text-white px-8 py-28 text-center overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 -left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative z-10">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-sm font-semibold px-5 py-2 rounded-full mb-7 animate-float border border-white/20">
            🚀 Built for Class 10 to Fresh Graduates
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-5 leading-tight animate-fade-in-up delay-100 tracking-tight">
            Lost Between Your Skills
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-pink-300 to-white bg-clip-text text-transparent">
              and Your Future?
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
            FindMyPath turns confusion into a clear, step-by-step, AI-guided
            roadmap — from wherever you stand today to the career you're
            actually meant for.
          </p>
          <div className="flex gap-4 justify-center flex-wrap animate-fade-in-up delay-300">
            {token ? (
              <Link
                to="/dashboard"
                className="bg-white text-indigo-700 px-8 py-4 rounded-xl font-bold hover:bg-amber-50 transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-white text-indigo-700 px-8 py-4 rounded-xl font-bold hover:bg-amber-50 transition-all hover:scale-105 active:scale-95 shadow-xl"
                >
                  Get Started — It's Free
                </Link>
                <Link
                  to="/careers"
                  className="border-2 border-white/70 backdrop-blur-sm px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
                >
                  Explore Careers
                </Link>
                <Link
                  to="/institutions"
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
                >
                  Find Colleges Near You
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <RevealSection className="bg-white border-b px-8 py-10 relative -mt-1">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { num: '25+', label: 'Careers Mapped', icon: '🗂️' },
            { num: '7', label: 'Step Journey', icon: '🧭' },
            { num: '2', label: 'Sectors: Govt + Private', icon: '🏛️' },
            { num: '100%', label: 'Explainable Matches', icon: '✨' },
          ].map((s, i) => (
            <div key={i} className="transition-transform hover:scale-110 duration-200">
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                {s.num}
              </p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* Who It Helps */}
      <RevealSection className="px-8 py-20 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
          Wherever You Are, We Meet You There
        </h2>
        <p className="text-gray-600 text-center max-w-xl mx-auto mb-12">
          You don't need to have it figured out. The platform adapts to exactly where you stand.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((a, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all hover:-translate-y-2 duration-300"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center text-3xl shadow-md`}>
                {a.emoji}
              </div>
              <h3 className="font-bold text-lg mb-2">{a.title}</h3>
              <p className="text-gray-600 text-sm">{a.desc}</p>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* How It Works — Steps */}
      <RevealSection className="bg-gradient-to-b from-indigo-50 to-white px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            Your Journey, Step by Step
          </h2>
          <p className="text-gray-600 text-center max-w-xl mx-auto mb-12">
            No guesswork. Every step builds on the last, and you always know what's next.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:border-indigo-300 hover:shadow-lg transition-all hover:-translate-y-1 duration-300"
              >
                <span className="inline-block bg-gradient-to-br from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent font-extrabold text-2xl">
                  {s.num}
                </span>
                <h3 className="font-bold mt-2 mb-1">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Types of Roadmaps */}
      <RevealSection className="px-8 py-20 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
          Not One Roadmap — The Right One For You
        </h2>
        <p className="text-gray-600 text-center max-w-xl mx-auto mb-12">
          Your starting point changes everything. Here's how the roadmap adapts.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {roadmapTypes.map((r, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 hover:shadow-lg hover:border-indigo-200 transition-all hover:-translate-y-1 duration-300"
            >
              <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-indigo-100 to-fuchsia-100 flex items-center justify-center text-2xl">
                {r.emoji}
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{r.title}</h3>
                <p className="text-gray-600 text-sm">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* Future of Careers */}
      <RevealSection className="bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white px-8 py-20 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-violet-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            The Careers of Tomorrow, Today
          </h2>
          <p className="text-gray-300 text-center max-w-xl mx-auto mb-12">
            The job market is shifting fast. We help you see where it's heading — not just where it's been.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {futureCareers.map((f, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 p-5 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all hover:-translate-y-1 duration-300 backdrop-blur-sm"
              >
                <div className="text-3xl mb-2">{f.emoji}</div>
                <h3 className="font-bold mb-1">{f.title}</h3>
                <p className="text-gray-300 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Auto-sliding Quotes */}
      <RevealSection className="bg-white px-8 py-16">
        <div className="max-w-2xl mx-auto text-center relative min-h-[100px] flex flex-col items-center justify-center">
          <div className="text-4xl mb-3 opacity-20">❝</div>
          <p
            key={current}
            className="text-xl sm:text-2xl font-medium text-gray-800 italic animate-fade-in-up"
          >
            {quotes[current].text}
          </p>
          <p className="text-gray-500 mt-3">— {quotes[current].author}</p>
          <div className="flex gap-2 mt-6">
            {quotes.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 w-7' : 'bg-gray-300 w-2'
                }`}
                aria-label={`Go to quote ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Bottom CTA */}
      {!token && (
        <RevealSection className="relative bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700 text-white text-center px-8 py-16 overflow-hidden">
          <div className="absolute -top-10 left-10 w-56 h-56 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Your path is out there. Let's find it.
            </h2>
            <p className="text-white/85 mb-7">
              Free to start. Takes a few minutes. No wrong answers.
            </p>
            <Link
              to="/register"
              className="bg-white text-indigo-700 px-8 py-4 rounded-xl font-bold hover:bg-amber-50 inline-block transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              Create Your Free Account
            </Link>
          </div>
        </RevealSection>
      )}
    </div>
  );
}

export default Home;