import React, { useState, useEffect } from 'react'
import PriorityChart from '../components/PriorityChart'
import Sidebar from '../components/Sidebar'
import NotificationBell from '../components/NotificationBell'
import Chatbot from '../components/Chatbot'

const Dashboard = ({ onLogout }) => {
  const [activePage, setActivePage] = useState('dashboard')
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [showAddTeamModal, setShowAddTeamModal] = useState(false)
  
  // Mock data for demonstration
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todos: 0
  })

  const [priorityData, setPriorityData] = useState([
    { priority: 'High', count: 0, color: '#ef4444' },
    { priority: 'Medium', count: 0, color: '#f59e0b' },
    { priority: 'Low', count: 0, color: '#10b981' }
  ])

  const [recentTasks, setRecentTasks] = useState([])
  const [tasks, setTasks] = useState([])
  const [teamMembers, setTeamMembers] = useState(['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Alex Brown'])
  const [notifications, setNotifications] = useState([])
  const [showChatbot, setShowChatbot] = useState(false)

  // Real task data
  const mockTasks = [
    { id: 1, title: 'Bug fixing', status: 'in-progress', priority: 'high', dueDate: '2024-01-20', assignee: 'John Doe' },
    { id: 2, title: 'Review code changes', status: 'todo', priority: 'medium', dueDate: '2024-01-22', assignee: 'Jane Smith' },
    { id: 3, title: 'Website Project Proposal Review', status: 'completed', priority: 'high', dueDate: '2024-01-18', assignee: 'Mike Johnson' },
    { id: 4, title: 'Duplicate-website project proposal', status: 'todo', priority: 'low', dueDate: '2024-01-25', assignee: 'Sarah Wilson' },
    { id: 5, title: 'Duplicate-review code changes', status: 'in-progress', priority: 'medium', dueDate: '2024-01-28', assignee: 'Alex Brown' },
    { id: 6, title: 'Database optimization', status: 'completed', priority: 'medium', dueDate: '2024-01-15', assignee: 'John Doe' },
    { id: 7, title: 'UI/UX improvements', status: 'todo', priority: 'high', dueDate: '2024-01-30', assignee: 'Jane Smith' },
    { id: 8, title: 'API documentation', status: 'in-progress', priority: 'low', dueDate: '2024-02-01', assignee: 'Mike Johnson' },
  ]

  useEffect(() => {
    // Simulate loading data
    const loadData = () => {
      const completed = mockTasks.filter(task => task.status === 'completed').length
      const inProgress = mockTasks.filter(task => task.status === 'in-progress').length
      const todos = mockTasks.filter(task => task.status === 'todo').length
      
      setTaskStats({
        totalTasks: mockTasks.length,
        completedTasks: completed,
        inProgressTasks: inProgress,
        todos: todos
      })

      // Priority data
      const highPriority = mockTasks.filter(task => task.priority === 'high').length
      const mediumPriority = mockTasks.filter(task => task.priority === 'medium').length
      const lowPriority = mockTasks.filter(task => task.priority === 'low').length

      setPriorityData([
        { priority: 'High', count: highPriority, color: '#ef4444' },
        { priority: 'Medium', count: mediumPriority, color: '#f59e0b' },
        { priority: 'Low', count: lowPriority, color: '#10b981' }
      ])

      // Recent tasks (last 5)
      setRecentTasks(mockTasks.slice(0, 5))
      
      // Initialize tasks
      setTasks(mockTasks)
      
      // Initialize some sample notifications
      setNotifications([
        {
          id: 1,
          title: 'New Task Assigned',
          message: 'You have been assigned to "Bug fixing" task with high priority',
          timestamp: '2 minutes ago',
          read: false,
          priority: 'high'
        },
        {
          id: 2,
          title: 'Task Due Soon',
          message: 'Review code changes task is due in 2 days',
          timestamp: '1 hour ago',
          read: false,
          priority: 'medium'
        },
        {
          id: 3,
          title: 'Task Completed',
          message: 'Website Project Proposal Review has been completed',
          timestamp: '3 hours ago',
          read: true,
          priority: 'low'
        }
      ])
      
      // Update stats after initialization
      updateTaskStats()
    }

    loadData()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in-progress': return 'text-blue-600 bg-blue-100'
      case 'todo': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const handlePageChange = (page) => {
    setActivePage(page)
  }

  const addNewTask = (newTask) => {
    const task = {
      id: Date.now(),
      ...newTask,
      status: 'todo',
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0]
    }
    setTasks(prev => [...prev, task])
    setShowAddTaskModal(false)
    updateTaskStats()
    
    // Add notification for new task assignment
    addNotification(
      'New Task Assigned',
      `You have been assigned to "${task.title}" task with ${task.priority} priority`,
      task.priority
    )
  }

  const addTeamMember = (newMember) => {
    setTeamMembers(prev => [...prev, newMember])
    setShowAddTeamModal(false)
  }

  const emptyTrash = () => {
    if (window.confirm('Are you sure you want to permanently delete all items in trash? This action cannot be undone.')) {
      setTasks(prev => prev.filter(task => task.status !== 'deleted'))
      updateTaskStats()
    }
  }

  const deleteTask = (taskId) => {
    // Check if it's a mock task or dynamic task
    const isMockTask = mockTasks.find(task => task.id === taskId)
    
    if (isMockTask) {
      // For mock tasks, add them to the dynamic tasks array with deleted status
      const deletedMockTask = { ...isMockTask, status: 'deleted' }
      setTasks(prev => [...prev, deletedMockTask])
    } else {
      // For dynamic tasks, update their status
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: 'deleted' } : task
      ))
    }
    updateTaskStats()
  }

  const restoreTask = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'todo' } : task
    ))
    updateTaskStats()
  }

  const deletePermanently = (taskId) => {
    if (window.confirm('Are you sure you want to permanently delete this task? This action cannot be undone.')) {
      setTasks(prev => prev.filter(task => task.id !== taskId))
      updateTaskStats()
    }
  }

  const changeTaskStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
    updateTaskStats()
  }

  const handleMockTaskStatusChange = (taskId, newStatus) => {
    // Check if it's a mock task
    const isMockTask = mockTasks.find(task => task.id === taskId)
    
    if (isMockTask) {
      // For mock tasks, add them to the dynamic tasks array with new status
      const updatedMockTask = { ...isMockTask, status: newStatus }
      setTasks(prev => [...prev, updatedMockTask])
    } else {
      // For dynamic tasks, update their status
      changeTaskStatus(taskId, newStatus)
    }
    updateTaskStats()
  }

  const updateTaskStats = () => {
    const allTasks = [...mockTasks, ...tasks]
    const completed = allTasks.filter(task => task.status === 'completed').length
    const inProgress = allTasks.filter(task => task.status === 'in-progress').length
    const todos = allTasks.filter(task => task.status === 'todo').length
    
    setTaskStats({
      totalTasks: allTasks.length,
      completedTasks: completed,
      inProgressTasks: inProgress,
      todos: todos
    })
  }

  // Notification management functions
  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const clearAllNotifications = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const addNotification = (title, message, priority = 'medium') => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      timestamp: 'Just now',
      read: false,
      priority
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activePage={activePage} onPageChange={handlePageChange} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  {activePage === 'dashboard' && 'Dashboard'}
                  {activePage === 'tasks' && 'All Tasks'}
                  {activePage === 'completed' && 'Completed Tasks'}
                  {activePage === 'in-progress' && 'In Progress Tasks'}
                  {activePage === 'todo' && 'To Do Tasks'}
                  {activePage === 'team' && 'Team Management'}
                  {activePage === 'trash' && 'Trash'}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowChatbot(!showChatbot)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  title="AI Assistant"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {showChatbot && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
                  )}
                </button>
                <NotificationBell 
                  notifications={notifications}
                  onMarkAsRead={markNotificationAsRead}
                  onClearAll={clearAllNotifications}
                />
                <button
                  onClick={onLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

              {/* Main Content */}
        <main className="flex-1 overflow-y-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section - Only show on Dashboard */}
        {activePage === 'dashboard' && (
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
                <p className="text-gray-600">Here's what's happening with your tasks today.</p>
              </div>
              <button
                onClick={() => {
                  const sampleTasks = [
                    { title: 'Code Review', priority: 'high', assignee: 'John Doe' },
                    { title: 'Database Migration', priority: 'medium', assignee: 'Jane Smith' },
                    { title: 'UI Testing', priority: 'low', assignee: 'Mike Johnson' }
                  ]
                  const randomTask = sampleTasks[Math.floor(Math.random() * sampleTasks.length)]
                  addNotification(
                    'New Task Assigned',
                    `You have been assigned to "${randomTask.title}" task with ${randomTask.priority} priority`,
                    randomTask.priority
                  )
                }}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 text-sm"
              >
                🔔 Simulate New Task
              </button>
            </div>
          </div>
        )}

                {/* Stats Cards - Only show on Dashboard */}
        {activePage === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Tasks */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{taskStats.totalTasks}</p>
                </div>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{taskStats.completedTasks}</p>
                </div>
              </div>
            </div>

            {/* In Progress Tasks */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{taskStats.inProgressTasks}</p>
                </div>
              </div>
            </div>

            {/* To Do Tasks */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gray-100">
                  <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">To Do</p>
                  <p className="text-2xl font-bold text-gray-900">{taskStats.todos}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts and Recent Tasks - Only show on Dashboard */}
        {activePage === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Priority Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Priority</h3>
            <PriorityChart data={priorityData} />
          </div>

          {/* Recent Tasks */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h3>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{task.title}</h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Due: {task.dueDate}</span>
                      <span>Assignee: {task.assignee}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* Progress Overview - Only show on Dashboard */}
        {activePage === 'dashboard' && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Completion Rate</span>
                  <span>{Math.round((taskStats.completedTasks / taskStats.totalTasks) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(taskStats.completedTasks / taskStats.totalTasks) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Page Content */}
        {activePage === 'tasks' && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">All Tasks</h3>
              <button 
                onClick={() => setShowAddTaskModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                + Add New Task
              </button>
            </div>
            <div className="space-y-4">
              {[...mockTasks, ...tasks].map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-l-4 border-transparent hover:border-blue-500">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{task.title}</h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Due: {task.dueDate}</span>
                      <span>Assignee: {task.assignee}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="p-1 text-red-400 hover:text-red-600 transition-colors"
                        title="Delete Task"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="p-1 text-orange-400 hover:text-orange-600 transition-colors"
                        title="Move to Trash"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <div className="relative group">
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => handleMockTaskStatusChange(task.id, 'todo')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Mark as To Do
                            </button>
                            <button
                              onClick={() => handleMockTaskStatusChange(task.id, 'in-progress')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Mark as In Progress
                            </button>
                            <button
                              onClick={() => handleMockTaskStatusChange(task.id, 'completed')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Mark as Completed
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === 'completed' && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Tasks</h3>
            <div className="space-y-4">
              {[...mockTasks, ...tasks].filter(task => task.status === 'completed').map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{task.title}</h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Completed: {task.dueDate}</span>
                      <span>Assignee: {task.assignee}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-green-600 bg-green-100">
                      completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === 'in-progress' && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">In Progress Tasks</h3>
            <div className="space-y-4">
              {[...mockTasks, ...tasks].filter(task => task.status === 'in-progress').map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{task.title}</h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Due: {task.dueDate}</span>
                      <span>Assignee: {task.assignee}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-blue-600 bg-blue-100">
                      in progress
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === 'todo' && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">To Do Tasks</h3>
            <div className="space-y-4">
              {[...mockTasks, ...tasks].filter(task => task.status === 'todo').map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-gray-500">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{task.title}</h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Due: {task.dueDate}</span>
                      <span>Assignee: {task.assignee}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
                      todo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === 'team' && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Team Management</h3>
              <button 
                onClick={() => setShowAddTeamModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                + Add Team Member
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => {
                const memberTasks = [...mockTasks, ...tasks].filter(task => task.assignee === member);
                const completedTasks = memberTasks.filter(task => task.status === 'completed').length;
                const totalTasks = memberTasks.length;
                
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center mb-3">
                      <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold text-lg">{member.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{member}</h4>
                        <p className="text-sm text-gray-500">Team Member</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tasks:</span>
                        <span className="font-medium">{totalTasks}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Completed:</span>
                        <span className="font-medium text-green-600">{completedTasks}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activePage === 'trash' && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Trash</h3>
              <button 
                onClick={emptyTrash}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
              >
                Empty Trash
              </button>
            </div>
            <div className="space-y-4">
              {[...mockTasks, ...tasks].filter(task => task.status === 'deleted').length > 0 ? (
                [...mockTasks, ...tasks].filter(task => task.status === 'deleted').map((task) => (

                  
                  <div key={task.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1 line-through">{task.title}</h4>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Deleted: {task.dueDate}</span>
                        <span>Assignee: {task.assignee}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => restoreTask(task.id)}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Restore
                      </button>
                      <button 
                        onClick={() => deletePermanently(task.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                      >
                        Delete Permanently
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No deleted tasks</h3>
                  <p className="mt-1 text-sm text-gray-500">Tasks you delete will appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}
        </main>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              addNewTask({
                title: formData.get('title'),
                priority: formData.get('priority'),
                dueDate: formData.get('dueDate'),
                assignee: formData.get('assignee')
              })
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    name="priority"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                  <select
                    name="assignee"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {teamMembers.map(member => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Team Member Modal */}
      {showAddTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Team Member</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              addTeamMember(formData.get('name'))
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter member name"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chatbot */}
      <Chatbot
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        tasks={[...mockTasks, ...tasks]}
        teamMembers={teamMembers}
        onAddTask={addNewTask}
        onUpdateTaskStatus={changeTaskStatus}
      />
    </div>
  )
}

export default Dashboard





