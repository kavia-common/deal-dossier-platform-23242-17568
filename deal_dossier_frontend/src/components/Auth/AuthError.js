import React from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { AlertCircle, Mail, ExternalLink } from 'lucide-react'

// PUBLIC_INTERFACE
const AuthError = () => {
  /**
   * Authentication error page component that displays appropriate error messages
   * @returns {JSX.Element} Auth error component
   */
  const [searchParams] = useSearchParams()
  const errorType = searchParams.get('type')

  const getErrorContent = () => {
    switch (errorType) {
      case 'redirect':
        return {
          title: 'Redirect URL Error',
          message: 'The redirect URL is not in the allowed list. Please contact your administrator.',
          details: 'This error occurs when the authentication redirect URL is not configured in your Supabase project settings.',
          action: 'Contact Administrator'
        }
      case 'email':
        return {
          title: 'Email Confirmation Required',
          message: 'Please check your email and click the confirmation link.',
          details: 'You may need to check your spam folder or request a new confirmation email.',
          action: 'Resend Email'
        }
      default:
        return {
          title: 'Authentication Error',
          message: 'An error occurred during authentication. Please try again.',
          details: 'If this problem persists, please contact support.',
          action: 'Try Again'
        }
    }
  }

  const errorContent = getErrorContent()

  return (
    <div className="auth-error">
      <div className="auth-error-content">
        <div className="error-icon">
          <AlertCircle size={48} />
        </div>
        
        <h1>{errorContent.title}</h1>
        <p className="error-message">{errorContent.message}</p>
        <p className="error-details">{errorContent.details}</p>
        
        <div className="error-actions">
          <Link to="/auth" className="btn btn-primary">
            Back to Sign In
          </Link>
          
          {errorType === 'email' && (
            <button className="btn btn-secondary">
              <Mail size={16} />
              Resend Confirmation
            </button>
          )}
          
          {errorType === 'redirect' && (
            <a 
              href="mailto:support@dealdossier.com" 
              className="btn btn-secondary"
            >
              <ExternalLink size={16} />
              Contact Support
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
        .auth-error {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-secondary);
          padding: 1rem;
        }
        
        .auth-error-content {
          text-align: center;
          background-color: var(--bg-primary);
          padding: 3rem 2rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          max-width: 500px;
          width: 100%;
        }
        
        .error-icon {
          color: var(--error);
          margin-bottom: 1.5rem;
        }
        
        .auth-error-content h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }
        
        .error-message {
          font-size: 1.125rem;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }
        
        .error-details {
          color: var(--text-secondary);
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        
        .error-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }
        
        @media (min-width: 480px) {
          .error-actions {
            flex-direction: row;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default AuthError
