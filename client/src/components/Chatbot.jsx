import React, { useState, useEffect, useRef } from 'react'

const Chatbot = ({ isOpen, onClose, tasks, teamMembers, onAddTask, onUpdateTaskStatus }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your TaskXpert assistant. I can help you with:\n• Creating and managing tasks\n• Checking task status and priorities\n• Getting team member information\n• Task completion tips\n• Project insights\n\nWhat would you like help with?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (content, type = 'user') => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const simulateTyping = (callback) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      callback()
    }, 1000 + Math.random() * 1000)
  }

  const getTaskStats = () => {
    const totalTasks = tasks.length
    const completed = tasks.filter(task => task.status === 'completed').length
    const inProgress = tasks.filter(task => task.status === 'in-progress').length
    const todos = tasks.filter(task => task.status === 'todo').length
    const highPriority = tasks.filter(task => task.priority === 'high').length

    return { totalTasks, completed, inProgress, todos, highPriority }
  }

  const getTaskSuggestions = () => {
    const stats = getTaskStats()
    const suggestions = []

    if (stats.highPriority > 0) {
      suggestions.push(`You have ${stats.highPriority} high priority task(s) that need immediate attention.`)
    }
    if (stats.todos > 5) {
      suggestions.push(`You have ${stats.todos} pending tasks. Consider breaking them into smaller chunks.`)
    }
    if (stats.completed > 0) {
      suggestions.push(`Great job! You've completed ${stats.completed} task(s). Keep up the momentum!`)
    }
    if (stats.inProgress > 3) {
      suggestions.push(`You have ${stats.inProgress} tasks in progress. Focus on completing one before starting another.`)
    }

    return suggestions.length > 0 ? suggestions.join('\n\n') : "Your task list looks well organized! Keep up the great work."
  }

  const processCommand = (message) => {
    const lowerMessage = message.toLowerCase()
    
    // Task statistics
    if (lowerMessage.includes('stats') || lowerMessage.includes('summary') || lowerMessage.includes('overview')) {
      const stats = getTaskStats()
      const completionRate = stats.totalTasks > 0 ? Math.round((stats.completed / stats.totalTasks) * 100) : 0
      
      return `📊 **Task Statistics:**
• Total Tasks: ${stats.totalTasks}
• Completed: ${stats.completed} (${completionRate}%)
• In Progress: ${stats.inProgress}
• To Do: ${stats.todos}
• High Priority: ${stats.highPriority}

${getTaskSuggestions()}`
    }

    // List tasks
    if (lowerMessage.includes('list') || lowerMessage.includes('show') || lowerMessage.includes('tasks')) {
      if (tasks.length === 0) {
        return "You don't have any tasks yet. Would you like me to help you create one?"
      }
      
      const taskList = tasks.slice(0, 5).map(task => 
        `• **${task.title}** (${task.priority} priority, ${task.status})`
      ).join('\n')
      
      return `📋 **Your Recent Tasks:**
${taskList}
${tasks.length > 5 ? `\n... and ${tasks.length - 5} more tasks` : ''}`
    }

    // High priority tasks
    if (lowerMessage.includes('urgent') || lowerMessage.includes('high priority') || lowerMessage.includes('important')) {
      const highPriorityTasks = tasks.filter(task => task.priority === 'high')
      if (highPriorityTasks.length === 0) {
        return "No high priority tasks at the moment. Great job staying on top of things!"
      }
      
      const urgentList = highPriorityTasks.map(task => 
        `• **${task.title}** (${task.status}) - Due: ${task.dueDate}`
      ).join('\n')
      
      return `🚨 **High Priority Tasks:**
${urgentList}

💡 **Tip:** Focus on completing these urgent tasks first to avoid bottlenecks.`
    }

    // Team members
    if (lowerMessage.includes('team') || lowerMessage.includes('members') || lowerMessage.includes('colleagues')) {
      const memberList = teamMembers.map(member => {
        const memberTasks = tasks.filter(task => task.assignee === member)
        const completed = memberTasks.filter(task => task.status === 'completed').length
        return `• **${member}** (${memberTasks.length} tasks, ${completed} completed)`
      }).join('\n')
      
      return `👥 **Team Members:**
${memberList}

💡 **Tip:** You can assign tasks to team members when creating new tasks.`
    }

    // Help with task creation
    if (lowerMessage.includes('create') || lowerMessage.includes('add') || lowerMessage.includes('new task')) {
      return `📝 **Creating a New Task:**

1. **Click "Add New Task"** button on the Tasks page
2. **Fill in the details:**
   • Task Title (be specific and clear)
   • Priority (High/Medium/Low)
   • Due Date (set realistic deadlines)
   • Assignee (choose team member)

💡 **Pro Tips:**
• Break large tasks into smaller, manageable pieces
• Set due dates 1-2 days before the actual deadline
• Use high priority only for truly urgent tasks
• Assign tasks to the most suitable team member

Would you like me to help you with anything specific about task creation?`
    }

    // Task completion tips
    if (lowerMessage.includes('complete') || lowerMessage.includes('finish') || lowerMessage.includes('done')) {
      return `✅ **Task Completion Tips:**

1. **Start with high priority tasks** - tackle the most important ones first
2. **Use the Pomodoro Technique** - work in 25-minute focused sessions
3. **Break down complex tasks** - divide large tasks into smaller steps
4. **Set realistic deadlines** - better to finish early than miss deadlines
5. **Update status regularly** - mark tasks as "in progress" when you start
6. **Celebrate small wins** - acknowledge completed tasks

💡 **Remember:** Progress, not perfection! Even small steps count.`
    }

    // Productivity tips
    if (lowerMessage.includes('productivity') || lowerMessage.includes('efficient') || lowerMessage.includes('tips')) {
      return `🚀 **Productivity Tips:**

1. **Time Blocking** - Schedule specific times for different types of tasks
2. **Eliminate Distractions** - Turn off notifications during focused work
3. **Use the 2-Minute Rule** - If it takes less than 2 minutes, do it now
4. **Batch Similar Tasks** - Group similar activities together
5. **Take Regular Breaks** - Rest is essential for sustained productivity
6. **Review Daily** - Check your progress and plan for tomorrow

💡 **Focus on one task at a time for maximum efficiency!**`
    }

    // Help command
    if (lowerMessage.includes('help') || lowerMessage.includes('commands')) {
      return `🤖 **Available Commands:**

**Task Management:**
• "show stats" - Get task overview
• "list tasks" - Show recent tasks
• "urgent tasks" - Show high priority tasks
• "create task" - Get task creation help

**Team & Collaboration:**
• "team members" - Show team information
• "assign task" - Get assignment tips

**Productivity:**
• "completion tips" - Get task completion advice
• "productivity tips" - Get efficiency tips

**General:**
• "help" - Show this command list
• "hello" - Start a new conversation

What would you like to know?`
    }

    // Default response
    return `I understand you're asking about "${message}". 

Here are some things I can help you with:
• Task statistics and overview
• Creating and managing tasks
• Team member information
• Productivity tips
• Task completion strategies

Try asking me something like:
• "Show me my task stats"
• "What are my urgent tasks?"
• "Help me create a task"
• "Give me productivity tips"

What would you like help with?`
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    // Add user message
    addMessage(inputMessage, 'user')
    
    // Process command and get bot response
    const botResponse = processCommand(inputMessage)
    
    // Simulate typing and add bot response
    simulateTyping(() => {
      addMessage(botResponse, 'bot')
    })
    
    setInputMessage('')
  }

  const quickActions = [
    { label: '📊 Task Stats', command: 'show stats' },
    { label: '📋 List Tasks', command: 'list tasks' },
    { label: '🚨 Urgent Tasks', command: 'urgent tasks' },
    { label: '💡 Productivity Tips', command: 'productivity tips' }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-sm">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold">TaskXpert Assistant</h3>
              <p className="text-xs text-blue-100">Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="whitespace-pre-line text-sm">{message.content}</div>
              <div className={`text-xs mt-1 ${
                message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="p-2 border-t border-gray-200">
        <div className="flex flex-wrap gap-1 mb-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(action.command)}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about your tasks..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            autoFocus
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}

export default Chatbot

