import React, { useState } from 'react'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp'
import Dashboard from '../pages/Dashboard'

const AuthPage = () => {
  const [currentPage, setCurrentPage] = useState('login') // 'login', 'signup', or 'dashboard'
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const switchToSignUp = () => {
    setCurrentPage('signup')
  }

  const switchToLogin = () => {
    setCurrentPage('login')
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentPage('login')
  }

  // If user is authenticated, show dashboard
  if (isAuthenticated && currentPage === 'dashboard') {
    return <Dashboard onLogout={handleLogout} />
  }

  // Otherwise show auth pages
  return (
    <>
      {currentPage === 'login' ? (
        <Login 
          onSwitchToSignUp={switchToSignUp} 
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <SignUp 
          onSwitchToLogin={switchToLogin}
          onSignUpSuccess={handleLoginSuccess}
        />
      )}
    </>
  )
}

export default AuthPage
