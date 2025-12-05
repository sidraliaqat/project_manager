// Dashboard Application
class Dashboard {
    constructor() {
        this.user = null;
        this.tasks = [];
        this.projects = [];
        this.activities = [];
        this.deadlines = [];
        this.currentTheme = 'light';
        this.apiService = window.ApiService;
        this.init();
    }
    
    async init() {
        await this.loadDataFromAPI();
        this.loadUserData();
        this.setupEventListeners();
        this.updateStats();
        this.renderAll();
    }
    
    // Get default user if API fails
    getDefaultUser() {
        return {
            firstName: 'Sidraayyy',
            lastName: 'Manager',
            email: 'sidraayyy@manager.com',
            role: 'Project Manager',
            bio: 'Experienced project manager with expertise in web development projects.',
            avatar: 'SM'
        };
    }
    
    async loadDataFromAPI() {
        try {
            console.log('Loading data from API...');
            
            // Try to load from API
            const [projectsRes, tasksRes, userRes] = await Promise.all([
                this.apiService.getProjects(),
                this.apiService.getTasks(),
                this.apiService.getUserProfile()
            ]);

            if (projectsRes && projectsRes.success) {
                this.projects = projectsRes.data || [];
                console.log('Projects loaded from API:', this.projects.length);
            }

            if (tasksRes && tasksRes.success) {
                this.tasks = tasksRes.data || [];
                console.log('Tasks loaded from API:', this.tasks.length);
            }

            if (userRes && userRes.success) {
                this.user = userRes.data || this.getDefaultUser();
                console.log('User loaded from API');
            }

            // If API fails or returns no data, use demo data
            if (!projectsRes || !projectsRes.success || this.projects.length === 0) {
                console.log('Using demo projects data');
                this.loadDemoProjects();
            }

            if (!tasksRes || !tasksRes.success || this.tasks.length === 0) {
                console.log('Using demo tasks data');
                this.loadDemoTasks();
            }

            if (!userRes || !userRes.success || !this.user) {
                console.log('Using demo user data');
                this.user = this.getDefaultUser();
            }

        } catch (error) {
            console.error('Error loading from API:', error);
            // Use demo data as fallback
            console.log('Falling back to demo data');
            this.user = this.getDefaultUser();
            this.loadDemoProjects();
            this.loadDemoTasks();
        }

        // Load other data
        this.loadDeadlines();
        this.loadActivities();
    }
    
    loadDemoProjects() {
        this.projects = [
            {
                id: 1,
                name: "Website Redesign",
                category: "Web Development",
                description: "Complete overhaul of company website with modern design and improved UX",
                status: "active",
                progress: 75,
                startDate: this.getDateString(-30),
                deadline: this.getDateString(30),
                team: ["You", "Sarah", "Mike", "Alex"],
                tasks: 12,
                budget: "$15,000"
            },
            {
                id: 2,
                name: "Mobile App Development",
                category: "Mobile",
                description: "Build cross-platform mobile application for iOS and Android",
                status: "planning",
                progress: 20,
                startDate: this.getDateString(-10),
                deadline: this.getDateString(60),
                team: ["You", "John", "Emma", "Sarah", "Mike"],
                tasks: 8,
                budget: "$25,000"
            },
            {
                id: 3,
                name: "Marketing Campaign Q3",
                category: "Marketing",
                description: "Social media and email marketing campaign for Q3 products",
                status: "active",
                progress: 45,
                startDate: this.getDateString(-15),
                deadline: this.getDateString(45),
                team: ["You", "Lisa", "David"],
                tasks: 5,
                budget: "$8,000"
            },
            {
                id: 4,
                name: "Internal Training Portal",
                category: "HR",
                description: "Development of employee training and onboarding portal",
                status: "on-hold",
                progress: 30,
                startDate: this.getDateString(-20),
                deadline: this.getDateString(90),
                team: ["You", "Tom", "Sarah", "Mike", "Emma"],
                tasks: 7,
                budget: "$12,000"
            }
        ];
    }
    
    loadDemoTasks() {
        this.tasks = [
            {
                id: 1,
                title: "Design Homepage Layout",
                description: "Create wireframes and mockups for new homepage design",
                status: "todo",
                priority: "high",
                assignee: "You",
                deadline: this.getDateString(2),
                project: "Website Redesign"
            },
            {
                id: 2,
                title: "API Integration",
                description: "Integrate payment gateway API for checkout system",
                status: "progress",
                priority: "high",
                assignee: "Mike",
                deadline: this.getDateString(5),
                project: "E-commerce Platform"
            },
            {
                id: 3,
                title: "Write Documentation",
                description: "Document API endpoints and usage guidelines",
                status: "todo",
                priority: "medium",
                assignee: "Sarah",
                deadline: this.getDateString(7),
                project: "Mobile App"
            },
            {
                id: 4,
                title: "User Testing",
                description: "Conduct usability tests with focus group",
                status: "progress",
                priority: "medium",
                assignee: "You",
                deadline: this.getDateString(1),
                project: "Website Redesign"
            },
            {
                id: 5,
                title: "Fix Login Bug",
                description: "Investigate and fix authentication issue on mobile",
                status: "todo",
                priority: "high",
                assignee: "Alex",
                deadline: this.getDateString(0),
                project: "Mobile App"
            },
            {
                id: 6,
                title: "Performance Optimization",
                description: "Optimize database queries for faster loading",
                status: "progress",
                priority: "medium",
                assignee: "You",
                deadline: this.getDateString(10),
                project: "Backend System"
            },
            {
                id: 7,
                title: "Content Migration",
                description: "Migrate blog content to new CMS",
                status: "progress",
                priority: "low",
                assignee: "Emma",
                deadline: this.getDateString(15),
                project: "Content Management"
            },
            {
                id: 8,
                title: "Setup CI/CD Pipeline",
                description: "Configure continuous integration and deployment",
                status: "done",
                priority: "high",
                assignee: "You",
                deadline: this.getDateString(-5),
                project: "DevOps"
            },
            {
                id: 9,
                title: "Team Meeting",
                description: "Weekly team sync and planning",
                status: "done",
                priority: "medium",
                assignee: "Everyone",
                deadline: this.getDateString(-2),
                project: "Team Management"
            },
            {
                id: 10,
                title: "Budget Planning",
                description: "Prepare budget report for next quarter",
                status: "done",
                priority: "medium",
                assignee: "You",
                deadline: this.getDateString(-3),
                project: "Finance"
            }
        ];
    }
    
