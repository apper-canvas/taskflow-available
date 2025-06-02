import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'pending'
  })

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks)
      setTasks(parsedTasks)
      setFilteredTasks(parsedTasks)
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
    applyFilters()
  }, [tasks, searchQuery, statusFilter, priorityFilter])

  const applyFilters = () => {
    let filtered = tasks

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    setFilteredTasks(filtered)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Task title is required!')
      return
    }

    if (editingTask) {
      // Update existing task
      const updatedTasks = tasks.map(task =>
        task.id === editingTask.id
          ? { ...task, ...formData, updatedAt: new Date().toISOString() }
          : task
      )
      setTasks(updatedTasks)
      toast.success('Task updated successfully!')
      setEditingTask(null)
    } else {
      // Create new task
      const newTask = {
        id: crypto.randomUUID(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setTasks([newTask, ...tasks])
      toast.success('Task created successfully!')
    }

    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      status: 'pending'
    })
    setShowTaskForm(false)
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      status: task.status
    })
    setShowTaskForm(true)
  }

  const handleDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully!')
  }

  const toggleTaskStatus = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { 
            ...task, 
            status: task.status === 'completed' ? 'pending' : 'completed',
            updatedAt: new Date().toISOString()
          }
        : task
    )
    setTasks(updatedTasks)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-surface-600 bg-surface-50 border-surface-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-surface-600 bg-surface-100'
      case 'in-progress': return 'text-blue-600 bg-blue-100'
      case 'completed': return 'text-green-600 bg-green-100'
      default: return 'text-surface-600 bg-surface-100'
    }
  }

  const formatDueDate = (dateString) => {
    if (!dateString) return ''
    
    const date = parseISO(dateString)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'MMM d, yyyy')
  }

  const isDueSoon = (dateString) => {
    if (!dateString) return false
    const date = parseISO(dateString)
    return isToday(date) || isTomorrow(date)
  }

  const isOverdue = (dateString) => {
    if (!dateString) return false
    const date = parseISO(dateString)
    return isPast(date) && !isToday(date)
  }

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    overdue: tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'completed').length
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Dashboard */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
      >
        {[
          { label: 'Total Tasks', value: taskStats.total, icon: 'List', color: 'primary' },
          { label: 'Completed', value: taskStats.completed, icon: 'CheckCircle', color: 'green' },
          { label: 'Pending', value: taskStats.pending, icon: 'Clock', color: 'yellow' },
          { label: 'Overdue', value: taskStats.overdue, icon: 'AlertTriangle', color: 'red' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="task-card p-4 sm:p-6 hover-lift"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100">
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 sm:p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                <ApperIcon name={stat.icon} className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-8"
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 sm:gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field py-2 px-3 text-sm min-w-[120px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-field py-2 px-3 text-sm min-w-[120px]"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setShowTaskForm(true)
            setEditingTask(null)
            setFormData({
              title: '',
              description: '',
              priority: 'medium',
              dueDate: '',
              status: 'pending'
            })
          }}
          className="btn-primary flex items-center space-x-2 justify-center lg:justify-start"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>Add Task</span>
        </motion.button>
      </motion.div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {showTaskForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowTaskForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h3>
                <button
                  onClick={() => setShowTaskForm(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="input-field"
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="input-field h-24 resize-none"
                    placeholder="Enter task description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="input-field"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTaskForm(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-surface-100 dark:bg-surface-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="CheckSquare" className="w-12 h-12 text-surface-400" />
              </div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
              </h3>
              <p className="text-surface-600 dark:text-surface-400">
                {tasks.length === 0 
                  ? 'Create your first task to get started with TaskFlow!'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={`task-card p-4 sm:p-6 ${task.status === 'completed' ? 'task-card-completed' : ''}`}
              >
                <div className="flex items-start gap-4">
                  {/* Priority Indicator */}
                  <div className={`priority-indicator priority-${task.priority} mt-1`}></div>
                  
                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-surface-900 dark:text-surface-100 mb-1 ${
                          task.status === 'completed' ? 'line-through opacity-60' : ''
                        }`}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">
                            {task.description}
                          </p>
                        )}
                        
                        {/* Task Meta */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`status-badge ${getStatusColor(task.status)}`}>
                            {task.status.replace('-', ' ')}
                          </span>
                          <span className={`category-badge ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          {task.dueDate && (
                            <span className={`text-xs px-2 py-1 rounded-md ${
                              isOverdue(task.dueDate) && task.status !== 'completed'
                                ? 'bg-red-100 text-red-600 border border-red-200'
                                : isDueSoon(task.dueDate)
                                ? 'bg-yellow-100 text-yellow-600 border border-yellow-200'
                                : 'bg-surface-100 text-surface-600 border border-surface-200'
                            }`}>
                              <ApperIcon name="Calendar" className="w-3 h-3 inline mr-1" />
                              {formatDueDate(task.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Task Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            task.status === 'completed'
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600'
                          }`}
                        >
                          <ApperIcon 
                            name={task.status === 'completed' ? 'CheckCircle' : 'Circle'} 
                            className="w-5 h-5" 
                          />
                        </button>
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                        >
                          <ApperIcon name="Edit" className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        >
                          <ApperIcon name="Trash2" className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default MainFeature