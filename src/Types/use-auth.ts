 
import { useContext } from 'react'
import { AuthContext } from '../Context/auth-context'
import type { AuthContextType } from '../Types/auth'

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }

  return context
}