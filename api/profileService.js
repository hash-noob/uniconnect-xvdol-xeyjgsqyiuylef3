import axios from 'axios';
import { API_BASE_URL } from '../constants/Config';
import * as SecureStore from 'expo-secure-store';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userAuthToken');
    if (token) {
      // Make sure to include the Bearer prefix
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Profile Services
export const getStudentProfile = async () => {
  try {
    const response = await api.get('/students/profile');
    const data = response.data;

    const faculty = await api.get(`/students/mentor/${data.mentor_id}`);
    // console.log(faculty.data);
    data.mentorName = faculty.data.first_name + " " + faculty.data.last_name;
    data.mentorEmail = faculty.data.email;
    // console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching student profile:', error);
    throw error;
  }
};

// Projects Services
export const getProjects = async () => {
  try {
    const response = await api.get('/students/projects');
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const addProject = async (projectData) => {
  try {
    const response = await api.post('/students/projects', projectData);
    return response.data;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

export const updateProject = async (projectId, projectData) => {
  try {
    const response = await api.put(`/students/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(`/students/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Certifications Services
export const getCertifications = async () => {
  try {
    const response = await api.get('/students/certifications');
    return response.data;
  } catch (error) {
    console.error('Error fetching certifications:', error);
    throw error;
  }
};

export const addCertification = async (certificationData) => {
  try {
    const response = await api.post('/students/certifications', certificationData);
    return response.data;
  } catch (error) {
    console.error('Error adding certification:', error);
    throw error;
  }
};

export const updateCertification = async (certificationId, certificationData) => {
  try {
    const response = await api.put(`/students/certifications/${certificationId}`, certificationData);
    return response.data;
  } catch (error) {
    console.error('Error updating certification:', error);
    throw error;
  }
};

export const deleteCertification = async (certificationId) => {
  try {
    const response = await api.delete(`/students/certifications/${certificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting certification:', error);
    throw error;
  }
};

// Patents Services
export const getPatents = async () => {
  try {
    const response = await api.get('/students/patents');
    return response.data;
  } catch (error) {
    console.error('Error fetching patents:', error);
    throw error;
  }
};

export const addPatent = async (patentData) => {
  try {
    const response = await api.post('/students/patents', patentData);
    return response.data;
  } catch (error) {
    console.error('Error adding patent:', error);
    throw error;
  }
};

export const updatePatent = async (patentId, patentData) => {
  try {
    const response = await api.put(`/students/patents/${patentId}`, patentData);
    return response.data;
  } catch (error) {
    console.error('Error updating patent:', error);
    throw error;
  }
};

export const deletePatent = async (patentId) => {
  try {
    const response = await api.delete(`/students/patents/${patentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting patent:', error);
    throw error;
  }
};

// Activities Services
export const getActivities = async () => {
  try {
    const response = await api.get('/students/activities');
    return response.data;
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
};

export const addActivity = async (activityData) => {
  try {
    const response = await api.post('/students/activities', activityData);
    return response.data;
  } catch (error) {
    console.error('Error adding activity:', error);
    throw error;
  }
};

export const updateActivity = async (activityId, activityData) => {
  try {
    const response = await api.put(`/students/activities/${activityId}`, activityData);
    return response.data;
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
};

export const deleteActivity = async (activityId) => {
  try {
    const response = await api.delete(`/students/activities/${activityId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
}; 