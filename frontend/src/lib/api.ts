const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown> | FormData;
  params?: Record<string, string | number | undefined>;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function buildUrl(endpoint: string, params?: Record<string, string | number | undefined>): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

async function request<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { body, params, headers: customHeaders, ...restOptions } = options;
  const token = getToken();

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(buildUrl(endpoint, params), {
    ...restOptions,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `HTTP error ${response.status}`) as Error & {
      status: number;
      data: unknown;
    };
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.json();
}

// ==================== AUTH ====================
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    request<{ user: unknown; token: string }>('/login', {
      method: 'POST',
      body: credentials,
    }),

  register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
    request<{ user: unknown; token: string }>('/register', {
      method: 'POST',
      body: data,
    }),

  logout: () =>
    request('/logout', { method: 'POST' }),

  me: () =>
    request<{ user: unknown }>('/me'),
};

// ==================== PROFILE ====================
export const profileApi = {
  show: () =>
    request<{ user: unknown; mustVerifyEmail: boolean }>('/profile'),

  update: (data: Record<string, unknown>) =>
    request('/profile', { method: 'PUT', body: data }),

  updatePassword: (data: { current_password: string; password: string; password_confirmation: string }) =>
    request('/profile/password', { method: 'PUT', body: data }),

  destroy: (data: { password: string }) =>
    request('/profile', { method: 'DELETE', body: data }),
};

// ==================== ADMIN ====================
export const adminApi = {
  dashboard: () =>
    request('/admin/dashboard'),

  // Organisasi
  organisasi: {
    list: (params?: Record<string, string | number | undefined>) =>
      request('/admin/organisasi', { params }),
    show: (id: number) =>
      request(`/admin/organisasi/${id}`),
    create: (data: Record<string, unknown>) =>
      request('/admin/organisasi', { method: 'POST', body: data }),
    update: (id: number, data: Record<string, unknown>) =>
      request(`/admin/organisasi/${id}`, { method: 'PUT', body: data }),
    destroy: (id: number) =>
      request(`/admin/organisasi/${id}`, { method: 'DELETE' }),
  },

  // Users
  users: {
    list: (params?: Record<string, string | number | undefined>) =>
      request('/admin/users', { params }),
    show: (id: number) =>
      request(`/admin/users/${id}`),
    create: (data: Record<string, unknown>) =>
      request('/admin/users', { method: 'POST', body: data }),
    update: (id: number, data: Record<string, unknown>) =>
      request(`/admin/users/${id}`, { method: 'PUT', body: data }),
    destroy: (id: number) =>
      request(`/admin/users/${id}`, { method: 'DELETE' }),
  },

  // Kegiatan
  kegiatan: {
    list: (params?: Record<string, string | number | undefined>) =>
      request('/admin/kegiatan', { params }),
  },

  // Pengumuman
  pengumuman: {
    list: (params?: Record<string, string | number | undefined>) =>
      request('/admin/pengumuman', { params }),
    show: (id: number) =>
      request(`/admin/pengumuman/${id}`),
    create: (data: Record<string, unknown>) =>
      request('/admin/pengumuman', { method: 'POST', body: data }),
    update: (id: number, data: Record<string, unknown>) =>
      request(`/admin/pengumuman/${id}`, { method: 'PUT', body: data }),
    destroy: (id: number) =>
      request(`/admin/pengumuman/${id}`, { method: 'DELETE' }),
  },
};

// ==================== PENGURUS ====================
export const pengurusApi = {
  dashboard: () =>
    request('/pengurus/dashboard'),

  // Anggota management
  anggota: {
    list: (params?: Record<string, string | number | undefined>) =>
      request('/pengurus/anggota', { params }),
    approve: (id: number) =>
      request(`/pengurus/anggota/${id}/approve`, { method: 'PUT' }),
    reject: (id: number) =>
      request(`/pengurus/anggota/${id}/reject`, { method: 'PUT' }),
    remove: (id: number) =>
      request(`/pengurus/anggota/${id}/remove`, { method: 'DELETE' }),
  },

  // Kegiatan
  kegiatan: {
    list: (params?: Record<string, string | number | undefined>) =>
      request('/pengurus/kegiatan', { params }),
    show: (id: number) =>
      request(`/pengurus/kegiatan/${id}`),
    create: (data: Record<string, unknown>) =>
      request('/pengurus/kegiatan', { method: 'POST', body: data }),
    update: (id: number, data: Record<string, unknown>) =>
      request(`/pengurus/kegiatan/${id}`, { method: 'PUT', body: data }),
    destroy: (id: number) =>
      request(`/pengurus/kegiatan/${id}`, { method: 'DELETE' }),
  },

  // Pengumuman
  pengumuman: {
    list: (params?: Record<string, string | number | undefined>) =>
      request('/pengurus/pengumuman', { params }),
    show: (id: number) =>
      request(`/pengurus/pengumuman/${id}`),
    create: (data: Record<string, unknown>) =>
      request('/pengurus/pengumuman', { method: 'POST', body: data }),
    update: (id: number, data: Record<string, unknown>) =>
      request(`/pengurus/pengumuman/${id}`, { method: 'PUT', body: data }),
    destroy: (id: number) =>
      request(`/pengurus/pengumuman/${id}`, { method: 'DELETE' }),
  },
};

// ==================== ANGGOTA ====================
export const anggotaApi = {
  dashboard: () =>
    request('/anggota/dashboard'),

  // Organisasi
  organisasi: {
    list: (params?: Record<string, string | number | undefined>) =>
      request('/anggota/organisasi', { params }),
    show: (id: number) =>
      request(`/anggota/organisasi/${id}`),
    join: (id: number) =>
      request(`/anggota/organisasi/${id}/join`, { method: 'POST' }),
    leave: (id: number) =>
      request(`/anggota/organisasi/${id}/leave`, { method: 'DELETE' }),
  },

  // Kegiatan
  kegiatan: {
    list: (params?: Record<string, string | number | undefined>) =>
      request('/anggota/kegiatan', { params }),
  },

  // Pengumuman
  pengumuman: {
    list: (params?: Record<string, string | number | undefined>) =>
      request('/anggota/pengumuman', { params }),
  },
};

// ==================== PUBLIC ====================
export const publicApi = {
  organisasi: {
    list: (params?: Record<string, string | number | undefined>) =>
      request('/organisasi', { params }),
    show: (id: number) =>
      request(`/organisasi/${id}`),
  },
};

export { getToken, API_BASE_URL };
export type { ApiResponse };
