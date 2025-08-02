import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

// PUBLIC_INTERFACE
const AuthCallback = () => {
  /**
   * Authentication callback component that handles OAuth and email confirmation redirects
   * @returns {JSX.Element} Auth callback processing component
   */
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          navigate('/auth/error')
          return
        }

        if (data.session) {
          // Successful authentication - redirect to dashboard
          navigate('/')
        } else {
          // No session found - redirect to login
          navigate('/auth')
        }
      } catch (error) {
        console.error('Auth callback processing error:', error)
        navigate('/auth/error')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="auth-callback">
      <div className="auth-callback-content">
        <div className="loading-spinner"></div>
        <h2>Processing authentication...</h2>
        <p>Please wait while we complete your sign-in.</p>
      </div>

      <style jsx>{`
        .auth-callback {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-secondary);
        }
        
        .auth-callback-content {
          text-align: center;
          background-color: var(--bg-primary);
          padding: 3rem 2rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          max-width: 400px;
          width: 100%;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border);
          border-top: 3px solid var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 2rem;
        }
        
        .auth-callback-content h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        
        .auth-callback-content p {
          color: var(--text-secondary);
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default AuthCallback
