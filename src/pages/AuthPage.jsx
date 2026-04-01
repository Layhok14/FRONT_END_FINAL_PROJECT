import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import BrandMark from '../Components/Patient/BrandMark'
import { readAppData,resetPasswordByLocalUser,loginUser,createUser } from '../data/dose_data'

const roleOptions = [
  { value: 'patient', label: 'Patient' },
  { value: 'caregiver', label: 'Caregiver' },
]

export default function AuthPage({ mode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [role, setRole] = useState('patient')
  const [message, setMessage] = useState('')
  const [showReset, setShowReset] = useState(false)
  const patients = useMemo(() => readAppData().users.filter((user) => user.role === 'patient'), [])

  const [loginValues, setLoginValues] = useState({ email: '', password: '' })
  const [signupValues, setSignupValues] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    acId: '',
    phone: '',
    address: '',
    linkedPatientId: patients[0]?.id || '',
  })
  const [resetValues, setResetValues] = useState({ email: '', newPassword: '' })

  const isLogin = mode === 'login'

  const handleLogin = (event) => {
    event.preventDefault()
    const result = loginUser({ ...loginValues, role })
    if (!result.ok) {
      setMessage(result.message)
      return
    }
    navigate(location.state?.from || '/app/home')
  }

  const handleSignup = (event) => {
    event.preventDefault()
    if (!signupValues.name || !signupValues.email || !signupValues.password) {
      setMessage('Name, email, and password are required.')
      return
    }
    const result = createUser({ ...signupValues, role })
    if (!result.ok) {
      setMessage(result.message)
      return
    }
    navigate('/app/home')
  }

  const handleReset = (event) => {
    event.preventDefault()
    const result = resetPasswordByLocalUser({ ...resetValues, role })
    setMessage(result.message)
    if (result.ok) {
      setShowReset(false)
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-[#f7fbfd] px-5 py-6 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[32px] border border-line bg-white p-8 shadow-[var(--shadow)] sm:p-10">
          <BrandMark />
          <p className="mt-8 font-medium text-primary-dark">Safe and simple access</p>
          <h1 className="mt-4 font-display text-4xl text-text-main">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-text-soft">
            {isLogin
              ? 'Sign in and continue to the tracking view right away.'
              : 'Register once and start using the same focused tracking experience.'}
          </p>
          <div className="mt-8 rounded-[24px] border border-line bg-surface-soft p-5">
            <div className="font-display text-lg font-semibold text-text-main">Demo access</div>
            <p className="mt-3 text-sm text-text-soft">Patient: tong@example.com / Patient123</p>
            <p className="mt-1 text-sm text-text-soft">Caregiver: dara@example.com / Caregiver123</p>
          </div>
        </section>

        <section className="rounded-[32px] border border-line bg-white p-8 shadow-[var(--shadow)] sm:p-10">
          <div className="mb-6 flex items-center gap-3 rounded-full bg-surface-soft p-1">
            <Link to="/login" className={`flex-1 rounded-full px-4 py-3 text-center text-sm font-semibold ${isLogin ? 'bg-primary text-white' : 'text-text-soft'}`}>
              Login
            </Link>
            <Link to="/signup" className={`flex-1 rounded-full px-4 py-3 text-center text-sm font-semibold ${!isLogin ? 'bg-primary text-white' : 'text-text-soft'}`}>
              Sign up
            </Link>
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            {roleOptions.map((option) => (
              <button key={option.value} type="button" onClick={() => setRole(option.value)} className={`rounded-full px-4 py-2 text-sm font-semibold ${role === option.value ? 'bg-primary text-white' : 'border border-line text-text-main'}`}>
                {option.label}
              </button>
            ))}
          </div>

          {message && <div className="mb-5 rounded-[18px] border border-line bg-surface-soft px-4 py-3 text-sm text-text-main">{message}</div>}

          {isLogin ? (
            showReset ? (
              <form className="space-y-4" onSubmit={handleReset}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-text-main">Email</span>
                  <input className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary" type="email" value={resetValues.email} onChange={(event) => setResetValues((current) => ({ ...current, email: event.target.value }))} placeholder="you@example.com" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-text-main">New password</span>
                  <input className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary" type="password" value={resetValues.newPassword} onChange={(event) => setResetValues((current) => ({ ...current, newPassword: event.target.value }))} placeholder="Enter new password" />
                </label>
                <button type="submit" className="w-full rounded-full bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark">Reset password</button>
                <button type="button" className="text-sm font-medium text-primary" onClick={() => setShowReset(false)}>Back to sign in</button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleLogin}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-text-main">Email</span>
                  <input className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary" type="email" value={loginValues.email} onChange={(event) => setLoginValues((current) => ({ ...current, email: event.target.value }))} placeholder="you@example.com" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-text-main">Password</span>
                  <input className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary" type="password" value={loginValues.password} onChange={(event) => setLoginValues((current) => ({ ...current, password: event.target.value }))} placeholder="Enter password" />
                </label>
                <button type="submit" className="w-full rounded-full bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark">Login</button>
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <button type="button" className="font-medium text-primary" onClick={() => setShowReset(true)}>Forgot password?</button>
                  <span className="text-text-soft">Don't have account? <Link to="/signup" className="font-semibold text-primary">Sign up</Link></span>
                </div>
              </form>
            )
          ) : (
            <form className="space-y-4" onSubmit={handleSignup}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text-main">Name</span>
                <input className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary" type="text" value={signupValues.name} onChange={(event) => setSignupValues((current) => ({ ...current, name: event.target.value }))} placeholder="Full name" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-text-main">Email</span>
                  <input className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary" type="email" value={signupValues.email} onChange={(event) => setSignupValues((current) => ({ ...current, email: event.target.value }))} placeholder="you@example.com" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-text-main">Password</span>
                  <input className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary" type="password" value={signupValues.password} onChange={(event) => setSignupValues((current) => ({ ...current, password: event.target.value }))} placeholder="Create password" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block"><span className="mb-2 block text-sm font-medium text-text-main">Age</span><input className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary" type="text" value={signupValues.age} onChange={(event) => setSignupValues((current) => ({ ...current, age: event.target.value }))} placeholder="Optional" /></label>
                <label className="block"><span className="mb-2 block text-sm font-medium text-text-main">Gender</span><input className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary" type="text" value={signupValues.gender} onChange={(event) => setSignupValues((current) => ({ ...current, gender: event.target.value }))} placeholder="Optional" /></label>
              </div>
              {role === 'caregiver' && (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-text-main">Linked patient</span>
                  <select className="w-full rounded-2xl border border-line px-4 py-3 outline-none focus:border-primary" value={signupValues.linkedPatientId} onChange={(event) => setSignupValues((current) => ({ ...current, linkedPatientId: event.target.value }))}>
                    {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}
                  </select>
                </label>
              )}
              <button type="submit" className="w-full rounded-full bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark">Create account</button>
              <div className="text-sm text-text-soft">Already has account? <Link to="/login" className="font-semibold text-primary">Sign in</Link></div>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}
