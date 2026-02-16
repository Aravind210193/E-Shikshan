import api from './api';

const API_URL = '/roadmaps';

export const roadmapAPI = {
    // Get all roadmaps with optional filters
    getAll: async (params = {}) => {
        try {
            const response = await api.get(API_URL, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching roadmaps:', error);
            throw error;
        }
    },

    // Get single roadmap by ID
    getById: async (id) => {
        try {
            const response = await api.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching roadmap:', error);
            throw error;
        }
    },

    // Get all categories
    getCategories: async () => {
        try {
            const response = await api.get(`${API_URL}/categories`);
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // Get roadmap stats
    getStats: async () => {
        try {
            const response = await api.get(`${API_URL}/stats`);
            return response.data;
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    }
};

export default roadmapAPI;
