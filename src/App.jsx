import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-surface-100 to-surface-200 dark:from-surface-900 dark:via-surface-800 dark:to-surface-700">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 shadow-soft rounded-xl border border-surface-200 dark:border-surface-700"
        bodyClassName="text-sm font-medium"
        progressClassName="bg-primary"
      />
    </div>
  )
}

export default App