import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 px-4 sm:px-6 lg:px-8 py-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-soft flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-white dark:border-surface-800 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gradient">TaskFlow</h1>
              <p className="text-xs text-surface-600 dark:text-surface-400 font-medium">Streamline Your Productivity</p>
            </div>
          </motion.div>

          <motion.button
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            onClick={toggleDarkMode}
            className="p-3 rounded-xl bg-white/10 dark:bg-surface-800/50 backdrop-blur-lg border border-white/20 dark:border-surface-700/50 hover:bg-white/20 dark:hover:bg-surface-700/50 transition-all duration-300 group"
          >
            <ApperIcon 
              name={isDarkMode ? "Sun" : "Moon"} 
              className="w-5 h-5 text-surface-700 dark:text-surface-300 group-hover:scale-110 transition-transform duration-200" 
            />
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-0">
        <MainFeature />
      </main>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 0, y: 100 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-secondary/5 to-accent/5 rounded-full blur-3xl"
        />
      </div>
    </div>
  )
}

export default Home