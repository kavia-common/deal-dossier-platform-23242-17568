// PUBLIC_INTERFACE
export const getURL = () => {
  /**
   * Get the site URL from environment variables that allows easy switching 
   * between development and production environments
   * @returns {string} Properly formatted site URL
   */
  let url = process.env.REACT_APP_SITE_URL || 'http://localhost:3000'

  // Ensure URL starts with http/https
  if (!url.startsWith('http')) {
    url = `https://${url}`
  }

  // Ensure URL ends with /
  if (!url.endsWith('/')) {
    url = `${url}/`
  }

  return url
}

// PUBLIC_INTERFACE
export const getCallbackURL = (path = 'auth/callback') => {
  /**
   * Get the callback URL for authentication redirects
   * @param {string} path - Callback path (default: 'auth/callback')
   * @returns {string} Full callback URL
   */
  return `${getURL()}${path}`
}
