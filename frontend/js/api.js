// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// API Service
class ApiService {
    // Test API
    static async test() {
        try {
            const response = await fetch(`${API_BASE_URL}/test`);
            return await response.json();
        } catch (error) {
            console.error('API test error:', error);
            return { success: false, message: 'Cannot connect to server' };
        }
    }

    // Get all projects
    static async getProjects() {
        try {
            const response = await fetch(`${API_BASE_URL}/projects`);
            return await response.json();
        } catch (error) {
            console.error('Get projects error:', error);
            return { success: false, message: 'Cannot load projects' };
        }
    }

    // Create project
    static async createProject(projectData) {
        try {
            const response = await fetch(`${API_BASE_URL}/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectData)
            });
            return await response.json();
        } catch (error) {
            console.error('Create project error:', error);
            return { success: false, message: 'Cannot create project' };
        }
    }

    // Get all tasks
    static async getTasks(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetch(`${API_BASE_URL}/tasks?${queryParams}`);
            return await response.json();
        } catch (error) {
            console.error('Get tasks error:', error);
            return { success: false, message: 'Cannot load tasks' };
        }
    }

    // CREATE TASK - YEH IMPORTANT HAI 🎯
    static async createTask(taskData) {
        try {
            console.log('📤 Sending task to server:', taskData);
            
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });
            
            const result = await response.json();
            console.log('📥 Server response:', result);
            
            return result;
        } catch (error) {
            console.error('❌ Create task error:', error);
            return { 
                success: false, 
                message: `Cannot create task: ${error.message}`
            };
        }
    }

    // Update task
    static async updateTask(id, taskData) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });
            return await response.json();
        } catch (error) {
            console.error('Update task error:', error);
            return { success: false, message: 'Cannot update task' };
        }
    }

    // Get user profile
    static async getUserProfile() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`);
            return await response.json();
        } catch (error) {
            console.error('Get profile error:', error);
            return { success: false, message: 'Cannot load profile' };
        }
    }

    // Demo data for offline use
    static getDemoData() {
        return {
            user: {
                id: 'demo_user_id',
                firstName: 'Sidraayyy',
                lastName: 'Manager',
                email: 'sidraayyy@manager.com',
                role: 'admin',
                avatar: 'SM'
            },
            projects: [
                {
                    id: 1,
                    name: "Website Redesign",
                    category: "Web Development",
                    description: "Complete overhaul of company website",
                    status: "active",
                    progress: 75,
                    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    team: ["You", "Sarah", "Mike", "Alex"],
                    tasks: 12,
                    budget: "$15,000"
                }
            ],
            tasks: [
                {
                    id: 1,
                    title: "Design Homepage Layout",
                    description: "Create wireframes and mockups",
                    status: "todo",
                    priority: "high",
                    assignee: "You",
                    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    project: "Website Redesign"
                }
            ]
        };
    }
}

// Export API service
window.ApiService = ApiService;