import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import UserPortalView from './views/UserPortalView';
import MembersView from './views/MembersView';
import AttendanceView from './views/AttendanceView';
import PlansView from './views/PlansView';
import TrainersView from './views/TrainersView';
import ClassesView, { RoomVacanciesView } from './views/ClassesView';
import PaymentsView from './views/PaymentsView';
import EquipmentView from './views/EquipmentView';

import MemberModal from './components/MemberModal';
import QuickCheckInModal from './components/QuickCheckInModal';
import RenewModal from './components/RenewModal';
import PlanModal from './components/PlanModal';
import TrainerModal from './components/TrainerModal';
import ClassModal from './components/ClassModal';
import EquipmentModal from './components/EquipmentModal';
import PaymentModal from './components/PaymentModal';
import InvoiceModal from './components/InvoiceModal';

import {
  authApi,
  dashboardApi,
  membersApi,
  plansApi,
  trainersApi,
  classesApi,
  attendanceApi,
  paymentsApi,
  equipmentApi,
} from './services/api';

import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

const tabPaths = {
  dashboard: 'Dashboard',
  members: 'Members',
  attendance: 'Attendance',
  plans: 'MembershipPlans',
  trainers: 'Trainers',
  classes: 'Classes',
  roomAvailability: 'RoomAvailability',
  payments: 'Payments',
  equipment: 'Equipment',
};

function getTabFromPath(pathname) {
  const path = decodeURIComponent(pathname).replace(/^\/+|\/+$/g, '').toLowerCase();
  return Object.entries(tabPaths).find(([, route]) => route.toLowerCase() === path)?.[0] || 'dashboard';
}

