// API Configuration
// Centralized configuration for API endpoints

const PROD_API_URL = 'http://13.201.16.207/api'; // AWS EC2 (Production)
const DEV_API_URL = 'http://localhost:5002/api'; // Local Development

// Change this to switch between environments
// In a real app, this would likely use process.env.NEXT_PUBLIC_API_URL
const API_BASE_URL = PROD_API_URL;

export default API_BASE_URL;
export const SOCKET_URL = API_BASE_URL.replace('/api', ''); // Base URL for Socket.io
