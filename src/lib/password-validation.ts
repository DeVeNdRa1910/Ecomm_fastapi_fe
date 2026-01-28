// Password validation matching backend requirements
export const validatePassword = (password: string): string | null => {
  if (!password.trim()) {
    return "Password field can't be empty"
  }
  
  if (password.length < 8 || password.length > 20) {
    return "Password must be between 8 and 20 characters"
  }
  
  if (!/[a-z]/.test(password)) {
    return "Password should contain at least one lowercase letter"
  }
  
  if (!/[A-Z]/.test(password)) {
    return "Password should contain at least one uppercase letter"
  }
  
  if (!/\d/.test(password)) {
    return "Password should contain at least one number"
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password should contain at least one special character (!@#$%^&*(),.?\":{}|<>)"
  }
  
  return null
}