    loadUserData() {
        // If user not loaded, use default
        if (!this.user) {
            this.user = this.getDefaultUser();
        }
        
        // Update UI elements
        const userInitials = this.user.firstName.charAt(0) + this.user.lastName.charAt(0);
        document.getElementById('userAvatar').textContent = userInitials;
        document.getElementById('userName').textContent = `${this.user.firstName} ${this.user.lastName}`;
        document.getElementById('userRole').textContent = this.user.role;
        document.getElementById('welcomeMessage').textContent = `Welcome, ${this.user.firstName}!`;
        document.getElementById('dropdownAvatar').textContent = userInitials;
        document.getElementById('dropdownName').textContent = `${this.user.firstName} ${this.user.lastName}`;
        document.getElementById('dropdownEmail').textContent = this.user.email;
    }
    
    loadDeadlines() {
        // Extract deadlines from tasks and projects
        this.deadlines = [];
        
        // Add task deadlines
        this.tasks.forEach(task => {
            this.deadlines.push({
                type: 'task',
                title: task.title,
                project: task.project,
                deadline: task.deadline || task.dueDate,
                assignee: task.assignee,
                priority: task.priority
            });
        });
        
        // Add project deadlines
        this.projects.forEach(project => {
            this.deadlines.push({
                type: 'project',
                title: project.name,
                project: project.category,
                deadline: project.deadline,
                status: project.status
            });
        });
        
        // Sort by deadline
        this.deadlines.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }
    
    loadActivities() {
        // Sample activity data
        this.activities = [
            {
                id: 1,
                type: "project",
                action: "created",
                title: "Website Redesign",
                user: "You",
                time: "2 hours ago"
            },
            {
                id: 2,
                type: "task",
                action: "completed",
                title: "Homepage wireframe",
                user: "Sarah Smith",
                time: "5 hours ago"
            },
            {
                id: 3,
                type: "comment",
                action: "added",
                title: "Mobile App project",
                user: "Mike Johnson",
                time: "1 day ago"
            },
            {
                id: 4,
                type: "milestone",
                action: "reached",
                title: "Project Alpha",
                user: "Team",
                time: "2 days ago"
            },
            {
                id: 5,
                type: "meeting",
                action: "scheduled",
                title: "Sprint Planning",
                user: "You",
                time: "3 days ago"
            }
        ];
    }
    
    renderAll() {
        this.renderTasks();
        this.renderProjects();
        this.renderDeadlines();
        this.renderActivities();
    }
    
    renderTasks() {
        const todoList = document.getElementById('todoList');
        const progressList = document.getElementById('inProgressList');
        const doneList = document.getElementById('doneList');
        
        todoList.innerHTML = '';
        progressList.innerHTML = '';
        doneList.innerHTML = '';
        
        // Map API status to local status
        const todoTasks = this.tasks.filter(task => {
            const status = task.status || task.state;
            return status === 'todo' || status === 'pending' || status === 'open';
        });
        
        const progressTasks = this.tasks.filter(task => {
            const status = task.status || task.state;
            return status === 'progress' || status === 'in-progress' || status === 'inprogress' || status === 'active';
        });
        
        const doneTasks = this.tasks.filter(task => {
            const status = task.status || task.state;
            return status === 'done' || status === 'completed' || status === 'closed';
        });
        
        // Update counts
        document.getElementById('todoCount').textContent = todoTasks.length;
        document.getElementById('inProgressCount').textContent = progressTasks.length;
        document.getElementById('doneCount').textContent = doneTasks.length;
        document.getElementById('todoBadge').textContent = todoTasks.length;
        document.getElementById('progressBadge').textContent = progressTasks.length;
        document.getElementById('doneBadge').textContent = doneTasks.length;
        document.getElementById('tasksCount').textContent = this.tasks.length;
        
        // Update pending tasks count
        document.getElementById('pendingTasksCount').textContent = todoTasks.length + progressTasks.length;
        
        // Render tasks
        if (todoTasks.length === 0) {
            todoList.innerHTML = this.getEmptyTasksHTML('todo');
        } else {
            todoTasks.forEach(task => {
                todoList.appendChild(this.createTaskElement(task));
            });
        }
        
        if (progressTasks.length === 0) {
            progressList.innerHTML = this.getEmptyTasksHTML('progress');
        } else {
            progressTasks.forEach(task => {
                progressList.appendChild(this.createTaskElement(task));
            });
        }
        
        if (doneTasks.length === 0) {
            doneList.innerHTML = this.getEmptyTasksHTML('done');
        } else {
            doneTasks.forEach(task => {
                doneList.appendChild(this.createTaskElement(task));
            });
        }
    }
    
