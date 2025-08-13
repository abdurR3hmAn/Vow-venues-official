import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomeScreen from '../HomeScreen'
import LoginScreen from '../LoginScreen'
import AboutScreen from '../AboutScreen'
import FeedbackScreen from '../FeedbackScreen'
import PaymentScreen from '../PaymentScreen'
import HallUploadScreen from '../HallUploadScreen'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/about" element={<AboutScreen />} />
            <Route path="/feedback" element={<FeedbackScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/upload" element={<HallUploadScreen />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
