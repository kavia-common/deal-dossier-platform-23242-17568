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
        // First, check if this is an auth callback with URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const accessToken = urlParams.get('access_token')
        const authCode = urlParams.get('code')
        const error = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')

        // Handle error from URL parameters
        if (error) {
          console.error('Auth callback URL error:', error, errorDescription)
          navigate('/auth/error')
          return
        }

        // If we have auth parameters, exchange them for a session
        if (accessToken || authCode) {
          console.log('Processing auth callback with parameters')
          
          // For email confirmation or OAuth, exchange the code for session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.search)
          
          if (exchangeError) {
            console.error('Auth code exchange error:', exchangeError)
            // Try getting session as fallback
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
            
            if (sessionError || !sessionData.session) {
              navigate('/auth/error')
              return
            }
            
            // Session exists, redirect to dashboard
            console.log('Successfully authenticated via fallback session check')
            navigate('/')
            return
          }
          
          if (data.session) {
            console.log('Successfully authenticated via code exchange')
            navigate('/')
            return
          }
        }

        // Fallback: just check for existing session
        const { data, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('Auth callback session error:', sessionError)
          navigate('/auth/error')
          return
        }

        if (data.session) {
          // Successful authentication - redirect to dashboard
          console.log('Successfully authenticated via session check')
          navigate('/')
        } else {
          // No session found - redirect to login
          console.log('No session found, redirecting to auth')
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
