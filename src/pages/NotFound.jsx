import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-soft mb-6">
            <ApperIcon name="AlertTriangle" className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-surface-900 dark:text-surface-100 mb-4">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-surface-800 dark:text-surface-200 mb-4">
            Page Not Found
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mb-8 leading-relaxed">
            The page you're looking for seems to have wandered off. Let's get you back to organizing your tasks!
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 btn-primary"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            <span>Back to TaskFlow</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound