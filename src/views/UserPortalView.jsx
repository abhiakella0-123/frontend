import React, { useEffect, useState } from 'react';
import {
  User,
  CalendarCheck,
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  Clock3,
  IndianRupee,
  CheckCircle2,
  LoaderCircle,
  LogIn,
  LogOut,
} from 'lucide-react';
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const workoutClassKeywords = {
  Strength: /strength|weight|powerlifting|lifting|crossfit|muscle/i,
  Cardio: /cardio|hiit|metabolic|cycling|spinning|endurance|aerobic/i,
  Mobility: /mobility|yoga|flexibility|stretch|pilates|vinyasa|recovery/i,
  'Warm-up': /warm.?up|cardio|mobility|yoga|vinyasa|stretch/i,
};

function getClassesForWorkout(classes, workout) {
  const keywords = workoutClassKeywords[workout];
  if (!keywords) return [];
  return classes.filter((gymClass) => keywords.test(
    `${gymClass.className || ''} ${gymClass.description || ''}`,
  ));
}

function classRunsOnDay(gymClass, day) {
  return String(gymClass.daysOfWeek || '')
    .split(/[,\s]+/)
    .some((scheduledDay) => scheduledDay.slice(0, 3).toLowerCase() === day.slice(0, 3).toLowerCase());
}

function getCurrentWeekStart(date = new Date()) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const month = String(monday.getMonth() + 1).padStart(2, '0');
  const day = String(monday.getDate()).padStart(2, '0');
  return `${monday.getFullYear()}-${month}-${day}`;
}

