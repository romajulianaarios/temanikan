import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: async (data: { name: string; email: string; password: string; phone?: string; address?: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Device API
export const deviceAPI = {
  getDevices: async () => {
    const response = await api.get('/devices');
    return response.data;
  },
  
  getDevice: async (deviceId: number) => {
    const response = await api.get(`/devices/${deviceId}`);
    return response.data;
  },
  
  addDevice: async (data: { name: string; device_code?: string }) => {
    const response = await api.post('/devices', data);
    return response.data;
  },
  
  updateDevice: async (deviceId: number, data: any) => {
    const response = await api.put(`/devices/${deviceId}`, data);
    return response.data;
  },
  
  deleteDevice: async (deviceId: number) => {
    const response = await api.delete(`/devices/${deviceId}`);
    return response.data;
  },
};

// Water Monitoring API
export const waterAPI = {
  getWaterData: async (deviceId: number, hours: number = 24, limit: number = 100) => {
    const response = await api.get(`/devices/${deviceId}/water-data`, {
      params: { hours, limit }
    });
    return response.data;
  },
  
  addWaterData: async (deviceId: number, data: {
    temperature?: number;
    ph_level?: number;
    turbidity?: number;
    oxygen_level?: number;
    ammonia_level?: number;
  }) => {
    const response = await api.post(`/devices/${deviceId}/water-data`, data);
    return response.data;
  },
};

// Robot Control API
export const robotAPI = {
  getCleaningHistory: async (deviceId: number, limit: number = 50) => {
    const response = await api.get(`/devices/${deviceId}/cleaning-history`, {
      params: { limit }
    });
    return response.data;
  },
  
  startCleaning: async (deviceId: number, cleaningType: string = 'manual') => {
    const response = await api.post(`/devices/${deviceId}/start-cleaning`, {
      cleaning_type: cleaningType
    });
    return response.data;
  },
  
  stopCleaning: async (deviceId: number, data?: {
    status?: string;
    area_cleaned?: number;
    notes?: string;
  }) => {
    const response = await api.post(`/devices/${deviceId}/stop-cleaning`, data || {});
    return response.data;
  },
};

// Disease Detection API
export const diseaseAPI = {
  getDetections: async (deviceId: number, limit: number = 50) => {
    const response = await api.get(`/devices/${deviceId}/disease-detections`, {
      params: { limit }
    });
    return response.data;
  },
  
  addDetection: async (deviceId: number, data: {
    disease_name: string;
    confidence?: number;
    severity?: string;
    image_url?: string;
    symptoms?: string;
    recommended_treatment?: string;
    notes?: string;
  }) => {
    const response = await api.post(`/devices/${deviceId}/disease-detections`, data);
    return response.data;
  },
  
  updateDetection: async (detectionId: number, data: {
    status?: string;
    notes?: string;
  }) => {
    const response = await api.put(`/disease-detections/${detectionId}`, data);
    return response.data;
  },
};

// Fishpedia API
export const fishpediaAPI = {
  getSpecies: async (search?: string, category?: string) => {
    const response = await api.get('/fishpedia', {
      params: { search, category }
    });
    return response.data;
  },
  
  getSpeciesDetail: async (speciesId: number) => {
    const response = await api.get(`/fishpedia/${speciesId}`);
    return response.data;
  },
  
  addSpecies: async (data: any) => {
    const response = await api.post('/fishpedia', data);
    return response.data;
  },
  
  updateSpecies: async (speciesId: number, data: any) => {
    const response = await api.put(`/fishpedia/${speciesId}`, data);
    return response.data;
  },
  
  deleteSpecies: async (speciesId: number) => {
    const response = await api.delete(`/fishpedia/${speciesId}`);
    return response.data;
  },
};

// Forum API
export const forumAPI = {
  getTopics: async (category?: string, search?: string) => {
    const response = await api.get('/forum/topics', {
      params: { category, search }
    });
    return response.data;
  },
  
  getTopic: async (topicId: number) => {
    const response = await api.get(`/forum/topics/${topicId}`);
    return response.data;
  },
  
  createTopic: async (data: {
    title: string;
    content: string;
    category?: string;
  }) => {
    const response = await api.post('/forum/topics', data);
    return response.data;
  },
  
  updateTopic: async (topicId: number, data: any) => {
    const response = await api.put(`/forum/topics/${topicId}`, data);
    return response.data;
  },
  
  deleteTopic: async (topicId: number) => {
    const response = await api.delete(`/forum/topics/${topicId}`);
    return response.data;
  },
  
  addReply: async (topicId: number, content: string) => {
    const response = await api.post(`/forum/topics/${topicId}/replies`, { content });
    return response.data;
  },
  
  updateReply: async (replyId: number, content: string) => {
    const response = await api.put(`/forum/replies/${replyId}`, { content });
    return response.data;
  },
  
  deleteReply: async (replyId: number) => {
    const response = await api.delete(`/forum/replies/${replyId}`);
    return response.data;
  },
};

// Order API
export const orderAPI = {
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  
  createOrder: async (data: {
    product_name: string;
    quantity?: number;
    total_price: number;
    shipping_address?: string;
    payment_method?: string;
    notes?: string;
  }) => {
    const response = await api.post('/orders', data);
    return response.data;
  },
  
  updateOrder: async (orderId: number, data: any) => {
    const response = await api.put(`/orders/${orderId}`, data);
    return response.data;
  },
};

// Notification API
export const notificationAPI = {
  getNotifications: async (limit: number = 50, unreadOnly: boolean = false) => {
    const response = await api.get('/notifications', {
      params: { limit, unread_only: unreadOnly }
    });
    return response.data;
  },
  
  markAsRead: async (notificationId: number) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },
  
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (data: {
    name?: string;
    phone?: string;
    address?: string;
    password?: string;
  }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  
  getDiseaseTrends: async (days: number = 30) => {
    const response = await api.get('/admin/disease-trends', {
      params: { days }
    });
    return response.data;
  },
};

export default api;