export default function App() {
  const [currentTab, setCurrentTabState] = useState(() => getTabFromPath(window.location.pathname));
  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem('gymAuth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [stats, setStats] = useState({});
  const [members, setMembers] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [memberAttendanceHistory, setMemberAttendanceHistory] = useState({ memberId: null, records: [] });
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membersReady, setMembersReady] = useState(false);

  const setCurrentTab = (tab) => {
    setCurrentTabState(tab);
    const path = `/${tabPaths[tab] || tabPaths.dashboard}`;
    if (window.location.pathname !== path) window.history.pushState({ tab }, '', path);
  };

  // Toast Notifications
  const [toast, setToast] = useState(null);

  // Modal States
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState(null);

  const [isQuickCheckInOpen, setIsQuickCheckInOpen] = useState(false);

  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [memberToRenew, setMemberToRenew] = useState(null);

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState(null);

  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [trainerToEdit, setTrainerToEdit] = useState(null);

  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState(null);

  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [equipmentToEdit, setEquipmentToEdit] = useState(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceToView, setInvoiceToView] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadAllData = async () => {
    try {
      const [
        statsRes,
        membersRes,
        todayAttRes,
        recentAttRes,
        plansRes,
        trainersRes,
        classesRes,
        paymentsRes,
        equipmentRes,
      ] = await Promise.all([
        dashboardApi.getStats(),
        membersApi.getAll(),
        attendanceApi.getToday(),
        attendanceApi.getRecent(),
        plansApi.getAll(),
        trainersApi.getAll(),
        classesApi.getAll(),
        paymentsApi.getAll(),
        equipmentApi.getAll(),
      ]);

      setStats(statsRes.data || {});
      setMembers(membersRes.data || []);
      setTodayAttendance(todayAttRes.data || []);
      setRecentAttendance(recentAttRes.data || []);
      setPlans(plansRes.data || []);
      setTrainers(trainersRes.data || []);
      setClasses(classesRes.data || []);
      setPayments(paymentsRes.data || []);
      setEquipmentList(equipmentRes.data || []);
    } catch (err) {
      console.error('Failed to load initial data:', err);
      showToast('Error connecting to backend API.', 'error');
    } finally {
      // oxlint-disable-next-line react/set-state-in-effect
      setMembersReady(true);
      setLoading(false);
    }
  };

  // oxlint-disable-next-line react/set-state-in-effect
  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    const syncTabFromPath = () => setCurrentTabState(getTabFromPath(window.location.pathname));
    window.addEventListener('popstate', syncTabFromPath);
    return () => window.removeEventListener('popstate', syncTabFromPath);
  }, []);

  useEffect(() => {
    if (auth?.role !== 'user' || !auth.memberId) {
      return undefined;
    }

    let isCurrentRequest = true;
    attendanceApi.getMemberAttendance(auth.memberId)
      .then((response) => {
        if (isCurrentRequest) {
          setMemberAttendanceHistory({ memberId: String(auth.memberId), records: response.data || [] });
        }
      })
      .catch((error) => console.error('Failed to load member attendance history:', error));

    return () => {
      isCurrentRequest = false;
    };
  }, [auth?.role, auth?.memberId]);

  // Handlers
  const handleCheckIn = async (memberId) => {
    try {
      const response = await attendanceApi.checkIn(memberId);
      setMemberAttendanceHistory((current) => current.memberId === String(memberId)
        ? { ...current, records: [response.data, ...current.records] }
        : current);
      showToast('Member successfully checked in!');
      await loadAllData();
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Check-in failed';
      showToast(msg, 'error');
      return false;
    }
  };

  const handleCheckOut = async (memberId) => {
    try {
      const response = await attendanceApi.checkOut(memberId);
      setMemberAttendanceHistory((current) => current.memberId === String(memberId)
        ? { ...current, records: current.records.map((entry) => entry.id === response.data.id ? response.data : entry) }
        : current);
      showToast('Member check-out recorded!');
      await loadAllData();
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Check-out failed';
      showToast(msg, 'error');
      return false;
    }
  };

  const handleSaveMember = async (formData) => {
    try {
      if (memberToEdit) {
        await membersApi.update(memberToEdit.id, formData);
        showToast('Member updated successfully!');
      } else {
        await membersApi.create(formData);
        showToast('New member registered successfully!');
      }
      setIsMemberModalOpen(false);
      setMemberToEdit(null);
      loadAllData();
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to save member';
      showToast(msg, 'error');
    }
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await membersApi.delete(id);
        showToast('Member deleted.');
        loadAllData();
      } catch (error) {
        console.error('Failed to delete member.', error);
        showToast('Failed to delete member.', 'error');
      }
    }
  };

  const handleRenewMember = async (memberId, planId) => {
    try {
      await membersApi.renew(memberId, planId);
      showToast('Membership plan successfully renewed!');
      loadAllData();
    } catch (error) {
      console.error('Failed to renew membership.', error);
      showToast('Failed to renew membership.', 'error');
    }
  };

  const handleSavePlan = async (formData) => {
    try {
      if (planToEdit) {
        await plansApi.update(planToEdit.id, formData);
        showToast('Plan updated!');
      } else {
        await plansApi.create(formData);
        showToast('Plan created!');
      }
      setIsPlanModalOpen(false);
      setPlanToEdit(null);
      loadAllData();
    } catch (error) {
      console.error('Failed to save plan.', error);
      showToast('Failed to save plan.', 'error');
    }
  };

  const handleDeletePlan = async (id) => {
    if (window.confirm('Delete this plan?')) {
      try {
        await plansApi.delete(id);
        showToast('Plan deleted.');
        loadAllData();
      } catch (error) {
        console.error('Failed to delete plan.', error);
        showToast('Failed to delete plan.', 'error');
      }
    }
  };

  const handleSaveTrainer = async (formData) => {
    try {
      if (trainerToEdit) {
        await trainersApi.update(trainerToEdit.id, formData);
        showToast('Coach profile updated!');
      } else {
        await trainersApi.create(formData);
        showToast('New coach added!');
      }
      setIsTrainerModalOpen(false);
      setTrainerToEdit(null);
      loadAllData();
    } catch (error) {
      console.error('Failed to save coach.', error);
      showToast('Failed to save coach.', 'error');
    }
  };

  const handleDeleteTrainer = async (id) => {
    if (window.confirm('Delete this coach?')) {
      try {
        await trainersApi.delete(id);
        showToast('Coach deleted.');
        loadAllData();
      } catch (error) {
        console.error('Failed to delete coach.', error);
        showToast('Failed to delete coach.', 'error');
      }
    }
  };

  const handleSaveClass = async (formData) => {
    try {
      if (classToEdit) {
        await classesApi.update(classToEdit.id, formData);
        showToast('Class updated!');
      } else {
        await classesApi.create(formData);
        showToast('Class scheduled!');
      }
      setIsClassModalOpen(false);
      setClassToEdit(null);
      loadAllData();
    } catch (error) {
      console.error('Failed to save class.', error);
      showToast('Failed to save class.', 'error');
    }
  };

  const handleEnrollClass = async (classId) => {
    try {
      await classesApi.enroll(classId);
      showToast('Spot reserved in class!');
      loadAllData();
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Enrollment failed';
      showToast(msg, 'error');
    }
  };

  const handleCancelEnrollment = async (classId) => {
    try {
      await classesApi.cancelEnrollment(classId);
      showToast('Spot released from class.');
      loadAllData();
    } catch (error) {
      console.error('Failed to cancel spot.', error);
      showToast('Failed to cancel spot.', 'error');
    }
  };

  const handleDeleteClass = async (id) => {
    if (window.confirm('Cancel and delete this class?')) {
      try {
        await classesApi.delete(id);
        showToast('Class deleted.');
        loadAllData();
      } catch (error) {
        console.error('Failed to delete class.', error);
        showToast('Failed to delete class.', 'error');
      }
    }
  };

  const handleSaveEquipment = async (formData) => {
    try {
      if (equipmentToEdit) {
        await equipmentApi.update(equipmentToEdit.id, formData);
        showToast('Equipment updated!');
      } else {
        await equipmentApi.create(formData);
        showToast('Equipment added!');
      }
      setIsEquipmentModalOpen(false);
      setEquipmentToEdit(null);
      loadAllData();
    } catch (error) {
      console.error('Failed to save equipment.', error);
      showToast('Failed to save equipment.', 'error');
    }
  };

  const handleMarkEquipmentDone = async (id) => {
    try {
      await equipmentApi.markMaintenanceDone(id);
      showToast('Equipment marked fully operational!');
      loadAllData();
    } catch (error) {
      console.error('Failed to update maintenance status.', error);
      showToast('Failed to update maintenance status.', 'error');
    }
  };

  const handleDeleteEquipment = async (id) => {
    if (window.confirm('Delete this equipment?')) {
      try {
        await equipmentApi.delete(id);
        showToast('Equipment removed.');
        loadAllData();
      } catch (error) {
        console.error('Failed to delete equipment.', error);
        showToast('Failed to delete equipment.', 'error');
      }
    }
  };

  const handleSavePayment = async (formData) => {
    try {
      await paymentsApi.record(formData);
      showToast('Payment recorded successfully!');
      setIsPaymentModalOpen(false);
      loadAllData();
    } catch (error) {
      console.error('Failed to record payment.', error);
      const message = error.response?.data?.message || error.message || 'Failed to record payment.';
      showToast(message, 'error');
    }
  };

  const handleMemberFeePayment = async (paymentMethod, planId) => {
    try {
      const response = await paymentsApi.checkoutMembershipFee(userMember.id, paymentMethod, planId);
      setPayments((currentPayments) => [response.data, ...currentPayments]);
      if (response.data.member) {
        setMembers((currentMembers) => currentMembers.map((member) =>
          String(member.id) === String(response.data.member.id) ? response.data.member : member,
        ));
      }
      showToast('Membership fee recorded as paid.');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Payment could not be recorded.';
      showToast(message, 'error');
      return false;
    }
  };

  const handleSaveWeeklyWorkout = async (weeklyWorkoutPlan) => {
    try {
      const response = await membersApi.updateWeeklyWorkout(userMember.id, JSON.stringify(weeklyWorkoutPlan));
      setMembers((currentMembers) => currentMembers.map((member) =>
        String(member.id) === String(userMember.id) ? response.data : member,
      ));
      showToast('Weekly workout and room assignments saved.');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Weekly plan could not be saved.';
      showToast(message, 'error');
      return false;
    }
  };

  const handleLogin = async ({ email, password, role }) => {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPassword = String(password || '');

    if (role === 'admin') {
      if (normalizedEmail !== 'admin@titanfit.com' || normalizedPassword !== 'admin123') {
        throw new Error('Invalid admin email or password.');
      }

      const nextAuth = { role: 'admin' };
      setAuth(nextAuth);
      localStorage.setItem('gymAuth', JSON.stringify(nextAuth));
      return;
    }

    if (role !== 'user') {
      throw new Error('Choose Admin Login or Member Login to continue.');
    }

    try {
      const response = await authApi.login({ email: normalizedEmail, password: normalizedPassword });
      const membersResponse = await membersApi.getAll();
      setMembers(membersResponse.data || []);
      const nextAuth = { role: 'user', memberId: String(response.data.memberId) };
      setAuth(nextAuth);
      localStorage.setItem('gymAuth', JSON.stringify(nextAuth));
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.detail;
      throw new Error(message || 'Unable to sign in. Check your member email and password.');
    }
  };

  const handleRegister = async (details) => {
    try {
      await authApi.register(details);
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.detail;
      throw new Error(message || 'Unable to create your account. Please check your details and try again.');
    }
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem('gymAuth');
  };

  const activeInsideList = todayAttendance.filter((a) => a.status === 'CHECKED_IN');
  const activeInsideIds = activeInsideList.map((a) => a.member?.id);
  const userMember = members.find((m) => String(m.id) === String(auth?.memberId)) || members[0] || null;
  const memberAttendance = todayAttendance.filter((a) => a.member?.id === userMember?.id);
  const currentMemberAttendanceHistory = memberAttendanceHistory.memberId === String(auth?.memberId)
    ? memberAttendanceHistory.records
    : [];
  const memberPayments = payments.filter((p) => p.member?.id === userMember?.id);

  const tabTitles = {
    dashboard: 'Club Overview',
    members: 'Member Directory',
    attendance: 'Live Attendance',
    plans: 'Membership Packages',
    trainers: 'Coaches & Staff',
    classes: 'Group Class Schedule',
    roomAvailability: 'Room Availability',
    payments: 'Billing & Invoices',
    equipment: 'Machinery & Equipment',
  };

  if (!auth) {
    if (!membersReady && loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
          <div className="flex flex-col items-center gap-3 text-slate-400 text-xs">
            <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            <span>Loading gym data...</span>
          </div>
        </div>
      );
    }

    return <LoginView onLogin={handleLogin} onRegister={handleRegister} plans={plans} />;
  }

  if (auth.role === 'user') {
    return (
      <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-18 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Member Portal</h2>
                <p className="text-xs text-slate-400">Apex Fitness Club &bull; Personal dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition shadow-sm active:scale-95"
              >
                <span>Logout</span>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <UserPortalView
              key={userMember?.id}
              member={userMember}
              attendanceList={memberAttendance}
              attendanceHistory={currentMemberAttendanceHistory}
              payments={memberPayments}
              plans={plans}
              classes={classes}
              members={members}
              onBackToAdmin={handleLogout}
              onPayFees={handleMemberFeePayment}
              onSaveWeeklyWorkout={handleSaveWeeklyWorkout}
              onCheckIn={() => handleCheckIn(userMember.id)}
              onCheckOut={() => handleCheckOut(userMember.id)}
            />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-800'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeInsideCount={activeInsideList.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          title={tabTitles[currentTab] || 'Apex Fitness'}
          activeInsideCount={activeInsideList.length}
          onQuickCheckIn={() => setIsQuickCheckInOpen(true)}
          onAddMember={() => {
            setMemberToEdit(null);
            setIsMemberModalOpen(true);
          }}
          onLogout={handleLogout}
        />

        {/* View Container */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-slate-400 text-xs">
                <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                <span>Loading Titan Fit Management Suite...</span>
              </div>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardView
                  stats={stats}
                  todayAttendance={todayAttendance}
                  members={members}
                  classes={classes}
                  onCheckOut={handleCheckOut}
                  onQuickCheckIn={() => setIsQuickCheckInOpen(true)}
                  onNavigateTab={setCurrentTab}
                />
              )}

              {currentTab === 'members' && (
                <MembersView
                  members={members}
                  plans={plans}
                  activeInsideIds={activeInsideIds}
                  onAddMember={() => {
                    setMemberToEdit(null);
                    setIsMemberModalOpen(true);
                  }}
                  onEditMember={(m) => {
                    setMemberToEdit(m);
                    setIsMemberModalOpen(true);
                  }}
                  onDeleteMember={handleDeleteMember}
                  onRenewMember={(m) => {
                    setMemberToRenew(m);
                    setIsRenewModalOpen(true);
                  }}
                  onCheckIn={handleCheckIn}
                />
              )}

              {currentTab === 'attendance' && (
                <AttendanceView
                  todayAttendance={todayAttendance}
                  recentAttendance={recentAttendance}
                  members={members}
                  onCheckIn={handleCheckIn}
                  onCheckOut={handleCheckOut}
                />
              )}

              {currentTab === 'plans' && (
                <PlansView
                  plans={plans}
                  onAddPlan={() => {
                    setPlanToEdit(null);
                    setIsPlanModalOpen(true);
                  }}
                  onEditPlan={(p) => {
                    setPlanToEdit(p);
                    setIsPlanModalOpen(true);
                  }}
                  onDeletePlan={handleDeletePlan}
                />
              )}

              {currentTab === 'trainers' && (
                <TrainersView
                  trainers={trainers}
                  onAddTrainer={() => {
                    setTrainerToEdit(null);
                    setIsTrainerModalOpen(true);
                  }}
                  onEditTrainer={(t) => {
                    setTrainerToEdit(t);
                    setIsTrainerModalOpen(true);
                  }}
                  onDeleteTrainer={handleDeleteTrainer}
                />
              )}

              {currentTab === 'classes' && (
                <ClassesView
                  classes={classes}
                  onAddClass={() => {
                    setClassToEdit(null);
                    setIsClassModalOpen(true);
                  }}
                  onEditClass={(c) => {
                    setClassToEdit(c);
                    setIsClassModalOpen(true);
                  }}
                  onDeleteClass={handleDeleteClass}
                  onEnroll={handleEnrollClass}
                  onCancelEnrollment={handleCancelEnrollment}
                />
              )}

              {currentTab === 'roomAvailability' && (
                <RoomVacanciesView classes={classes} members={members} />
              )}

              {currentTab === 'payments' && (
                <PaymentsView
                  payments={payments}
                  onRecordPayment={() => setIsPaymentModalOpen(true)}
                  onViewInvoice={(p) => {
                    setInvoiceToView(p);
                    setIsInvoiceModalOpen(true);
                  }}
                />
              )}

              {currentTab === 'equipment' && (
                <EquipmentView
                  equipmentList={equipmentList}
                  onAddEquipment={() => {
                    setEquipmentToEdit(null);
                    setIsEquipmentModalOpen(true);
                  }}
                  onEditEquipment={(eq) => {
                    setEquipmentToEdit(eq);
                    setIsEquipmentModalOpen(true);
                  }}
                  onDeleteEquipment={handleDeleteEquipment}
                  onMarkDone={handleMarkEquipmentDone}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onSave={handleSaveMember}
        memberToEdit={memberToEdit}
        plans={plans}
      />

      <QuickCheckInModal
        isOpen={isQuickCheckInOpen}
        onClose={() => setIsQuickCheckInOpen(false)}
        members={members}
        onCheckIn={handleCheckIn}
        activeInsideIds={activeInsideIds}
      />

      <RenewModal
        isOpen={isRenewModalOpen}
        onClose={() => setIsRenewModalOpen(false)}
        member={memberToRenew}
        plans={plans}
        onRenew={handleRenewMember}
      />

      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSave={handleSavePlan}
        planToEdit={planToEdit}
      />

      <TrainerModal
        isOpen={isTrainerModalOpen}
        onClose={() => setIsTrainerModalOpen(false)}
        onSave={handleSaveTrainer}
        trainerToEdit={trainerToEdit}
      />

      <ClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onSave={handleSaveClass}
        classToEdit={classToEdit}
        trainers={trainers}
      />

      <EquipmentModal
        isOpen={isEquipmentModalOpen}
        onClose={() => setIsEquipmentModalOpen(false)}
        onSave={handleSaveEquipment}
        equipmentToEdit={equipmentToEdit}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSave={handleSavePayment}
        members={members}
        plans={plans}
        payments={payments}
      />

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        payment={invoiceToView}
      />
    </div>
  );
}