function getDateForWeekDay(weekStart, dayIndex) {
  const date = new Date(`${weekStart}T00:00:00`);
  date.setDate(date.getDate() + dayIndex);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function getStoredWeeklyPlan(member) {
  try {
    return JSON.parse(member?.weeklyWorkoutPlan || 'null');
  } catch {
    return null;
  }
}

function allocateWorkoutSessions(sessions, classes, members, memberId, weekStart, additionalReservations = []) {
  const reservations = new Map();
  additionalReservations.forEach((session) => {
    if (session.classId != null) {
      const classId = String(session.classId);
      reservations.set(classId, (reservations.get(classId) || 0) + 1);
    }
  });
  members.forEach((member) => {
    if (String(member.id) === String(memberId)) return;
    const savedPlan = getStoredWeeklyPlan(member);
    if (savedPlan?.weekStart !== weekStart) return;
    (savedPlan.sessions || []).forEach((session) => {
      if (session.classId != null) {
        const classId = String(session.classId);
        reservations.set(classId, (reservations.get(classId) || 0) + 1);
      }
    });
  });

  return sessions.map((session) => {
    const candidates = getClassesForWorkout(classes, session.workout)
      .filter((gymClass) => classRunsOnDay(gymClass, session.day))
      .map((gymClass) => {
        const reserved = reservations.get(String(gymClass.id)) || 0;
        const enrolled = Number(gymClass.enrolledCount || 0);
        const capacity = Number(gymClass.capacity || 0);
        return { gymClass, reserved, enrolled, capacity, available: capacity - enrolled - reserved };
      })
      .sort((left, right) => right.available - left.available);
    const availableRoom = candidates.find((candidate) => candidate.available > 0);

    if (!availableRoom) {
      const suggestion = candidates[0]?.gymClass;
      return {
        ...session,
        status: candidates.length ? 'NO_ROOM' : 'NO_MATCH',
        classId: null,
        className: suggestion?.className || '',
        room: suggestion?.room || '',
        scheduleTime: suggestion?.scheduleTime || '',
      };
    }

    const classId = String(availableRoom.gymClass.id);
    reservations.set(classId, (reservations.get(classId) || 0) + 1);
    return {
      ...session,
      status: 'ASSIGNED',
      classId: availableRoom.gymClass.id,
      className: availableRoom.gymClass.className,
      room: availableRoom.gymClass.room,
      scheduleTime: availableRoom.gymClass.scheduleTime,
    };
  });
}

const workoutPlans = {
  Strength: [
    { exercise: 'Barbell Squat', sets: '4 x 8' },
    { exercise: 'Bench Press', sets: '4 x 6' },
    { exercise: 'Deadlift', sets: '3 x 5' },
    { exercise: 'Lat Pulldown', sets: '3 x 10' },
  ],
  Cardio: [
    { exercise: 'Brisk Walk', sets: '5 min warm-up' },
    { exercise: 'Cardio Intervals', sets: '8 x 1 min' },
    { exercise: 'Cycling', sets: '15 min' },
    { exercise: 'Easy Walk', sets: '5 min cool-down' },
  ],
  Mobility: [
    { exercise: 'Arm Circles', sets: '2 x 10' },
    { exercise: 'Hip Openers', sets: '2 x 8 each side' },
    { exercise: 'Thoracic Rotations', sets: '2 x 8 each side' },
    { exercise: 'Hamstring Stretch', sets: '2 x 30 sec' },
  ],
  'Warm-up': [
    { exercise: 'Easy Walk', sets: '3 min' },
    { exercise: 'Arm Circles', sets: '2 x 10' },
    { exercise: 'Bodyweight Squats', sets: '2 x 8' },
    { exercise: 'Hip Openers', sets: '2 x 8 each side' },
  ],
};

export default function UserPortalView({ member, attendanceList = [], attendanceHistory = [], payments = [], plans = [], classes = [], members = [], onBackToAdmin, onPayFees, onCheckIn, onCheckOut, onSaveWeeklyWorkout }) {
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isPaying, setIsPaying] = useState(false);
  const [attendanceAction, setAttendanceAction] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(() =>
    localStorage.getItem(`gym-workout-plan-${member?.id}`) || '',
  );
  const [selectedPlanId, setSelectedPlanId] = useState(() => String(member?.membershipPlan?.id || ''));
  const [completedExercises, setCompletedExercises] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`gym-workout-progress-${member?.id}-${selectedWorkout}`) || '[]');
    } catch {
      return [];
    }
  });
  const [weeklyPlan, setWeeklyPlan] = useState(() => getStoredWeeklyPlan(member));
  const [weeklySelections, setWeeklySelections] = useState(() => {
    const savedPlan = getStoredWeeklyPlan(member);
    if (savedPlan?.selections) return savedPlan.selections;
    return Object.fromEntries((savedPlan?.sessions || []).map((session) => [session.day, session.workout]));
  });
  const [isSavingWeeklyPlan, setIsSavingWeeklyPlan] = useState(false);

  useEffect(() => {
    const updateTime = () => setCurrentTime(Date.now());
    const initialTimer = window.setTimeout(updateTime, 0);
    const interval = window.setInterval(updateTime, 60000);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, [member?.trialEndsAt]);

  if (!member) {
    return (
      <div className="flex items-center justify-center h-full text-slate-300">
        No member selected.
      </div>
    );
  }

  const formatInr = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const formatIndianPhone = (phone) => {
    if (!phone) return 'Not provided';
    const digits = String(phone).replace(/\D/g, '');
    if (digits.length === 10) {
      return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
    if (digits.length === 12 && digits.startsWith('91')) {
      return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
    }
    return phone;
  };

  const totalPaid = payments
    .filter((payment) => payment.status === 'PAID')
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const availablePlans = plans.filter((planOption) => planOption.active !== false);
  const selectedPlan = member.membershipPlan || availablePlans.find((planOption) => String(planOption.id) === selectedPlanId);
  const planId = member.membershipPlan?.id || selectedPlan?.id;
  const planAlreadyPaid = planId && payments.some(
    (payment) => payment.status === 'PAID' && String(payment.membershipPlan?.id) === String(planId),
  );

  const lastCheckIn = attendanceList[0];
  const isCheckedIn = attendanceList.some((entry) => entry.status === 'CHECKED_IN');
  const isMemberActive = String(member.status || '').toUpperCase() === 'ACTIVE';
  const isTrialActive = String(member.status || '').toUpperCase() === 'TRIAL'
    && member.trialEndsAt
    && (currentTime === null || new Date(member.trialEndsAt).getTime() > currentTime);
  const hasCompletedFirstWorkout = attendanceHistory.some((entry) => entry.status === 'CHECKED_OUT');
  const workoutPlan = workoutPlans[selectedWorkout] || [];
  const workoutClassKeywords = {
    Strength: /strength|weight|powerlifting|lifting|crossfit|muscle/i,
    Cardio: /cardio|hiit|metabolic|cycling|spinning|endurance|aerobic/i,
    Mobility: /mobility|yoga|flexibility|stretch|pilates|vinyasa|recovery/i,
    'Warm-up': /warm.?up|cardio|mobility|yoga|vinyasa|stretch/i,
  };
  const matchingRooms = selectedWorkout
    ? classes.filter((gymClass) => workoutClassKeywords[selectedWorkout]?.test(
      `${gymClass.className || ''} ${gymClass.description || ''}`,
    ))
    : [];
  const completedWorkoutCount = completedExercises.filter((index) => index < workoutPlan.length).length;
  const workoutProgress = workoutPlan.length ? Math.round((completedWorkoutCount / workoutPlan.length) * 100) : 0;
  const currentWeekStart = getCurrentWeekStart();
  const activeWeeklyPlan = weeklyPlan?.weekStart === currentWeekStart ? weeklyPlan : null;
  const todayDate = currentTime === null
    ? ''
    : (() => {
      const date = new Date(currentTime);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${date.getFullYear()}-${month}-${day}`;
    })();
  const attendedDates = new Set(attendanceHistory.map((entry) => String(entry.date || '').slice(0, 10)));
  const missedSessions = (activeWeeklyPlan?.sessions || []).filter((session) =>
    session.date && session.date < todayDate && !attendedDates.has(session.date),
  );
  const trialHoursRemaining = member.trialEndsAt
    ? currentTime === null ? null : Math.max(0, Math.ceil((new Date(member.trialEndsAt).getTime() - currentTime) / 3600000))
    : null;

  const handlePayFees = async () => {
    setIsPaying(true);
    try {
      await onPayFees(paymentMethod, planId);
    } finally {
      setIsPaying(false);
    }
  };

  const handleWorkoutSelection = (workoutName) => {
    setSelectedWorkout(workoutName);
    try {
      setCompletedExercises(JSON.parse(localStorage.getItem(`gym-workout-progress-${member.id}-${workoutName}`) || '[]'));
    } catch {
      setCompletedExercises([]);
    }
    localStorage.setItem(`gym-workout-plan-${member.id}`, workoutName);
    localStorage.removeItem(`gym-workout-progress-${member.id}-${workoutName}`);
  };

  const handleExerciseToggle = (index) => {
    const nextCompleted = completedExercises.includes(index)
      ? completedExercises.filter((completedIndex) => completedIndex !== index)
      : [...completedExercises, index];
    setCompletedExercises(nextCompleted);
    localStorage.setItem(`gym-workout-progress-${member.id}-${selectedWorkout}`, JSON.stringify(nextCompleted));
  };

  const handleSaveWeeklyPlan = async () => {
    const requestedSessions = weekDays.flatMap((day, index) => {
      const workout = weeklySelections[day];
      return workout ? [{ day, workout, date: getDateForWeekDay(currentWeekStart, index) }] : [];
    });
    const nextPlan = {
      weekStart: currentWeekStart,
      selections: weeklySelections,
      sessions: allocateWorkoutSessions(requestedSessions, classes, members, member.id, currentWeekStart),
    };

    setIsSavingWeeklyPlan(true);
    try {
      if (await onSaveWeeklyWorkout(nextPlan)) setWeeklyPlan(nextPlan);
    } finally {
      setIsSavingWeeklyPlan(false);
    }
  };

  const handleReplanMissedWorkouts = async () => {
    if (!activeWeeklyPlan || missedSessions.length === 0) return;
    const firstMissedDate = missedSessions[0].date;
    const preservedSessions = activeWeeklyPlan.sessions.filter((session) =>
      session.date < firstMissedDate || attendedDates.has(session.date),
    );
    const sessionsToMove = activeWeeklyPlan.sessions
      .filter((session) => session.date >= firstMissedDate && !attendedDates.has(session.date))
      .sort((left, right) => left.date.localeCompare(right.date));
    const occupiedDates = new Set(preservedSessions.map((session) => session.date));
    const monday = new Date(`${currentWeekStart}T00:00:00`);
    const today = new Date(`${todayDate}T00:00:00`);
    let nextDayIndex = Math.max(0, Math.floor((today.getTime() - monday.getTime()) / 86400000));
    const reassignedSessions = [];

    sessionsToMove.forEach((session) => {
      let reassigned = null;
      for (let dayIndex = nextDayIndex; dayIndex < weekDays.length; dayIndex += 1) {
        const date = getDateForWeekDay(currentWeekStart, dayIndex);
        if (occupiedDates.has(date)) continue;
        const candidate = allocateWorkoutSessions(
          [{ ...session, date, day: weekDays[dayIndex] }],
          classes,
          members,
          member.id,
          currentWeekStart,
          [...preservedSessions, ...reassignedSessions],
        )[0];
        if (candidate.status === 'ASSIGNED') {
          reassigned = { ...candidate, status: 'RESCHEDULED' };
          occupiedDates.add(date);
          nextDayIndex = dayIndex + 1;
          break;
        }
      }
      reassignedSessions.push(reassigned || {
        ...session,
        date: null,
        day: 'Unassigned',
        classId: null,
        room: '',
        status: 'NO_ROOM',
      });
    });

    const nextPlan = {
      ...activeWeeklyPlan,
      sessions: [...preservedSessions, ...reassignedSessions]
        .sort((left, right) => String(left.date || '').localeCompare(String(right.date || ''))),
    };
    setIsSavingWeeklyPlan(true);
    try {
      if (await onSaveWeeklyWorkout(nextPlan)) setWeeklyPlan(nextPlan);
    } finally {
      setIsSavingWeeklyPlan(false);
    }
  };

  const handleAttendanceAction = async (action) => {
    setAttendanceAction(action);
    try {
      await (action === 'check-in' ? onCheckIn() : onCheckOut());
    } finally {
      setAttendanceAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Member Portal</p>
          <h3 className="mt-2 text-3xl font-black text-white">Welcome back, {member.firstName}</h3>
          {String(member.status).toUpperCase() === 'TRIAL' && (
            <p className="mt-1 text-sm text-cyan-200">
              2-day free trial: {trialHoursRemaining === null ? '48 hours' : trialHoursRemaining > 0 ? `${trialHoursRemaining} hours remaining` : 'ended'}
            </p>
          )}
        </div>
        <button
          onClick={onBackToAdmin}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Admin View
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-slate-400">Member</span>
            <User className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 text-xl font-black text-white">
            {member.firstName} {member.lastName}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-slate-400">Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 text-xl font-black text-white">{member.status || 'ACTIVE'}</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-slate-400">Plan</span>
            <CreditCard className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-3 text-xl font-black text-white">
            {member.membershipPlan?.name || 'No Plan'}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-slate-400">Total Paid</span>
            <IndianRupee className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-3 text-xl font-black text-white">{formatInr(totalPaid)}</div>
          <div className="mt-1 text-xs">
            <span className="text-slate-400">Fee status: </span>
            <span className={planAlreadyPaid ? 'font-semibold text-emerald-400' : 'font-semibold text-amber-400'}>
              {planAlreadyPaid ? 'PAID' : 'DUE'}
            </span>
          </div>
          {!member.membershipPlan && (
            <select
              aria-label="Membership plan to pay for"
              value={selectedPlanId}
              onChange={(event) => setSelectedPlanId(event.target.value)}
              className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-800 px-2 py-2 text-xs text-slate-200"
            >
              <option value="">Choose a membership plan</option>
              {availablePlans.map((planOption) => (
                <option key={planOption.id} value={planOption.id}>
                  {planOption.name} - {formatInr(planOption.price)}
                </option>
              ))}
            </select>
          )}
          <div className="mt-3 flex gap-2">
            <select
              aria-label="Payment method"
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
              disabled={!selectedPlan || planAlreadyPaid || isPaying}
              className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-2 text-xs text-slate-200 disabled:opacity-60"
            >
              <option value="UPI">UPI</option>
              <option value="CREDIT_CARD">Card</option>
              <option value="BANK_TRANSFER">Bank transfer</option>
              <option value="CASH">Cash</option>
            </select>
            <button
              type="button"
              onClick={handlePayFees}
              disabled={!selectedPlan || planAlreadyPaid || isPaying || !onPayFees}
              className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${planAlreadyPaid ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
            >
              {isPaying ? <LoaderCircle className="h-4 w-4 animate-spin" /> : planAlreadyPaid ? <CheckCircle2 className="h-4 w-4" /> : null}
              {isPaying ? 'Saving' : planAlreadyPaid ? 'Paid' : selectedPlan ? `Pay ${formatInr(selectedPlan.price)}` : 'Choose plan'}
            </button>
          </div>
        </div>
      </div>

      {hasCompletedFirstWorkout && !planAlreadyPaid && (
        <section className="flex flex-col gap-4 rounded-2xl border border-orange-500/30 bg-orange-500/10 p-5 sm:flex-row sm:items-center sm:justify-between" role="status">
          <div>
            <h4 className="font-bold text-white">First workout complete</h4>
            <p className="mt-1 text-sm text-slate-300">Choose a membership plan and pay your fees to continue training.</p>
          </div>
          <button
            type="button"
            onClick={handlePayFees}
            disabled={!selectedPlan || isPaying || !onPayFees}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPaying && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {selectedPlan ? `Pay ${formatInr(selectedPlan.price)}` : 'Select a plan above'}
          </button>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarCheck className="w-5 h-5 text-cyan-400" />
            <h4 className="text-lg font-bold text-white">Membership Details</h4>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>Email</span>
              <span className="text-white">{member.email}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>Phone</span>
              <span className="text-white">{formatIndianPhone(member.phone)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>Membership Start</span>
              <span className="text-white">
                {member.membershipStartDate ? new Date(member.membershipStartDate).toLocaleDateString() : 'Not set'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>Membership End</span>
              <span className="text-white">
                {member.membershipEndDate ? new Date(member.membershipEndDate).toLocaleDateString() : 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Current Plan</span>
              <span className="text-white">{member.membershipPlan?.name || 'No active plan'}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock3 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-lg font-bold text-white">Recent Attendance</h4>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleAttendanceAction('check-in')}
                disabled={isCheckedIn || attendanceAction !== null || (!isMemberActive && !isTrialActive)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {attendanceAction === 'check-in' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                Check in
              </button>
              <button
                type="button"
                onClick={() => handleAttendanceAction('check-out')}
                disabled={!isCheckedIn || attendanceAction !== null}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {attendanceAction === 'check-out' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                Check out
              </button>
            </div>
          </div>

          {attendanceList.length > 0 ? (
            <div className="space-y-3">
              {attendanceList.map((entry) => (
                <div key={entry.id || `${entry.date}-${entry.checkInTime}`} className="flex items-center justify-between rounded-xl bg-slate-800/60 p-3 border border-slate-700/70">
                  <div>
                    <div className="text-white font-semibold">
                      {entry.date ? new Date(entry.date).toLocaleDateString() : 'Today'}
                    </div>
                    <div className="text-xs text-slate-400">{entry.status}</div>
                  </div>
                  <div className="text-xs font-mono text-cyan-300">
                    {entry.checkInTime ? new Date(entry.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No attendance records yet.</p>
          )}

          {lastCheckIn && (
            <div className="mt-4 text-xs text-slate-400">
              Last check-in: {new Date(lastCheckIn.checkInTime).toLocaleString()}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-orange-400" />
            <h4 className="text-lg font-bold text-white">Payment History</h4>
          </div>

          {payments.length > 0 ? (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between rounded-xl bg-slate-800/60 p-3 border border-slate-700/70">
                  <div>
                    <div className="text-white font-semibold">{payment.invoiceNumber || 'Invoice'}</div>
                    <div className="text-xs text-slate-400">
                      {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'Date unavailable'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold font-mono">{formatInr(payment.amount)}</div>
                    <div className="text-xs text-emerald-400">{payment.status}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No payment records for this member yet.</p>
          )}
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h4 className="text-lg font-bold text-white">Workout Plan</h4>
          </div>

          <select
            aria-label="Choose a workout plan"
            value={selectedWorkout}
            onChange={(event) => handleWorkoutSelection(event.target.value)}
            className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          >
            <option value="">Choose a workout plan</option>
            {Object.keys(workoutPlans).filter((workoutName) => workoutName !== 'Warm-up').map((workoutName) => (
              <option key={workoutName} value={workoutName}>{workoutName}</option>
            ))}
          </select>

          {!selectedWorkout ? (
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
              <p className="text-sm text-slate-300">Haven’t picked a workout plan? Start with a gentle warm-up.</p>
              <button
                type="button"
                onClick={() => handleWorkoutSelection('Warm-up')}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-cyan-500"
              >
                Start warm-up
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {workoutPlan.map((item, index) => (
                <label key={`${item.exercise}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/70 bg-slate-800/60 p-3">
                  <span>
                    <span className="block font-semibold text-white">{item.exercise}</span>
                    <span className="text-xs text-slate-400">{item.sets}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={completedExercises.includes(index)}
                    onChange={() => handleExerciseToggle(index)}
                    aria-label={`Mark ${item.exercise} complete`}
                    className="h-4 w-4 accent-emerald-500"
                  />
                </label>
              ))}
            </div>
          )}

          {selectedWorkout && <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-cyan-200">{selectedWorkout} summary</span>
              <span className="font-semibold text-white">{completedWorkoutCount} of {workoutPlan.length} complete</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${workoutProgress}%` }} />
            </div>
            <div className="mt-1 text-right text-xs text-cyan-200">{workoutProgress}%</div>
          </div>}

          <section className="mt-5 border-t border-slate-800 pt-4" aria-label="Weekly workout room plan">
            <div className="mb-3">
              <h5 className="text-sm font-bold text-white">Weekly workout and room plan</h5>
              <p className="mt-1 text-xs text-slate-400">Choose workout days. Rooms are assigned from matching classes with open capacity; plans restart each Monday.</p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {weekDays.map((day) => (
                <label key={day} className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
                  <span className="text-sm font-semibold text-slate-200">{day}</span>
                  <select
                    aria-label={`${day} workout`}
                    value={weeklySelections[day] || ''}
                    onChange={(event) => setWeeklySelections((current) => ({ ...current, [day]: event.target.value }))}
                    className="max-w-40 rounded-md border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white"
                  >
                    <option value="">Rest day</option>
                    {Object.keys(workoutPlans).map((workoutName) => (
                      <option key={workoutName} value={workoutName}>{workoutName}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSaveWeeklyPlan}
              disabled={isSavingWeeklyPlan || !onSaveWeeklyWorkout || !Object.values(weeklySelections).some(Boolean)}
              className="mt-3 rounded-lg bg-cyan-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSavingWeeklyPlan ? 'Saving plan…' : activeWeeklyPlan ? 'Update weekly plan' : 'Plan this week'}
            </button>

            {activeWeeklyPlan && (
              <div className="mt-4 space-y-2">
                {activeWeeklyPlan.sessions.map((session, index) => (
                  <div key={`${session.day}-${session.workout}-${index}`} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                    <div>
                      <div className="text-sm font-semibold text-white">{session.day} · {session.workout}</div>
                      <div className="text-xs text-slate-400">{session.date || 'No day assigned'} · {session.scheduleTime || 'No matching class time'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-cyan-200">{session.room || 'No room available'}</div>
                      <div className={`text-xs ${session.status === 'ASSIGNED' || session.status === 'RESCHEDULED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {session.status === 'ASSIGNED' ? 'Room assigned' : session.status === 'RESCHEDULED' ? 'Rescheduled' : 'Needs another room'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {missedSessions.length > 0 && (
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-amber-100">
                  A planned gym day was missed. Shift this week’s remaining workouts to the next matching open rooms; a fresh plan starts Monday.
                </p>
                <button
                  type="button"
                  onClick={handleReplanMissedWorkouts}
                  disabled={isSavingWeeklyPlan}
                  className="shrink-0 rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
                >
                  {isSavingWeeklyPlan ? 'Saving…' : 'Replan remaining workouts'}
                </button>
              </div>
            )}
          </section>

          <section className="mt-5 border-t border-slate-800 pt-4" aria-label="Workout room vacancies">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h5 className="text-sm font-bold text-white">Room vacancies</h5>
              {selectedWorkout && <span className="text-xs text-slate-400">For {selectedWorkout}</span>}
            </div>
            {!selectedWorkout ? (
              <p className="text-sm text-slate-400">Choose a workout to see matching rooms.</p>
            ) : matchingRooms.length > 0 ? (
              <div className="space-y-2">
                {matchingRooms.map((gymClass) => {
                  const spotsLeft = Math.max(0, Number(gymClass.capacity || 0) - Number(gymClass.enrolledCount || 0));
                  return (
                    <div key={gymClass.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white">{gymClass.room || 'Room not assigned'}</div>
                        <div className="truncate text-xs text-slate-400">
                          {gymClass.className} · {gymClass.scheduleTime || 'Time not set'}
                        </div>
                      </div>
                      <span className={`shrink-0 text-xs font-semibold ${spotsLeft > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {spotsLeft > 0 ? `${spotsLeft} spots open` : 'Full'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No scheduled rooms match this workout yet.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
