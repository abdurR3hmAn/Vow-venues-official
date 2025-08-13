import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import About from './components/About'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Link to="/" className="text-2xl font-bold text-pink-600">
                    Vow Venues
                  </Link>
                </div>
                <div className="flex items-center space-x-4">
                  <Link to="/" className="text-gray-700 hover:text-pink-600">Home</Link>
                  <Link to="/about" className="text-gray-700 hover:text-pink-600">About</Link>
                  <Link to="/login" className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
