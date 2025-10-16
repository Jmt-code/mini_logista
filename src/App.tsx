import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import FormPage from './pages/FormPage'
import './App.css'

function App() {
  return (
    <Router basename="/mini_logista">
      <div className="app">
        <Routes>
          <Route path="/" element={<FormPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
