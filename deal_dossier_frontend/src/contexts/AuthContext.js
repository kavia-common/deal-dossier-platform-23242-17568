import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

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

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    loading,
    signUp: (email, password) => supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: process.env.REACT_APP_SITE_URL || 'http://localhost:3000'
      }
    }),
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
