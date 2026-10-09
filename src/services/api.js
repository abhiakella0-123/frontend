import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const membersApi = {
  getAll: (search) => api.get('/members', { params: { search } }),
  getById: (id) => api.get(`/members/${id}`),
  updateWeeklyWorkout: (id, weeklyWorkoutPlan) =>
    api.put(`/members/${id}/weekly-workout`, { weeklyWorkoutPlan }),
  create: (data) => api.post('/members', data),
  update: (id, data) => api.put(`/members/${id}`, data),
  renew: (id, planId) => api.post(`/members/${id}/renew?planId=${planId}`),
  delete: (id) => api.delete(`/members/${id}`),
};

export const plansApi = {
  getAll: (activeOnly = false) => api.get('/plans', { params: { activeOnly } }),
  getById: (id) => api.get(`/plans/${id}`),
  create: (data) => api.post('/plans', data),
  update: (id, data) => api.put(`/plans/${id}`, data),
  delete: (id) => api.delete(`/plans/${id}`),
};

export const trainersApi = {
  getAll: (activeOnly = false) => api.get('/trainers', { params: { activeOnly } }),
  getById: (id) => api.get(`/trainers/${id}`),
  create: (data) => api.post('/trainers', data),
  update: (id, data) => api.put(`/trainers/${id}`, data),
  delete: (id) => api.delete(`/trainers/${id}`),
};

export const classesApi = {
  getAll: () => api.get('/classes'),
  getById: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  enroll: (id) => api.post(`/classes/${id}/enroll`),
  cancelEnrollment: (id) => api.post(`/classes/${id}/cancel-enrollment`),
  delete: (id) => api.delete(`/classes/${id}`),
};

export const attendanceApi = {
  getToday: () => api.get('/attendance/today'),
  getRecent: () => api.get('/attendance/recent'),
  getMemberAttendance: (memberId) => api.get(`/attendance/member/${memberId}`),
  checkIn: (memberId) => api.post(`/attendance/check-in/${memberId}`),
  checkOut: (memberId) => api.post(`/attendance/check-out/${memberId}`),
  getStats: () => api.get('/attendance/stats'),
};

export const paymentsApi = {
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  getByMember: (memberId) => api.get(`/payments/member/${memberId}`),
  checkoutMembershipFee: (memberId, paymentMethod, planId) =>
    api.post(`/payments/member/${memberId}/checkout`, { paymentMethod, planId }),
  record: (data) => api.post('/payments', data),
};

export const equipmentApi = {
  getAll: (category) => api.get('/equipment', { params: { category } }),
  getById: (id) => api.get(`/equipment/${id}`),
  create: (data) => api.post('/equipment', data),
  update: (id, data) => api.put(`/equipment/${id}`, data),
  markMaintenanceDone: (id) => api.patch(`/equipment/${id}/maintenance-done`),
  delete: (id) => api.delete(`/equipment/${id}`),
};

export default api;
