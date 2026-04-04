import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BrandMark from '../components/BrandMark'

const messages = [
  'Clear routines for patients, family members, and caregivers.',
  'See the next medicine step quickly and finish daily tracking with less effort.',
]

const featureBlocks = [
  {
    title: 'Main features',
    items: [
      'Shows the next medicine phase first so patients can act faster.',
      'Keeps the selected date and day section visible while reviewing progress.',
      'Stores sign in, password reset, and tracking data locally for easy demos.',
    ],
  },
  {
    title: 'What makes daily use easier',
    items: [
      'A focused home page that keeps tracking at the center of the screen.',
      'Medication details are easy to open, read, and review without extra steps.',
      'Caregiver updates and patient progress stay visible from one place.',
    ],
  },
]

const partnerLogos = ['CareLink', 'WellBridge', 'MediLoop', 'HealthSync', 'SeniorCircle', 'DoseTrack']

export default function LandingPage() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % messages.length)
    }, 3200)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#f7fbfd] text-text-main">
      <header className="border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">
          <BrandMark />
          <div className="flex items-center gap-3">
            <Link to="/login" className="rounded-full border border-line px-5 py-3 font-semibold text-text-main hover:border-primary hover:text-primary">Login</Link>
            <Link to="/signup" className="rounded-full bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark">Sign up</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <div className="rounded-[34px] border border-line bg-white p-8 shadow-[var(--shadow)] sm:p-10 lg:p-12">
            <p className="font-semibold text-primary-dark">Medication tracking for daily life</p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Help patients stay on schedule, help caregivers follow updates, and make medicine routines easier to finish at the right moment.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-text-soft">
              Built for home care, recovery, and everyday medication support when people need a fast view of what to take, when to take it, and what changed.
            </p>
            <div className="mt-5 min-h-[36px] overflow-hidden">
              <p key={messageIndex} className="animate-[fadeSlide_0.5s_ease] text-base font-medium text-primary">
                {messages[messageIndex]}
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className="rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark">Create account</Link>
              <Link to="/login" className="rounded-full border border-line px-6 py-3 font-semibold text-text-main hover:border-primary hover:text-primary">Sign in</Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:px-10 lg:pb-16">
          <div className="rounded-[34px] border border-line bg-white p-6 shadow-[var(--shadow)] sm:p-8">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-semibold">Preview</h2>
              <p className="mt-2 text-sm text-text-soft">A clear look at the patient home page, calendar, and tracking flow.</p>
            </div>
            <div className="rounded-[28px] border border-line bg-surface-soft p-4 sm:p-5">
              <div className="rounded-[24px] border border-line bg-white p-4 shadow-sm animate-[floatCard_4.8s_ease-in-out_infinite]">
                <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
                  <div className="text-lg font-semibold">Home</div>
                  <div className="flex gap-2 text-sm text-text-soft">
                    <span>Medications</span>
                    <span>History</span>
                    <span>Caregivers</span>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 lg:grid-cols-[1.45fr_0.95fr]">
                  <div className="rounded-[22px] border border-line bg-white p-4">
                    <div className="text-2xl font-semibold">Afternoon, Tong!</div>
                    <div className="mt-1 text-sm text-primary">Stay on track with the next medicine phase.</div>
                    <div className="mt-5 rounded-[20px] border border-line bg-surface-soft p-4">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-primary">Today, 11:00 AM</div>
                          <div className="mt-2 text-lg font-semibold">Before Meal 15 mins</div>
                        </div>
                        <div className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">Checkout</div>
                      </div>
                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        {[1, 2, 3].map((item) => <div key={item} className="h-36 rounded-[18px] border border-line bg-white" />)}
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <div className="rounded-[22px] border border-line bg-white p-4">
                      <div className="font-semibold">Weekly Overview</div>
                      <div className="mt-4 grid grid-cols-5 gap-2">
                        {[18, 19, 20, 21, 22].map((day, index) => (
                          <div key={day} className={`rounded-[16px] border px-2 py-3 text-center ${index === 2 ? 'border-primary bg-primary-soft text-primary-dark' : 'border-line bg-surface-soft text-text-main'}`}>
                            <div className="text-[11px] font-semibold">{['MON', 'TUE', 'WED', 'THU', 'FRI'][index]}</div>
                            <div className="mt-2 text-lg font-semibold">{day}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[22px] border border-line bg-white p-4">
                      <div className="font-semibold">Overview of the Day</div>
                      <div className="mt-3 space-y-3 text-sm">
                        {[['7:00 am', 'Taken'], ['11:00 am', 'Upcoming'], ['7:00 pm', 'Upcoming']].map(([time, status]) => (
                          <div key={time} className="grid grid-cols-[0.8fr_1fr_0.6fr] gap-3 rounded-[16px] border border-line px-3 py-3">
                            <span>{time}</span>
                            <span className="text-text-soft">{status}</span>
                            <span className="text-right font-semibold">-/5</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-12 sm:px-8 lg:grid-cols-2 lg:px-10 lg:pb-16">
          {featureBlocks.map((block) => (
            <section key={block.title} className="rounded-[30px] border border-line bg-white p-6 shadow-[var(--shadow)] sm:p-8">
              <h2 className="font-display text-2xl font-semibold">{block.title}</h2>
              <div className="mt-5 space-y-4">
                {block.items.map((item) => (
                  <div key={item} className="rounded-[20px] border border-line bg-surface-soft px-4 py-4 text-sm leading-7 text-text-soft">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:px-10 lg:pb-16">
          <div className="rounded-[30px] border border-line bg-white p-6 shadow-[var(--shadow)] sm:p-8">
            <div className="mb-5">
              <h2 className="font-display text-2xl font-semibold">Partnerships</h2>
              <p className="mt-2 text-sm text-text-soft">Connected with teams and organizations that support everyday care.</p>
            </div>
            <div className="overflow-hidden">
              <div className="flex w-max animate-[marquee_18s_linear_infinite] gap-4">
                {[...partnerLogos, ...partnerLogos].map((logo, index) => (
                  <div key={`${logo}-${index}`} className="min-w-[180px] rounded-[18px] border border-line bg-surface-soft px-6 py-5 text-center text-sm font-semibold text-text-main">
                    {logo}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:px-10 lg:pb-16">
          <div className="rounded-[34px] border border-line bg-white p-8 text-center shadow-[var(--shadow)] sm:p-10">
            <h2 className="font-display text-3xl font-semibold">Ready to start a clearer medication routine?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-text-soft">Create an account, sign in, and begin with a home page that keeps the next action easy to see.</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link to="/signup" className="rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark">Sign up now</Link>
              <Link to="/login" className="rounded-full border border-line px-6 py-3 font-semibold text-text-main hover:border-primary hover:text-primary">Go to login</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 text-sm text-text-soft sm:px-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-10">
          <div>
            <BrandMark />
            <p className="mt-4 max-w-sm leading-7">A calm medication tracker for patients and caregivers who need a faster way to see routines, updates, and daily progress.</p>
          </div>
          <div>
            <div className="font-semibold text-text-main">Terms</div>
            <div className="mt-4 space-y-3">
              <div>Privacy Policy</div>
              <div>Terms of Service</div>
              <div>Accessibility</div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-text-main">Associated links</div>
            <div className="mt-4 space-y-3">
              <div>Caregiver Resources</div>
              <div>Support Center</div>
              <div>Contact</div>
            </div>
          </div>
        </div>
      </footer>

      <style>{`@keyframes fadeSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } @keyframes floatCard { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } } @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  )
}
