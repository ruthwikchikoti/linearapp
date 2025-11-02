import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://linear-server.onrender.com";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tickets
export const ticketAPI = {
  getAll: (params?: any) => api.get("/ticket", { params }),
  getById: (id: string) => api.get(`/ticket/${id}`),
  create: (data: any) => api.post("/ticket", data),
  update: (id: string, data: any) => api.patch(`/ticket/${id}`, data),
  delete: (id: string) => api.delete(`/ticket/${id}`),
};

// Users
export const userAPI = {
  getAll: () => api.get("/user"),
  getById: (id: string) => api.get(`/user/${id}`),
  create: (data: any) => api.post("/user", data),
  update: (id: string, data: any) => api.patch(`/user/${id}`, data),
};

// Teams
export const teamAPI = {
  getAll: () => api.get("/team"),
  getById: (id: string) => api.get(`/team/${id}`),
  create: (data: any) => api.post("/team", data),
  update: (id: string, data: any) => api.patch(`/team/${id}`, data),
  delete: (id: string) => api.delete(`/team/${id}`),
};

// Projects
export const projectAPI = {
  getAll: (params?: any) => api.get("/project", { params }),
  getById: (id: string) => api.get(`/project/${id}`),
  create: (data: any) => api.post("/project", data),
  update: (id: string, data: any) => api.patch(`/project/${id}`, data),
  delete: (id: string) => api.delete(`/project/${id}`),
};

// Labels
export const labelAPI = {
  getAll: (params?: any) => api.get("/label", { params }),
  create: (data: any) => api.post("/label", data),
  update: (id: string, data: any) => api.patch(`/label/${id}`, data),
  delete: (id: string) => api.delete(`/label/${id}`),
};

// Cycles
export const cycleAPI = {
  getAll: (params?: any) => api.get("/cycle", { params }),
  getById: (id: string) => api.get(`/cycle/${id}`),
  create: (data: any) => api.post("/cycle", data),
  update: (id: string, data: any) => api.patch(`/cycle/${id}`, data),
  delete: (id: string) => api.delete(`/cycle/${id}`),
};

// Comments
export const commentAPI = {
  getAll: (params?: any) => api.get("/comment", { params }),
  getById: (id: string) => api.get(`/comment/${id}`),
  create: (data: any) => api.post("/comment", data),
  update: (id: string, data: any) => api.patch(`/comment/${id}`, data),
  addReaction: (id: string, data: any) => api.patch(`/comment/${id}/reaction`, data),
  delete: (id: string) => api.delete(`/comment/${id}`),
};

// Activity
export const activityAPI = {
  getAll: (params?: any) => api.get("/activity", { params }),
  create: (data: any) => api.post("/activity", data),
};

// Upload
export const uploadAPI = {
  uploadFiles: (files: FormData) => {
    return axios.post(`${API_BASE}/upload`, files, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