    createTaskElement(task) {
        const element = document.createElement('div');
        element.className = 'task-item';
        element.dataset.id = task.id || task._id;
        
        const priority = task.priority || 'medium';
        const priorityClass = `priority-${priority}`;
        
        // Get assignee name
        let assigneeName = 'Unassigned';
        let assigneeInitials = 'NA';
        
        if (task.assignee) {
            if (typeof task.assignee === 'object' && task.assignee.firstName) {
                assigneeName = `${task.assignee.firstName} ${task.assignee.lastName}`;
                assigneeInitials = task.assignee.firstName.charAt(0) + task.assignee.lastName.charAt(0);
            } else if (task.assignee === 'You' || task.assignee === 'Me') {
                assigneeName = 'You';
                assigneeInitials = 'ME';
            } else {
                assigneeName = task.assignee;
                assigneeInitials = task.assignee.charAt(0).toUpperCase();
            }
        }
        
        const deadline = task.deadline || task.dueDate;
        const isOverdue = deadline && new Date(deadline) < new Date();
        
        element.innerHTML = `
            <div class="task-header">
                <div class="task-title">${task.title}</div>
                <div class="task-priority ${priorityClass}">${priority}</div>
            </div>
            <div class="task-description">${task.description || 'No description'}</div>
            <div class="task-footer">
                <div class="task-assignee">
                    <div class="assignee-avatar">${assigneeInitials}</div>
                    <span>${assigneeName}</span>
                </div>
                ${deadline ? `
                <div class="task-deadline ${isOverdue ? 'overdue' : ''}">
                    <i class="far fa-calendar-alt"></i>
                    <span>${this.formatDate(deadline)}${isOverdue ? ' (Overdue)' : ''}</span>
                </div>
                ` : ''}
            </div>
        `;
        
        element.addEventListener('click', () => this.editTask(task.id || task._id));
        return element;
    }
    
    getEmptyTasksHTML(type) {
        const icons = {
            'todo': 'fas fa-clipboard-list',
            'progress': 'fas fa-spinner',
            'done': 'fas fa-check-circle'
        };
        
        const messages = {
            'todo': 'No tasks to do',
            'progress': 'No tasks in progress',
            'done': 'No completed tasks'
        };
        
        return `
            <div class="empty-tasks">
                <i class="${icons[type]}"></i>
                <p>${messages[type]}</p>
            </div>
        `;
    }
    
    renderProjects() {
        const projectsGrid = document.getElementById('projectsGrid');
        projectsGrid.innerHTML = '';
        
        this.projects.forEach(project => {
            projectsGrid.appendChild(this.createProjectElement(project));
        });
        
        // Update counts
        document.getElementById('projectsCount').textContent = this.projects.length;
        document.getElementById('totalProjects').textContent = this.projects.length;
    }
    
    createProjectElement(project) {
        const element = document.createElement('div');
        element.className = 'project-card';
        element.dataset.id = project.id || project._id;
        
        const status = project.status || 'planning';
        const statusClass = `status-${status}`;
        const progress = project.progress || project.calculatedProgress || 0;
        const deadline = project.deadline;
        const overdue = deadline && new Date(deadline) < new Date();
        
        element.innerHTML = `
            <div class="project-header">
                <div class="project-title">
                    <div class="project-name">
                        <h3>${project.name}</h3>
                        <div class="project-category">${project.category || 'Uncategorized'}</div>
                    </div>
                    <span class="project-status ${statusClass}">${status}</span>
                </div>
                <p class="project-description">${project.description || 'No description'}</p>
                
                <div class="project-progress">
                    <div class="progress-label">
                        <span>Progress</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="project-footer">
                <div class="project-meta">
                    ${deadline ? `
                    <div class="meta-item">
                        <i class="far fa-calendar-alt"></i>
                        <span class="${overdue ? 'error' : ''}">${this.formatDate(deadline)}</span>
                    </div>
                    ` : ''}
                    <div class="meta-item">
                        <i class="fas fa-users"></i>
                        <span>${project.team ? project.team.length : 1} members</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-tasks"></i>
                        <span>${project.tasks || 0} tasks</span>
                    </div>
                </div>
                
                <div class="project-actions">
                    <button class="action-icon" onclick="dashboard.editProject('${project.id || project._id}'); event.stopPropagation();">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-icon" onclick="dashboard.viewProject('${project.id || project._id}'); event.stopPropagation();">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `;
        
        element.addEventListener('click', (e) => {
            if (!e.target.closest('.project-actions')) {
                this.viewProject(project.id || project._id);
            }
        });
        
        return element;
    }
    
