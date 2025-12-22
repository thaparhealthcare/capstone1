import apiClient from "./apiClient";

export const doctorAppointmentApi = {
  getAll: () => apiClient.get("/doctor/appointments"),

  getUpcoming: () => apiClient.get("/doctor/appointments/upcoming"),

  getPast: () => apiClient.get("/doctor/appointments/past"),

  cancel: (appointmentId: string) =>
    apiClient.patch(`/doctor/appointment/${appointmentId}/cancel`),

  complete: (appointmentId: string) =>
    apiClient.patch(`/doctor/appointment/${appointmentId}/complete`),
};
