import bcrypt from 'bcryptjs'

// Verify password against stored hash
export async function verifyPassword(password: string): Promise<boolean> {
  const storedHash = process.env.ADMIN_PASSWORD_HASH

  if (!storedHash) {
    console.error('ADMIN_PASSWORD_HASH environment variable not set')
    return false
  }

  try {
    return await bcrypt.compare(password, storedHash)
  } catch (error) {
    console.error('Password verification error:', error)
    return false
  }
}

// Generate a password hash (utility for setup)
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}
