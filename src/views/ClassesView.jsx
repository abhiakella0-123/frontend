import React, { useState } from 'react';
import { Calendar, Plus, Clock, MapPin, User, PlusCircle, MinusCircle, Edit2, Trash2 } from 'lucide-react';

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

function getCurrentWeekStart(date = new Date()) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const month = String(monday.getMonth() + 1).padStart(2, '0');
  const day = String(monday.getDate()).padStart(2, '0');
  return `${monday.getFullYear()}-${month}-${day}`;
}

export function RoomVacanciesView({ classes = [], members = [] }) {
  const [workout, setWorkout] = useState('All');
  const matchingClasses = workout === 'All'
    ? classes
    : getClassesForWorkout(classes, workout);
  const assignedMembers = members.flatMap((member) => {
    try {
      const plan = JSON.parse(member.weeklyWorkoutPlan || '{}');
      if (plan.weekStart !== getCurrentWeekStart()) return [];
      return (plan.sessions || [])
        .filter((session) => session.classId != null)
        .map((session) => ({ ...session, memberName: `${member.firstName} ${member.lastName}` }));
    } catch {
      return [];
    }
  });
  const assignmentsByClass = assignedMembers.reduce((assignments, session) => {
    const key = String(session.classId);
    assignments[key] = [...(assignments[key] || []), session];
    return assignments;
  }, {});
  const openSpots = matchingClasses.reduce(
    (total, gymClass) => total + Math.max(
      0,
      Number(gymClass.capacity || 0) - Number(gymClass.enrolledCount || 0) - (assignmentsByClass[String(gymClass.id)] || []).length,
    ),
    0,
  );
  const fullClasses = matchingClasses.filter((gymClass) =>
    Number(gymClass.enrolledCount || 0) + (assignmentsByClass[String(gymClass.id)] || []).length >= Number(gymClass.capacity || 0),
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-white">
            <MapPin className="h-5 w-5 text-emerald-400" />
            Room Availability
          </h3>
          <p className="mt-1 text-xs text-slate-400">Review open class-room capacity by workout type.</p>
        </div>
        <label className="flex items-center gap-3 text-xs font-semibold text-slate-400">
          Workout
          <select
            aria-label="Filter room vacancies by workout"
            value={workout}
            onChange={(event) => setWorkout(event.target.value)}
            className="min-w-40 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          >
            <option>All</option>
            {Object.keys(workoutClassKeywords).map((workoutType) => (
              <option key={workoutType}>{workoutType}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border-b border-slate-800 pb-3">
          <div className="text-xs uppercase text-slate-400">Matching classes</div>
          <div className="mt-1 text-2xl font-bold text-white">{matchingClasses.length}</div>
        </div>
        <div className="border-b border-slate-800 pb-3">
          <div className="text-xs uppercase text-slate-400">Open spots</div>
          <div className="mt-1 text-2xl font-bold text-emerald-400">{openSpots}</div>
        </div>
        <div className="border-b border-slate-800 pb-3">
          <div className="text-xs uppercase text-slate-400">Full classes</div>
          <div className="mt-1 text-2xl font-bold text-rose-400">{fullClasses}</div>
        </div>
      </div>

      <div className="overflow-x-auto border-y border-slate-800">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase text-slate-400">
              <th className="py-3 pr-4 font-semibold">Room / class</th>
              <th className="py-3 pr-4 font-semibold">Workout</th>
              <th className="py-3 pr-4 font-semibold">Schedule</th>
              <th className="py-3 pr-4 font-semibold">Enrollment</th>
              <th className="py-3 pr-4 font-semibold">Members assigned</th>
              <th className="py-3 text-right font-semibold">Availability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {matchingClasses.map((gymClass) => {
              const capacity = Number(gymClass.capacity || 0);
              const enrolled = Number(gymClass.enrolledCount || 0);
              const membersAssigned = assignmentsByClass[String(gymClass.id)] || [];
              const spots = Math.max(0, capacity - enrolled - membersAssigned.length);
              return (
                <tr key={gymClass.id}>
                  <td className="py-3 pr-4">
                    <div className="font-semibold text-white">{gymClass.room || 'Room not assigned'}</div>
                    <div className="text-xs text-slate-400">{gymClass.className}</div>
                  </td>
                  <td className="py-3 pr-4 text-slate-300">{workout === 'All' ? 'All workouts' : workout}</td>
                  <td className="py-3 pr-4 text-slate-300">
                    <div>{gymClass.scheduleTime || 'Time not set'}</div>
                    <div className="text-xs text-slate-400">{gymClass.daysOfWeek || 'Days not set'}</div>
                  </td>
                  <td className="py-3 pr-4 font-mono text-slate-300">{enrolled + membersAssigned.length} / {capacity}</td>
                  <td className="py-3 pr-4 text-slate-300">
                    {membersAssigned.length ? (
                      <div className="space-y-1">
                        {membersAssigned.map((session) => (
                          <div key={`${session.memberName}-${session.date}`} className="text-xs">
                            <span className="font-medium text-white">{session.memberName}</span>
                            <span className="text-slate-400"> · {session.day} {session.workout}</span>
                          </div>
                        ))}
                      </div>
                    ) : <span className="text-xs text-slate-500">None</span>}
                  </td>
                  <td className={`py-3 text-right font-semibold ${spots ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {spots ? `${spots} open` : 'Full'}
                  </td>
                </tr>
              );
            })}
            {matchingClasses.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-sm text-slate-400">
                  No scheduled classes match this workout type.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ClassesView({ 
  classes, 
  onAddClass, 
  onEditClass, 
  onDeleteClass, 
  onEnroll, 
  onCancelEnrollment 
}) {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            Class Schedule & Group Sessions
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage fitness classes, schedules, trainer assignments, and live seat enrollment
          </p>
        </div>

        <button
          onClick={onAddClass}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-md shadow-orange-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Class</span>
        </button>
      </div>

      {/* Class Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((cls) => {
          const percent = Math.min(100, Math.round(((cls.enrolledCount || 0) / (cls.capacity || 1)) * 100));
          const isFull = (cls.enrolledCount || 0) >= (cls.capacity || 1);

          return (
            <div
              key={cls.id}
              className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition shadow-lg relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-base text-white">{cls.className}</h4>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-orange-400 border border-slate-700">
                    {cls.durationMinutes} Mins
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-4 line-clamp-2">{cls.description}</p>

                {/* Class Meta Details */}
                <div className="space-y-2 text-xs bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80 mb-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="text-slate-500">Coach:</span>
                    <span className="font-semibold text-slate-200">
                      {cls.trainer?.firstName} {cls.trainer?.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-slate-500">Time:</span>
                    <span className="font-mono text-slate-200">{cls.scheduleTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="text-slate-500">Days:</span>
                    <span className="text-slate-200">{cls.daysOfWeek || 'Mon-Fri'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-500">Room:</span>
                    <span className="text-slate-200">{cls.room || 'Studio A'}</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Class Booking</span>
                    <span className="font-mono font-semibold text-slate-300">
                      {cls.enrolledCount} / {cls.capacity} spots ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFull ? 'bg-rose-500' : percent >= 70 ? 'bg-amber-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Enrollment & Management Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEnroll(cls.id)}
                    disabled={isFull}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-orange-400 text-xs font-semibold border border-orange-500/30 transition active:scale-95"
                    title="Book / Enroll 1 Member"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Book Spot</span>
                  </button>
                  <button
                    onClick={() => onCancelEnrollment(cls.id)}
                    disabled={cls.enrolledCount <= 0}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-400 hover:text-slate-200 transition active:scale-95"
                    title="Cancel 1 Spot"
                  >
                    <MinusCircle className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditClass(cls)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition active:scale-95"
                    title="Edit Class"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                  <button
                    onClick={() => onDeleteClass(cls.id)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition active:scale-95"
                    title="Delete Class"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
