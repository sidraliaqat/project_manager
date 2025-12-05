// Dashboard Application
class Dashboard {
    constructor() {
        this.user = null;
        this.tasks = [];
        this.projects = [];
        this.activities = [];
        this.deadlines = [];
        this.currentTheme = 'light';
        this.init();
    }
    
    init() {
        this.loadUserData();
        this.loadTasks();
        this.loadProjects();
        this.loadDeadlines();
        this.loadActivities();
        this.setupEventListeners();
        this.updateStats();
        this.renderAll();
    }
    
    loadUserData() {
        // Default user data
        this.user = {
            firstName: 'Sidraayyy',
            lastName: 'Manager',
            email: 'sidraayyy@manager.com',
            role: 'Project Manager',
            bio: 'Experienced project manager with expertise in web development projects.'
        };
        
        // Update UI elements
        document.getElementById('userAvatar').textContent = 'SM';
        document.getElementById('userName').textContent = `${this.user.firstName} ${this.user.lastName}`;
        document.getElementById('userRole').textContent = this.user.role;
        document.getElementById('welcomeMessage').textContent = `Welcome, ${this.user.firstName}!`;
        document.getElementById('dropdownAvatar').textContent = 'SM';
        document.getElementById('dropdownName').textContent = `${this.user.firstName} ${this.user.lastName}`;
        document.getElementById('dropdownEmail').textContent = this.user.email;
    }
    