    renderDeadlines() {
        const deadlinesList = document.getElementById('deadlinesList');
        deadlinesList.innerHTML = '';
        
        // Get upcoming deadlines (next 7 days)
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const upcomingDeadlines = this.deadlines.filter(d => {
            if (!d.deadline) return false;
            const deadline = new Date(d.deadline);
            return deadline >= today && deadline <= nextWeek;
        });
        
        // Update counts
        document.getElementById('deadlineBadge').textContent = upcomingDeadlines.length;
        document.getElementById('upcomingDeadlines').textContent = upcomingDeadlines.length;
        
        if (upcomingDeadlines.length === 0) {
            deadlinesList.innerHTML = `
                <div class="deadline-item">
                    <div class="deadline-icon">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="deadline-content">
                        <div class="deadline-title">No upcoming deadlines</div>
                        <div class="deadline-time">You're all caught up!</div>
                    </div>
                </div>
            `;
        } else {
            upcomingDeadlines.slice(0, 5).forEach(deadline => {
                deadlinesList.appendChild(this.createDeadlineElement(deadline));
            });
        }
    }
    
    createDeadlineElement(deadline) {
        const element = document.createElement('div');
        element.className = 'deadline-item';
        
        const isOverdue = deadline.deadline && new Date(deadline.deadline) < new Date();
        const icon = deadline.type === 'task' ? 'fas fa-tasks' : 'fas fa-project-diagram';
        
        element.innerHTML = `
            <div class="deadline-icon">
                <i class="${icon}"></i>
            </div>
            <div class="deadline-content">
                <div class="deadline-title">${deadline.title}</div>
                <div class="deadline-project">${deadline.project || 'General'}</div>
                ${deadline.deadline ? `
                <div class="deadline-time ${isOverdue ? 'overdue' : ''}">
                    <i class="far fa-clock"></i>
                    ${this.formatDate(deadline.deadline)}${isOverdue ? ' (Overdue)' : ''}
                </div>
                ` : ''}
            </div>
        `;
        
        return element;
    }
    
    renderActivities() {
        const activityList = document.getElementById('activityList');
        activityList.innerHTML = '';
        
        this.activities.forEach(activity => {
            activityList.appendChild(this.createActivityElement(activity));
        });
    }
    
    createActivityElement(activity) {
        const element = document.createElement('div');
        element.className = 'activity-item';
        
        let iconClass = 'fas fa-plus';
        if (activity.type === 'task') iconClass = 'fas fa-check';
        if (activity.type === 'comment') iconClass = 'fas fa-comment';
        if (activity.type === 'milestone') iconClass = 'fas fa-flag';
        if (activity.type === 'meeting') iconClass = 'fas fa-calendar-alt';
        
        element.innerHTML = `
            <div class="activity-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-text">
                    <strong>${activity.user}</strong> ${activity.action} "${activity.title}"
                </div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `;
        
        return element;
    }
    
    updateStats() {
        const todoTasks = this.tasks.filter(task => {
            const status = task.status || task.state;
            return status === 'todo' || status === 'pending' || status === 'open';
        });
        
        const progressTasks = this.tasks.filter(task => {
            const status = task.status || task.state;
            return status === 'progress' || status === 'in-progress' || status === 'inprogress' || status === 'active';
        });
        
        const doneTasks = this.tasks.filter(task => {
            const status = task.status || task.state;
            return status === 'done' || status === 'completed' || status === 'closed';
        });
        
        const overdueTasks = this.tasks.filter(task => {
            const deadline = task.deadline || task.dueDate;
            if (!deadline) return false;
            const status = task.status || task.state;
            return new Date(deadline) < new Date() && 
                   !(status === 'done' || status === 'completed' || status === 'closed');
        });
        
        const upcomingDeadlines = this.deadlines.filter(d => {
            if (!d.deadline) return false;
            const deadline = new Date(d.deadline);
            const today = new Date();
            const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            return deadline >= today && deadline <= nextWeek;
        });
        
        // Update all stats
        document.getElementById('overdueTasks').textContent = overdueTasks.length;
        document.getElementById('completedTasks').textContent = doneTasks.length;
        
        // Get team members count from all projects
        const allTeamMembers = new Set();
        this.projects.forEach(project => {
            if (project.team && Array.isArray(project.team)) {
                project.team.forEach(member => {
                    if (typeof member === 'object' && member.user) {
                        allTeamMembers.add(member.user);
                    } else if (typeof member === 'string') {
                        allTeamMembers.add(member);
                    } else {
                        allTeamMembers.add(member);
                    }
                });
            }
        });
        document.getElementById('teamMembers').textContent = allTeamMembers.size;
        
        // Update upcoming count in sidebar
        document.getElementById('upcomingCount').textContent = upcomingDeadlines.length;
    }
    
