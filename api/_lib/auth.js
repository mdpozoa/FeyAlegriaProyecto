import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'safecampus-dev-secret-CHANGE-IN-PRODUCTION'

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

// Extrae y valida el JWT del header Authorization o query param ?token=
export function getUser(req) {
  const authHeader = req.headers['authorization']
  const token = (authHeader && authHeader.split(' ')[1]) || req.query?.token
  if (!token) return null
  try {
    return verifyToken(token)
  } catch {
    return null
  }
}

export function requireAuth(req, res) {
  const user = getUser(req)
  if (!user) {
    res.status(401).json({ error: 'No autenticado. Token requerido.' })
    return null
  }
  return user
}

export function requireAuthority(req, res) {
  const user = requireAuth(req, res)
  if (!user) return null
  if (user.rol !== 'AUTORIDAD') {
    res.status(403).json({ error: 'Acceso solo para autoridades' })
    return null
  }
  return user
}
