import React, { useState } from 'react';
import { ShieldCheck, UserRound, LogIn } from 'lucide-react';
import titanFitLogo from '../assets/titan-fit-logo.svg';

export default function LoginView({ onLogin, onRegister, plans = [] }) {
  const [loginRole, setLoginRole] = useState('admin');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [membershipPlanId, setMembershipPlanId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isRegistering && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setNotice('');

    try {
      if (isRegistering) {
        await onRegister({
          firstName,
          lastName,
          email,
          phone,
          password,
          membershipPlanId: membershipPlanId ? Number(membershipPlanId) : null,
        });
        setIsRegistering(false);
        setPassword('');
        setConfirmPassword('');
        setNotice('Account created. Your 2-day free trial starts now; sign in to continue.');
      } else {
        await onLogin({ email, password, role: loginRole });
      }
    } catch (loginError) {
      setError(loginError.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/30">
        <div className="grid md:grid-cols-2">
          <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-orange-500/15 via-slate-900 to-cyan-500/10 p-10">
            <div className="flex items-center gap-3">
              <img
                src={titanFitLogo}
                alt="Titan Fit logo"
                className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 object-cover shadow-lg shadow-orange-500/20"
              />
              <div>
                <div className="text-xl font-black tracking-wider text-white">
                  TITAN <span className="text-orange-400">FIT</span>
                </div>
                <div className="text-xs text-slate-400">Gym Management System</div>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Smart Fitness Access</p>
              <h1 className="mt-4 text-4xl font-black text-white leading-tight">
                Train better.
                <br />
                Track smarter.
              </h1>
              <p className="mt-4 text-sm text-slate-300">
                Separate admin controls and member workout tracking in one portal.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-300">
              <div className="font-semibold text-white mb-2">Demo accounts</div>
              <div className="space-y-2 text-xs">
                <div><span className="text-cyan-400">Admin:</span> admin@titanfit.com / admin123</div>
                <div><span className="text-emerald-400">Member:</span> use any member email / member123</div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-700 bg-slate-950/60 p-1.5" role="group" aria-label="Choose account type">
                <button
                  type="button"
                  aria-pressed={loginRole === 'admin'}
                  onClick={() => {
                    setLoginRole('admin');
                    setIsRegistering(false);
                    setEmail('');
                    setPassword('');
                    setError('');
                    setNotice('');
                  }}
                  className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition ${loginRole === 'admin' ? 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin Login
                </button>
                <button
                  type="button"
                  aria-pressed={loginRole === 'user'}
                  onClick={() => {
                    setLoginRole('user');
                    setIsRegistering(false);
                    setEmail('');
                    setPassword('');
                    setError('');
                    setNotice('');
                  }}
                  className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition ${loginRole === 'user' ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40' : 'text-slate-400 hover:text-white'}`}
                >
                  <UserRound className="h-4 w-4" />
                  Member Login
                </button>
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.2em] text-orange-400">
                {loginRole === 'admin' ? 'Admin Access' : isRegistering ? 'Member Registration' : 'Member Access'}
              </p>
              <h2 className="mt-2 text-3xl font-black text-white">
                {loginRole === 'admin' ? 'Admin sign in' : isRegistering ? 'Create account' : 'Member sign in'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegistering && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">First name</label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      maxLength={100}
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Last name</label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      maxLength={100}
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="email" className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  maxLength={150}
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                  placeholder={loginRole === 'admin' ? 'admin@titanfit.com' : 'your member email'}
                />
              </div>

              {isRegistering && (
                <>
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Phone number</label>
                    <input
                      id="phone"
                      type="tel"
                      maxLength={20}
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label htmlFor="membershipPlan" className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Membership plan</label>
                    <select
                      id="membershipPlan"
                      value={membershipPlanId}
                      onChange={(event) => setMembershipPlanId(event.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="">Choose later</option>
                      {plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="password" className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {isRegistering ? 'Create password' : 'Password'}
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={isRegistering ? 8 : undefined}
                  autoComplete={isRegistering ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              {isRegistering && (
                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Confirm password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                    placeholder="Re-enter your password"
                  />
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                  {error}
                </div>
              )}
              {notice && (
                <div role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                  {notice}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-amber-600 disabled:opacity-70"
              >
                <LogIn className="w-4 h-4" />
                {isSubmitting ? (isRegistering ? 'Creating account...' : 'Signing in...') : isRegistering ? 'Create member account' : `Sign in as ${loginRole === 'admin' ? 'Admin' : 'Member'}`}
              </button>
            </form>

            {loginRole === 'user' && (
              <div className="mt-5 text-center text-xs text-slate-400">
                {isRegistering ? 'Already registered?' : 'New member?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                    setNotice('');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  {isRegistering ? 'Sign in' : 'Create an account'}
                </button>
              </div>
            )}

            {!isRegistering && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setEmail(loginRole === 'admin' ? 'admin@titanfit.com' : 'alex.mercer@gmail.com');
                    setPassword(loginRole === 'admin' ? 'admin123' : 'member123');
                    setError('');
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-left text-sm text-slate-200 transition ${loginRole === 'admin' ? 'hover:border-cyan-500/60' : 'hover:border-emerald-500/60'}`}
                >
                  <span className="flex items-center gap-2">
                    {loginRole === 'admin' ? <ShieldCheck className="h-4 w-4 text-cyan-400" /> : <UserRound className="h-4 w-4 text-emerald-400" />}
                    Fill {loginRole === 'admin' ? 'admin' : 'member'} demo credentials
                  </span>
                  <span className="text-xs text-slate-400">Demo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
