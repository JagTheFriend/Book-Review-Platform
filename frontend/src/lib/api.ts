
const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL ?? 'https://book-review-platform-backend-9her.onrender.com';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

interface Book {
  id: string;
  name: string;
  description: string;
  author: string;
  tags: string[];
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Review {
  id: string;
  data: string;
  userId: string;
  bookId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface User {
  id: string;
  username: string;
  role: 'ADMIN' | 'USER';
  createdAt?: string;
  updatedAt?: string;
}

// Books API
export const booksApi = {
  getAll: async (skip = 0, limit = 10): Promise<ApiResponse<Book[]>> => {
    const response = await fetch(`${API_BASE_URL}/books?skip=${skip}&limit=${limit}`);
    return response.json();
  },

  getById: async (id: string): Promise<ApiResponse<Book>> => {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    return response.json();
  },

  create: async (book: Omit<Book, 'id'>): Promise<ApiResponse<Book>> => {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });
    return response.json();
  },
};

// Reviews API
export const reviewsApi = {
  getByBookId: async (bookId: string): Promise<ApiResponse<Review[]>> => {
    const response = await fetch(`${API_BASE_URL}/reviews/${bookId}`);
    return response.json();
  },

  create: async (review: Omit<Review, 'id'>): Promise<ApiResponse<Review>> => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    });
    return response.json();
  },
};

// Users API
export const usersApi = {
  getById: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    return response.json();
  },

  update: async (userId: string, user: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    return response.json();
  },
};

export type { Book, Review, User };