    setupEventListeners() {
        // Header actions
        document.getElementById('goHome')?.addEventListener('click', () => this.showDashboard());
        document.getElementById('searchBtn')?.addEventListener('click', () => this.openSearch());
        document.getElementById('notificationsBtn')?.addEventListener('click', () => this.openNotifications());
        document.getElementById('quickAddBtn')?.addEventListener('click', () => this.quickAdd());
        
        // User dropdown
        document.getElementById('userProfile')?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('userDropdown').classList.toggle('active');
        });
        
        document.addEventListener('click', () => {
            const dropdown = document.getElementById('userDropdown');
            if (dropdown) dropdown.classList.remove('active');
        });
        
        // Dropdown actions
        document.getElementById('profileBtn')?.addEventListener('click', () => this.openProfile());
        document.getElementById('settingsBtn')?.addEventListener('click', () => this.openSettings());
        document.getElementById('notificationsSettingsBtn')?.addEventListener('click', () => this.openNotificationSettings());
        document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());
        document.getElementById('helpBtn')?.addEventListener('click', () => this.openHelp());
        document.getElementById('exportDataBtn')?.addEventListener('click', () => this.exportData());
        
        // Sidebar navigation
        document.getElementById('dashboardBtn')?.addEventListener('click', () => this.showDashboard());
        document.getElementById('projectsBtn')?.addEventListener('click', () => this.showProjects());
        document.getElementById('tasksBtn')?.addEventListener('click', () => this.showTasks());
        document.getElementById('teamBtn')?.addEventListener('click', () => this.showTeam());
        document.getElementById('calendarBtn')?.addEventListener('click', () => this.openCalendar());
        document.getElementById('addProjectBtn')?.addEventListener('click', () => this.openAddProjectModal());
        document.getElementById('addTaskBtn')?.addEventListener('click', () => this.openAddTaskModal());
        document.getElementById('analyticsBtn')?.addEventListener('click', () => this.openAnalytics());
        document.getElementById('todoBtn')?.addEventListener('click', () => this.filterTasks('todo'));
        document.getElementById('progressBtn')?.addEventListener('click', () => this.filterTasks('progress'));
        document.getElementById('doneBtn')?.addEventListener('click', () => this.filterTasks('done'));
        document.getElementById('deadlinesBtn')?.addEventListener('click', () => this.showDeadlines());
        document.getElementById('profileSideBtn')?.addEventListener('click', () => this.openProfile());
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportData());
        
        // Main content buttons
        document.getElementById('newProjectBtn')?.addEventListener('click', () => this.openAddProjectModal());
        document.getElementById('createProjectBtn')?.addEventListener('click', () => this.openAddProjectModal());
        document.getElementById('addTaskMainBtn')?.addEventListener('click', () => this.openAddTaskModal());
        document.getElementById('filterProjectsBtn')?.addEventListener('click', () => this.filterProjects());
        document.getElementById('viewCalendarBtn')?.addEventListener('click', () => this.openCalendar());
        document.getElementById('viewAllActivityBtn')?.addEventListener('click', () => this.viewAllActivity());
        
        // Task filters
        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterTasks(e.target.dataset.filter);
            });
        });
        
        // Stat cards
        document.getElementById('totalProjectsCard')?.addEventListener('click', () => this.showProjects());
        document.getElementById('completedTasksCard')?.addEventListener('click', () => this.filterTasks('done'));
        document.getElementById('teamMembersCard')?.addEventListener('click', () => this.showTeam());
        document.getElementById('overdueCard')?.addEventListener('click', () => this.filterOverdueTasks());
        
        // Modal events
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.remove('active');
                });
            });
        });
        
        // Save project
        document.getElementById('saveProjectBtn')?.addEventListener('click', () => this.saveProject());
        
        // Save task
        document.getElementById('saveTaskBtn')?.addEventListener('click', () => this.saveTask());
        
        // Save profile
        document.getElementById('saveProfileBtn')?.addEventListener('click', () => this.saveProfile());
        
        // Change avatar
        document.getElementById('changeAvatarBtn')?.addEventListener('click', () => this.changeAvatar());
        
        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }
    
    // Modal Functions
    openAddProjectModal() {
        const modal = document.getElementById('addProjectModal');
        if (!modal) return;
        
        modal.classList.add('active');
        
        // Set default dates
        const today = new Date();
        const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        
        const startDateInput = document.getElementById('projectStartDate');
        const deadlineInput = document.getElementById('projectDeadline');
        
        if (startDateInput) startDateInput.value = today.toISOString().split('T')[0];
        if (deadlineInput) deadlineInput.value = nextMonth.toISOString().split('T')[0];
        
        // Clear form
        const form = document.getElementById('projectForm');
        if (form) form.reset();
    }
    
    openAddTaskModal() {
        const modal = document.getElementById('addTaskModal');
        if (!modal) return;
        
        modal.classList.add('active');
        
        // Set default date (tomorrow)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const deadlineInput = document.getElementById('taskDeadline');
        if (deadlineInput) deadlineInput.value = tomorrow.toISOString().split('T')[0];
        
        // Populate projects dropdown
        const projectSelect = document.getElementById('taskProject');
        if (projectSelect) {
            projectSelect.innerHTML = '<option value="">Select Project</option>';
            this.projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.id || project._id;
                option.textContent = project.name;
                projectSelect.appendChild(option);
            });
        }
        
        // Clear form
        const form = document.getElementById('taskForm');
        if (form) form.reset();
    }
    
    openProfile() {
        const modal = document.getElementById('profileModal');
        if (!modal) return;
        
        modal.classList.add('active');
        
        // Populate form with user data
        document.getElementById('firstName').value = this.user.firstName;
        document.getElementById('lastName').value = this.user.lastName;
        document.getElementById('email').value = this.user.email;
        document.getElementById('role').value = this.user.role;
        document.getElementById('bio').value = this.user.bio || '';
        
        // Update avatar in modal
        const profileAvatar = document.getElementById('profileAvatar');
        if (profileAvatar) {
            profileAvatar.textContent = this.user.firstName.charAt(0) + this.user.lastName.charAt(0);
        }
    }
    
    async saveProject() {
        const projectName = document.getElementById('projectName').value;
        const description = document.getElementById('projectDescription').value;
        const startDate = document.getElementById('projectStartDate').value;
        const deadline = document.getElementById('projectDeadline').value;
        const status = document.getElementById('projectStatus').value;
        const team = document.getElementById('projectTeam')?.value.split(',').map(t => t.trim()).filter(t => t) || [];
        
        if (!projectName) {
            alert('Please enter project name');
            return;
        }
        
        const projectData = {
            name: projectName,
            description: description,
            category: 'custom',
            startDate: startDate,
            deadline: deadline,
            status: status,
            budget: 0
        };
        
        try {
            const result = await this.apiService.createProject(projectData);
            
            if (result.success) {
                // Close modal
                document.getElementById('addProjectModal').classList.remove('active');
                
                // Reload data from API
                await this.loadDataFromAPI();
                this.renderAll();
                this.updateStats();
                
                alert(`Project "${projectName}" created successfully!`);
            } else {
                alert(`Error: ${result.message || 'Failed to create project'}`);
                
                // If API fails, add locally
                const newProject = {
                    id: Date.now(), // Temporary ID
                    name: projectName,
                    category: 'Custom',
                    description: description,
                    status: status,
                    progress: status === 'active' ? 10 : 0,
                    startDate: startDate,
                    deadline: deadline,
                    team: team.length > 0 ? team : ['You'],
                    tasks: 0,
                    budget: '$0'
                };
                
                this.projects.push(newProject);
                
                // Add activity
                this.activities.unshift({
                    id: this.activities.length + 1,
                    type: 'project',
                    action: 'created',
                    title: projectName,
                    user: 'You',
                    time: 'Just now'
                });
                
                // Close modal
                document.getElementById('addProjectModal').classList.remove('active');
                
                // Update UI
                this.renderAll();
                this.updateStats();
                
                alert(`Project "${projectName}" created locally (API unavailable)!`);
            }
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Error saving project. Please try again.');
        }
    }
    
    async saveTask() {
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const projectId = document.getElementById('taskProject').value;
        const priority = document.getElementById('taskPriority').value;
        const assignee = document.getElementById('taskAssignee').value;
        const dueDate = document.getElementById('taskDeadline').value;
        const status = document.getElementById('taskStatus').value;
        
        if (!title) {
            alert('Please enter task title');
            return;
        }
        
        if (!projectId) {
            alert('Please select a project');
            return;
        }
        
        const taskData = {
            title: title,
            description: description,
            project: projectId,
            priority: priority,
            assignee: assignee || 'You',
            dueDate: dueDate,
            status: status
        };
        
        try {
            const result = await this.apiService.createTask(taskData);
            
            if (result.success) {
                // Close modal
                document.getElementById('addTaskModal').classList.remove('active');
                
                // Reload data from API
                await this.loadDataFromAPI();
                this.renderAll();
                this.updateStats();
                
                alert('Task created successfully!');
            } else {
                alert(`Error: ${result.message || 'Failed to create task'}`);
                
                // If API fails, add locally
                const project = this.projects.find(p => (p.id || p._id) == projectId);
                const newTask = {
                    id: Date.now(), // Temporary ID
                    title: title,
                    description: description,
                    status: status,
                    priority: priority,
                    assignee: assignee || 'You',
                    deadline: dueDate,
                    project: project ? project.name : 'Unknown'
                };
                
                this.tasks.push(newTask);
                
                // Add activity
                this.activities.unshift({
                    id: this.activities.length + 1,
                    type: 'task',
                    action: 'created',
                    title: title,
                    user: 'You',
                    time: 'Just now'
                });
                
                // Close modal
                document.getElementById('addTaskModal').classList.remove('active');
                
                // Update UI
                this.renderAll();
                this.updateStats();
                
                alert('Task created locally (API unavailable)!');
            }
        } catch (error) {
            console.error('Error saving task:', error);
            alert('Error saving task. Please try again.');
        }
    }
    
    async saveProfile() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const role = document.getElementById('role').value;
        const bio = document.getElementById('bio').value;
        
        // Update user data
        this.user.firstName = firstName;
        this.user.lastName = lastName;
        this.user.email = email;
        this.user.role = role;
        this.user.bio = bio;
        
        try {
            const result = await this.apiService.updateUserProfile({
                firstName,
                lastName,
                email,
                role,
                bio
            });
            
            if (result.success) {
                // Update UI
                this.updateUserUI();
                
                // Close modal
                document.getElementById('profileModal').classList.remove('active');
                
                alert('Profile updated successfully!');
            } else {
                // Update UI even if API fails
                this.updateUserUI();
                
                // Close modal
                document.getElementById('profileModal').classList.remove('active');
                
                alert('Profile updated locally (API unavailable)!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            
            // Update UI anyway
            this.updateUserUI();
            
            // Close modal
            document.getElementById('profileModal').classList.remove('active');
            
            alert('Profile updated!');
        }
    }
    
    updateUserUI() {
        const userInitials = this.user.firstName.charAt(0) + this.user.lastName.charAt(0);
        
        document.getElementById('userName').textContent = `${this.user.firstName} ${this.user.lastName}`;
        document.getElementById('userRole').textContent = this.user.role;
        document.getElementById('welcomeMessage').textContent = `Welcome, ${this.user.firstName}!`;
        document.getElementById('dropdownName').textContent = `${this.user.firstName} ${this.user.lastName}`;
        document.getElementById('dropdownEmail').textContent = this.user.email;
        document.getElementById('profileAvatar').textContent = userInitials;
        document.getElementById('userAvatar').textContent = userInitials;
        document.getElementById('dropdownAvatar').textContent = userInitials;
    }
    
    changeAvatar() {
        const colors = [
            'linear-gradient(135deg, var(--peach-fuzz), var(--sauterne))',
            'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            'linear-gradient(135deg, var(--accent), var(--brandied-apricot))',
            'linear-gradient(135deg, #6c63ff, #4a44c8)',
            'linear-gradient(135deg, #10b981, #059669)'
        ];
        
        const profileAvatar = document.getElementById('profileAvatar');
        const userAvatar = document.getElementById('userAvatar');
        const dropdownAvatar = document.getElementById('dropdownAvatar');
        
        if (!profileAvatar || !userAvatar || !dropdownAvatar) return;
        
        const currentBg = profileAvatar.style.background;
        let nextIndex = 0;
        
        if (currentBg) {
            const currentIndex = colors.indexOf(currentBg);
            nextIndex = (currentIndex + 1) % colors.length;
        }
        
        profileAvatar.style.background = colors[nextIndex];
        userAvatar.style.background = colors[nextIndex];
        dropdownAvatar.style.background = colors[nextIndex];
    }
    
    // Action Methods
    showDashboard() {
        this.highlightNav('dashboardBtn');
        // Already on dashboard
    }
    
    showProjects() {
        this.highlightNav('projectsBtn');
        // Scroll to projects section
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            projectsGrid.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    showTasks() {
        this.highlightNav('tasksBtn');
        // Scroll to tasks section
        const tasksSection = document.querySelector('.tasks-section');
        if (tasksSection) {
            tasksSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    showTeam() {
        this.highlightNav('teamBtn');
        alert('Team management page would open here!');
    }
    
    filterTasks(filter) {
        const taskColumns = document.querySelectorAll('.tasks-column');
        if (taskColumns.length < 3) return;
        
        taskColumns.forEach(col => {
            col.style.display = 'block';
        });
        
        if (filter === 'todo') {
            taskColumns[1].style.display = 'none';
            taskColumns[2].style.display = 'none';
        } else if (filter === 'progress') {
            taskColumns[0].style.display = 'none';
            taskColumns[2].style.display = 'none';
        } else if (filter === 'done') {
            taskColumns[0].style.display = 'none';
            taskColumns[1].style.display = 'none';
        }
    }
    
    filterOverdueTasks() {
        const overdueTasks = this.tasks.filter(task => {
            const deadline = task.deadline || task.dueDate;
            if (!deadline) return false;
            const status = task.status || task.state;
            return new Date(deadline) < new Date() && 
                   !(status === 'done' || status === 'completed' || status === 'closed');
        });
        
        if (overdueTasks.length === 0) {
            alert('No overdue tasks! 🎉');
        } else {
            const taskList = overdueTasks.map(task => 
                `• ${task.title} (Due: ${this.formatDate(task.deadline || task.dueDate)})`
            ).join('\n');
            
            alert(`You have ${overdueTasks.length} overdue tasks:\n\n${taskList}`);
        }
    }
    
    showDeadlines() {
        this.highlightNav('deadlinesBtn');
        // Scroll to deadlines section
        const deadlinesList = document.querySelector('.deadlines-list');
        if (deadlinesList) {
            deadlinesList.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    openSearch() {
        const searchTerm = prompt('Search for projects, tasks, or team members:');
        if (searchTerm) {
            const results = [];
            
            // Search in tasks
            this.tasks.forEach(task => {
                if (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))) {
                    results.push(`Task: ${task.title}`);
                }
            });
            
            // Search in projects
            this.projects.forEach(project => {
                if (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))) {
                    results.push(`Project: ${project.name}`);
                }
            });
            
            if (results.length > 0) {
                alert(`Found ${results.length} results:\n\n${results.join('\n')}`);
            } else {
                alert('No results found');
            }
        }
    }
    
    openNotifications() {
        alert('Notifications:\n\n• Task "Design Homepage" is due tomorrow\n• New comment on "Mobile App" project\n• Team meeting at 3 PM today');
    }
    
    quickAdd() {
        const options = ['New Task', 'New Project', 'New Deadline'];
        const choice = prompt(`Quick Add:\n1. ${options.join('\n2. ')}`);
        
        if (choice === '1' || choice === 'New Task') {
            this.openAddTaskModal();
        } else if (choice === '2' || choice === 'New Project') {
            this.openAddProjectModal();
        } else if (choice) {
            alert(`Adding: ${choice}`);
        }
    }
    
    openSettings() {
        alert('Settings page would open here!');
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.classList.remove('active');
    }
    
    openNotificationSettings() {
        alert('Notification settings would open here!');
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.classList.remove('active');
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        const themeStatus = document.getElementById('themeStatus');
        if (themeStatus) {
            themeStatus.textContent = this.currentTheme === 'dark' ? 'ON' : 'OFF';
        }
        
        if (this.currentTheme === 'dark') {
            document.documentElement.style.setProperty('--background', '#1a1a2e');
            document.documentElement.style.setProperty('--card', '#16213e');
            document.documentElement.style.setProperty('--text', '#e6e6e6');
            document.documentElement.style.setProperty('--text-light', '#a0aec0');
            document.documentElement.style.setProperty('--border', '#2d3748');
        } else {
            document.documentElement.style.setProperty('--background', '#f8f9fa');
            document.documentElement.style.setProperty('--card', '#ffffff');
            document.documentElement.style.setProperty('--text', '#2d3748');
            document.documentElement.style.setProperty('--text-light', '#718096');
            document.documentElement.style.setProperty('--border', '#e2e8f0');
        }
        
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.classList.remove('active');
    }
    
    openHelp() {
        alert('Help & Support:\n\nEmail: support@sidraayyymanager.com\nPhone: +1-234-567-8900\nLive Chat: Available 9 AM - 6 PM');
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.classList.remove('active');
    }
    
    exportData() {
        const data = {
            user: this.user,
            projects: this.projects,
            tasks: this.tasks,
            activities: this.activities,
            deadlines: this.deadlines,
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sidraayyy-manager-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Data exported successfully!');
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.classList.remove('active');
    }
    
    openCalendar() {
        alert('Calendar view would open here!\n\nShowing upcoming deadlines and meetings.');
    }
    
    openAnalytics() {
        alert('Analytics dashboard would open here!\n\nShowing project progress, team performance, and task completion rates.');
    }
    
    filterProjects() {
        const filters = ['All', 'Active', 'Planning', 'On Hold'];
        const filter = prompt(`Filter projects by:\n${filters.map((f, i) => `${i+1}. ${f}`).join('\n')}`);
        if (filter) {
            const selected = filters[parseInt(filter)-1] || 'All';
            alert(`Filtering projects by: ${selected}`);
            // In real app, would filter the projects grid
        }
    }
    
    viewAllActivity() {
        alert('Viewing all activity history!');
    }
    
    async editTask(taskId) {
        const task = this.tasks.find(t => (t.id || t._id) == taskId);
        if (task) {
            const newStatus = prompt(`Change status for "${task.title}":\n1. To-Do\n2. In Progress\n3. Done`, task.status);
            
            let updatedStatus = task.status;
            if (newStatus === '1' || newStatus === 'To-Do') updatedStatus = 'todo';
            else if (newStatus === '2' || newStatus === 'In Progress') updatedStatus = 'progress';
            else if (newStatus === '3' || newStatus === 'Done') updatedStatus = 'done';
            
            if (updatedStatus !== task.status) {
                // Update via API
                try {
                    const result = await this.apiService.updateTask(taskId, { status: updatedStatus });
                    
                    if (result.success) {
                        task.status = updatedStatus;
                        this.renderAll();
                        this.updateStats();
                        alert('Task updated successfully!');
                    } else {
                        // Update locally if API fails
                        task.status = updatedStatus;
                        this.renderAll();
                        this.updateStats();
                        alert('Task updated locally!');
                    }
                } catch (error) {
                    // Update locally on error
                    task.status = updatedStatus;
                    this.renderAll();
                    this.updateStats();
                    alert('Task updated!');
                }
            }
        }
    }
    
    async editProject(projectId) {
        const project = this.projects.find(p => (p.id || p._id) == projectId);
        if (project) {
            const newProgress = prompt(`Update progress for "${project.name}" (0-100):`, project.progress || project.calculatedProgress || 0);
            if (newProgress !== null) {
                const progress = parseInt(newProgress);
                if (!isNaN(progress) && progress >= 0 && progress <= 100) {
                    // Update via API
                    try {
                        const result = await this.apiService.updateProject(projectId, { progress });
                        
                        if (result.success) {
                            project.progress = progress;
                            this.renderProjects();
                            alert('Project updated successfully!');
                        } else {
                            // Update locally if API fails
                            project.progress = progress;
                            this.renderProjects();
                            alert('Project updated locally!');
                        }
                    } catch (error) {
                        // Update locally on error
                        project.progress = progress;
                        this.renderProjects();
                        alert('Project updated!');
                    }
                }
            }
        }
    }
    
    viewProject(projectId) {
        const project = this.projects.find(p => (p.id || p._id) == projectId);
        if (project) {
            const projectTasks = this.tasks.filter(task => task.project === project.name || task.project === projectId);
            
            alert(`Project Details:\n\nName: ${project.name}\nCategory: ${project.category}\nStatus: ${project.status}\nProgress: ${project.progress || project.calculatedProgress || 0}%\nDeadline: ${this.formatDate(project.deadline)}\nTeam: ${project.team ? project.team.join(', ') : 'No team'}\nTasks: ${projectTasks.length}\nBudget: ${project.budget || 'Not specified'}`);
        }
    }
    
    // Helper Methods
    highlightNav(activeId) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-link').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        if (activeId) {
            const activeElement = document.getElementById(activeId);
            if (activeElement) {
                activeElement.classList.add('active');
            }
        }
    }
    
    getDateString(daysFromNow) {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date.toISOString().split('T')[0];
    }
    
    formatDate(dateString) {
        if (!dateString) return 'No date';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';
        
        const today = new Date();
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        
        // Check if it's today
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        }
        
        // Check if it's tomorrow
        if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        }
        
        // Otherwise return formatted date
        return date.toLocaleDateString('en-US', { 
            weekday: 'short',
            month: 'short', 
            day: 'numeric' 
        });
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global dashboard instance
    window.dashboard = new Dashboard();
    
    // Also expose it globally for button onclick handlers
    window.editProject = (id) => window.dashboard.editProject(id);
    window.viewProject = (id) => window.dashboard.viewProject(id);
});