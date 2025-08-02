import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  supabase, 
  signUp as supabaseSignUp, 
  signIn as supabaseSignIn, 
  signOut as supabaseSignOut,
  resetPassword,
  signInWithMagicLink,
  signInWithOAuth
} from '../lib/supabase'

const AuthContext = createContext({})

// PUBLIC_INTERFACE
export const useAuth = () => {
  /**
   * Hook to access authentication context
   * @returns {Object} Authentication context value
   */
  return useContext(AuthContext)
}

// PUBLIC_INTERFACE
export const AuthProvider = ({ children }) => {
  /**
   * Authentication provider component that manages user state
   * @param {Object} props - Component props
   * @param {React.ReactNode} props.children - Child components
   * @returns {JSX.Element} Provider component
   */
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          // Clear any local storage or cached data
          localStorage.removeItem('supabase-auth-token')
        }
        
        if (event === 'SIGNED_IN') {
          console.log('User signed in successfully:', session?.user?.email)
        }
        
        if (event === 'TOKEN_REFRESHED') {
          console.log('Auth token refreshed')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    session,
    loading,
    signUp: supabaseSignUp,
    signIn: supabaseSignIn,
    signOut: supabaseSignOut,
    resetPassword,
    signInWithMagicLink,
    signInWithOAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