    loadTasks() {
        // Sample tasks data
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
    
    loadProjects() {
        // Sample projects data
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
    
    loadDeadlines() {
        // Extract deadlines from tasks and projects
        this.deadlines = [];
        
        // Add task deadlines
        this.tasks.forEach(task => {
            this.deadlines.push({
                type: 'task',
                title: task.title,
                project: task.project,
                deadline: task.deadline,
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
        
        const todoTasks = this.tasks.filter(task => task.status === 'todo');
        const progressTasks = this.tasks.filter(task => task.status === 'progress');
        const doneTasks = this.tasks.filter(task => task.status === 'done');
        
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
        element.dataset.id = task.id;
        
        const priorityClass = `priority-${task.priority}`;
        const assigneeInitials = task.assignee === 'You' 
            ? 'ME' 
            : task.assignee.charAt(0).toUpperCase();
        const isOverdue = new Date(task.deadline) < new Date();
        
        element.innerHTML = `
            <div class="task-header">
                <div class="task-title">${task.title}</div>
                <div class="task-priority ${priorityClass}">${task.priority}</div>
            </div>
            <div class="task-description">${task.description}</div>
            <div class="task-footer">
                <div class="task-assignee">
                    <div class="assignee-avatar">${assigneeInitials}</div>
                    <span>${task.assignee}</span>
                </div>
                <div class="task-deadline ${isOverdue ? 'overdue' : ''}">
                    <i class="far fa-calendar-alt"></i>
                    <span>${this.formatDate(task.deadline)}${isOverdue ? ' (Overdue)' : ''}</span>
                </div>
            </div>
        `;
        
        element.addEventListener('click', () => this.editTask(task.id));
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
        element.dataset.id = project.id;
        
        const statusClass = `status-${project.status}`;
        const overdue = new Date(project.deadline) < new Date();
        
        element.innerHTML = `
            <div class="project-header">
                <div class="project-title">
                    <div class="project-name">
                        <h3>${project.name}</h3>
                        <div class="project-category">${project.category}</div>
                    </div>
                    <span class="project-status ${statusClass}">${project.status}</span>
                </div>
                <p class="project-description">${project.description}</p>
                
                <div class="project-progress">
                    <div class="progress-label">
                        <span>Progress</span>
                        <span>${project.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.progress}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="project-footer">
                <div class="project-meta">
                    <div class="meta-item">
                        <i class="far fa-calendar-alt"></i>
                        <span class="${overdue ? 'error' : ''}">${this.formatDate(project.deadline)}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-users"></i>
                        <span>${project.team.length} members</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-tasks"></i>
                        <span>${project.tasks} tasks</span>
                    </div>
                </div>
                
                <div class="project-actions">
                    <button class="action-icon" onclick="dashboard.editProject(${project.id}); event.stopPropagation();">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-icon" onclick="dashboard.viewProject(${project.id}); event.stopPropagation();">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `;
        
        element.addEventListener('click', (e) => {
            if (!e.target.closest('.project-actions')) {
                this.viewProject(project.id);
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
        
        const isOverdue = new Date(deadline.deadline) < new Date();
        const icon = deadline.type === 'task' ? 'fas fa-tasks' : 'fas fa-project-diagram';
        
        element.innerHTML = `
            <div class="deadline-icon">
                <i class="${icon}"></i>
            </div>
            <div class="deadline-content">
                <div class="deadline-title">${deadline.title}</div>
                <div class="deadline-project">${deadline.project}</div>
                <div class="deadline-time ${isOverdue ? 'overdue' : ''}">
                    <i class="far fa-clock"></i>
                    ${this.formatDate(deadline.deadline)}${isOverdue ? ' (Overdue)' : ''}
                </div>
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
        const todoTasks = this.tasks.filter(task => task.status === 'todo');
        const progressTasks = this.tasks.filter(task => task.status === 'progress');
        const doneTasks = this.tasks.filter(task => task.status === 'done');
        
        const overdueTasks = this.tasks.filter(task => {
            const deadline = new Date(task.deadline);
            const today = new Date();
            return deadline < today && task.status !== 'done';
        });
        
        const upcomingDeadlines = this.deadlines.filter(d => {
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
            project.team.forEach(member => allTeamMembers.add(member));
        });
        document.getElementById('teamMembers').textContent = allTeamMembers.size;
        
        // Update upcoming count in sidebar
        document.getElementById('upcomingCount').textContent = upcomingDeadlines.length;
    }
    
    setupEventListeners() {
        // Header actions
        document.getElementById('goHome').addEventListener('click', () => this.showDashboard());
        document.getElementById('searchBtn').addEventListener('click', () => this.openSearch());
        document.getElementById('notificationsBtn').addEventListener('click', () => this.openNotifications());
        document.getElementById('quickAddBtn').addEventListener('click', () => this.quickAdd());
        
        // User dropdown
        document.getElementById('userProfile').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('userDropdown').classList.toggle('active');
        });
        
        document.addEventListener('click', () => {
            document.getElementById('userDropdown').classList.remove('active');
        });
        
        // Dropdown actions
        document.getElementById('profileBtn').addEventListener('click', () => this.openProfile());
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());
        document.getElementById('notificationsSettingsBtn').addEventListener('click', () => this.openNotificationSettings());
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('helpBtn').addEventListener('click', () => this.openHelp());
        document.getElementById('exportDataBtn').addEventListener('click', () => this.exportData());
        
        // Sidebar navigation
        document.getElementById('dashboardBtn').addEventListener('click', () => this.showDashboard());
        document.getElementById('projectsBtn').addEventListener('click', () => this.showProjects());
        document.getElementById('tasksBtn').addEventListener('click', () => this.showTasks());
        document.getElementById('teamBtn').addEventListener('click', () => this.showTeam());
        document.getElementById('calendarBtn').addEventListener('click', () => this.openCalendar());
        document.getElementById('addProjectBtn').addEventListener('click', () => this.openAddProjectModal());
        document.getElementById('addTaskBtn').addEventListener('click', () => this.openAddTaskModal());
        document.getElementById('analyticsBtn').addEventListener('click', () => this.openAnalytics());
        document.getElementById('todoBtn').addEventListener('click', () => this.filterTasks('todo'));
        document.getElementById('progressBtn').addEventListener('click', () => this.filterTasks('progress'));
        document.getElementById('doneBtn').addEventListener('click', () => this.filterTasks('done'));
        document.getElementById('deadlinesBtn').addEventListener('click', () => this.showDeadlines());
        document.getElementById('profileSideBtn').addEventListener('click', () => this.openProfile());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        
        // Main content buttons
        document.getElementById('newProjectBtn').addEventListener('click', () => this.openAddProjectModal());
        document.getElementById('createProjectBtn').addEventListener('click', () => this.openAddProjectModal());
        document.getElementById('addTaskMainBtn').addEventListener('click', () => this.openAddTaskModal());
        document.getElementById('filterProjectsBtn').addEventListener('click', () => this.filterProjects());
        document.getElementById('viewCalendarBtn').addEventListener('click', () => this.openCalendar());
        document.getElementById('viewAllActivityBtn').addEventListener('click', () => this.viewAllActivity());
        
        // Task filters
        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterTasks(e.target.dataset.filter);
            });
        });
        
        // Stat cards
        document.getElementById('totalProjectsCard').addEventListener('click', () => this.showProjects());
        document.getElementById('completedTasksCard').addEventListener('click', () => this.filterTasks('done'));
        document.getElementById('teamMembersCard').addEventListener('click', () => this.showTeam());
        document.getElementById('overdueCard').addEventListener('click', () => this.filterOverdueTasks());
        
        // Modal events
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.remove('active');
                });
            });
        });
        
        // Save project
        document.getElementById('saveProjectBtn').addEventListener('click', () => this.saveProject());
        
        // Save task
        document.getElementById('saveTaskBtn').addEventListener('click', () => this.saveTask());
        
        // Save profile
        document.getElementById('saveProfileBtn').addEventListener('click', () => this.saveProfile());
        
        // Change avatar
        document.getElementById('changeAvatarBtn').addEventListener('click', () => this.changeAvatar());
        
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
        modal.classList.add('active');
        
        // Set default dates
        const today = new Date();
        const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        
        document.getElementById('projectStartDate').value = today.toISOString().split('T')[0];
        document.getElementById('projectDeadline').value = nextMonth.toISOString().split('T')[0];
        
        // Clear form
        document.getElementById('projectForm').reset();
    }
    
    openAddTaskModal() {
        const modal = document.getElementById('addTaskModal');
        modal.classList.add('active');
        
        // Set default date (tomorrow)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        document.getElementById('taskDeadline').value = tomorrow.toISOString().split('T')[0];
        
        // Populate projects dropdown
        const projectSelect = document.getElementById('taskProject');
        projectSelect.innerHTML = '<option value="">Select Project</option>';
        this.projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.name;
            option.textContent = project.name;
            projectSelect.appendChild(option);
        });
        
        // Clear form
        document.getElementById('taskForm').reset();
    }
    
    openProfile() {
        const modal = document.getElementById('profileModal');
        modal.classList.add('active');
        
        // Populate form with user data
        document.getElementById('firstName').value = this.user.firstName;
        document.getElementById('lastName').value = this.user.lastName;
        document.getElementById('email').value = this.user.email;
        document.getElementById('role').value = this.user.role;
        document.getElementById('bio').value = this.user.bio;
        
        // Update avatar in modal
        document.getElementById('profileAvatar').textContent = 
            this.user.firstName.charAt(0) + this.user.lastName.charAt(0);
    }
    
    saveProject() {
        const projectName = document.getElementById('projectName').value;
        const description = document.getElementById('projectDescription').value;
        const startDate = document.getElementById('projectStartDate').value;
        const deadline = document.getElementById('projectDeadline').value;
        const status = document.getElementById('projectStatus').value;
        const team = document.getElementById('projectTeam').value.split(',').map(t => t.trim());
        
        if (!projectName) {
            alert('Please enter project name');
            return;
        }
        
        const newProject = {
            id: this.projects.length + 1,
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
        
        alert(`Project "${projectName}" created successfully!`);
    }
    
    saveTask() {
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const project = document.getElementById('taskProject').value;
        const priority = document.getElementById('taskPriority').value;
        const assignee = document.getElementById('taskAssignee').value;
        const deadline = document.getElementById('taskDeadline').value;
        const status = document.getElementById('taskStatus').value;
        
        if (!title) {
            alert('Please enter task title');
            return;
        }
        
        const newTask = {
            id: this.tasks.length + 1,
            title: title,
            description: description,
            status: status,
            priority: priority,
            assignee: assignee || 'You',
            deadline: deadline,
            project: project || 'General'
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
        
        alert(`Task "${title}" added successfully!`);
    }
    
    saveProfile() {
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
        
        // Update UI
        document.getElementById('userName').textContent = `${firstName} ${lastName}`;
        document.getElementById('userRole').textContent = role;
        document.getElementById('dropdownName').textContent = `${firstName} ${lastName}`;
        document.getElementById('dropdownEmail').textContent = email;
        document.getElementById('profileAvatar').textContent = firstName.charAt(0) + lastName.charAt(0);
        document.getElementById('userAvatar').textContent = firstName.charAt(0) + lastName.charAt(0);
        
        // Close modal
        document.getElementById('profileModal').classList.remove('active');
        
        alert('Profile updated successfully!');
    }
    
    changeAvatar() {
        const colors = [
            'linear-gradient(135deg, var(--peach-fuzz), var(--sauterne))',
            'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            'linear-gradient(135deg, var(--accent), var(--brandied-apricot))',
            'linear-gradient(135deg, #6c63ff, #4a44c8)',
            'linear-gradient(135deg, #10b981, #059669)'
        ];
        
        const currentBg = document.getElementById('profileAvatar').style.background;
        const currentIndex = colors.indexOf(currentBg);
        const nextIndex = (currentIndex + 1) % colors.length;
        
        document.getElementById('profileAvatar').style.background = colors[nextIndex];
        document.getElementById('userAvatar').style.background = colors[nextIndex];
        document.getElementById('dropdownAvatar').style.background = colors[nextIndex];
    }
    
    // Action Methods
    showDashboard() {
        this.highlightNav('dashboardBtn');
        // Already on dashboard
    }
    
    showProjects() {
        this.highlightNav('projectsBtn');
        // Scroll to projects section
        document.querySelector('.projects-grid').scrollIntoView({ behavior: 'smooth' });
    }
    
    showTasks() {
        this.highlightNav('tasksBtn');
        // Scroll to tasks section
        document.querySelector('.tasks-section').scrollIntoView({ behavior: 'smooth' });
    }
    
    showTeam() {
        this.highlightNav('teamBtn');
        alert('Team management page would open here!');
    }
    
    filterTasks(filter) {
        document.querySelectorAll('.tasks-column').forEach(col => {
            col.style.display = 'block';
        });
        
        if (filter === 'todo') {
            document.querySelectorAll('.tasks-column')[1].style.display = 'none';
            document.querySelectorAll('.tasks-column')[2].style.display = 'none';
        } else if (filter === 'progress') {
            document.querySelectorAll('.tasks-column')[0].style.display = 'none';
            document.querySelectorAll('.tasks-column')[2].style.display = 'none';
        } else if (filter === 'done') {
            document.querySelectorAll('.tasks-column')[0].style.display = 'none';
            document.querySelectorAll('.tasks-column')[1].style.display = 'none';
        }
    }
    
    filterOverdueTasks() {
        const overdueTasks = this.tasks.filter(task => {
            const deadline = new Date(task.deadline);
            const today = new Date();
            return deadline < today && task.status !== 'done';
        });
        
        if (overdueTasks.length === 0) {
            alert('No overdue tasks! 🎉');
        } else {
            alert(`You have ${overdueTasks.length} overdue tasks:`);
            overdueTasks.forEach(task => {
                alert(`• ${task.title} (Due: ${this.formatDate(task.deadline)})`);
            });
        }
    }
    
    showDeadlines() {
        this.highlightNav('deadlinesBtn');
        // Scroll to deadlines section
        document.querySelector('.deadlines-list').scrollIntoView({ behavior: 'smooth' });
    }
    
    openSearch() {
        const searchTerm = prompt('Search for projects, tasks, or team members:');
        if (searchTerm) {
            const results = [];
            
            // Search in tasks
            this.tasks.forEach(task => {
                if (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    task.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                    results.push(`Task: ${task.title}`);
                }
            });
            
            // Search in projects
            this.projects.forEach(project => {
                if (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    project.description.toLowerCase().includes(searchTerm.toLowerCase())) {
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
        document.getElementById('userDropdown').classList.remove('active');
    }
    
    openNotificationSettings() {
        alert('Notification settings would open here!');
        document.getElementById('userDropdown').classList.remove('active');
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        const themeStatus = document.getElementById('themeStatus');
        themeStatus.textContent = this.currentTheme === 'dark' ? 'ON' : 'OFF';
        
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
        
        document.getElementById('userDropdown').classList.remove('active');
    }
    
    openHelp() {
        alert('Help & Support:\n\nEmail: support@sidraayyymanager.com\nPhone: +1-234-567-8900\nLive Chat: Available 9 AM - 6 PM');
        document.getElementById('userDropdown').classList.remove('active');
    }
    
    exportData() {
        const data = {
            user: this.user,
            projects: this.projects,
            tasks: this.tasks,
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
        document.getElementById('userDropdown').classList.remove('active');
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
    
    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const newStatus = prompt(`Change status for "${task.title}":\n1. To-Do\n2. In Progress\n3. Done`, task.status);
            
            if (newStatus === '1' || newStatus === 'To-Do') task.status = 'todo';
            else if (newStatus === '2' || newStatus === 'In Progress') task.status = 'progress';
            else if (newStatus === '3' || newStatus === 'Done') task.status = 'done';
            
            this.renderAll();
            this.updateStats();
        }
    }
    
    editProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const newProgress = prompt(`Update progress for "${project.name}" (0-100):`, project.progress);
            if (newProgress !== null) {
                const progress = parseInt(newProgress);
                if (!isNaN(progress) && progress >= 0 && progress <= 100) {
                    project.progress = progress;
                    this.renderProjects();
                }
            }
        }
    }
    
    viewProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            alert(`Project Details:\n\nName: ${project.name}\nCategory: ${project.category}\nStatus: ${project.status}\nProgress: ${project.progress}%\nDeadline: ${this.formatDate(project.deadline)}\nTeam: ${project.team.join(', ')}\nTasks: ${project.tasks}\nBudget: ${project.budget}`);
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
            document.getElementById(activeId).classList.add('active');
        }
    }
    
    getDateString(daysFromNow) {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date.toISOString().split('T')[0];
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
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

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});