import api from './api';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPostData {
  title: string;
  excerpt: string;
  content: string;
  author?: string;
  status?: 'PUBLISHED' | 'DRAFT';
}

export interface BlogListResponse {
  data: BlogPost[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export class BlogService {
  static async getBlogPosts(params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<BlogListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const response = await api.get(`/blog?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get blog posts');
    }
  }

  static async getBlogPost(id: string): Promise<BlogPost> {
    try {
      const response = await api.get(`/blog/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get blog post');
    }
  }

  static async createBlogPost(blogData: CreateBlogPostData, imageFile?: File): Promise<BlogPost> {
    try {
      const formData = new FormData();

      // Add text fields
      Object.entries(blogData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Add image file if provided
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.post('/blog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create blog post');
    }
  }

  static async updateBlogPost(id: string, blogData: Partial<CreateBlogPostData>, imageFile?: File): Promise<BlogPost> {
    try {
      const formData = new FormData();

      // Add text fields
      Object.entries(blogData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Add image file if provided
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.put(`/blog/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update blog post');
    }
  }

  static async deleteBlogPost(id: string): Promise<void> {
    try {
      await api.delete(`/blog/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete blog post');
    }
  }
}


