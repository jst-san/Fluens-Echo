import type { User } from './types'
import type { NewUser as RepoNewUser } from './repository'
import {
  createUser as repoCreateUser,
  getUserByEmail,
  getUserById,
  updateUser as repoUpdateUser,
  deleteUser as repoDeleteUser,
  listUsers as repoListUsers,
} from './repository'

import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto'
import { promisify } from 'util'
const scrypt = promisify(_scrypt)
const SCRYPT_KEYLEN = 64

export type PublicUser = Omit<User, 'password'>

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derived = (await scrypt(password, salt, SCRYPT_KEYLEN)) as Buffer
  return `${salt}:${derived.toString('hex')}`
import type { User } from './types'
import type { NewUser as RepoNewUser } from './repository'
import {
  createUser as repoCreateUser,
  getUserByEmail,
  getUserById,
  updateUser as repoUpdateUser,
  deleteUser as repoDeleteUser,
  listUsers as repoListUsers,
} from './repository'

import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

export type PublicUser = Omit<User, 'password'>

const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d'

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

function sanitize(u: User): PublicUser {
  const { password, ...rest } = u as any
  return rest as PublicUser
}

export async function registerUser(data: RepoNewUser): Promise<PublicUser> {
  const existing = await getUserByEmail(data.email)
  if (existing) throw new Error('Email sudah terdaftar')
  const hashed = await hashPassword(data.password)
  const created = await repoCreateUser({ ...data, password: hashed })
  return sanitize(created)
}

export async function authenticateUser(email: string, password: string): Promise<PublicUser | null> {
  const user = await getUserByEmail(email)
  if (!user) return null
  const ok = await verifyPassword(password, user.password)
  if (!ok) return null
  return sanitize(user)
}

export function issueToken(user: PublicUser): string {
  const payload = { sub: user.id, email: user.email }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

export function verifyToken(token: string): { sub: number; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return { sub: decoded.sub, email: decoded.email }
  } catch (e) {
    return null
  }
}

export async function loginUser(email: string, password: string): Promise<{ user: PublicUser; token: string } | null> {
  const u = await authenticateUser(email, password)
  if (!u) return null
  const token = issueToken(u)
  return { user: u, token }
}

export async function getUserSafeById(id: number): Promise<PublicUser | null> {
  const user = await getUserById(id)
  return user ? sanitize(user) : null
}

export async function updateUser(id: number, updates: Partial<RepoNewUser>): Promise<PublicUser | null> {
  const u: any = { ...updates }
  if (u.password) {
    u.password = await hashPassword(u.password)
  }
  const updated = await repoUpdateUser(id, u)
  return updated ? sanitize(updated) : null
}

export async function changePassword(id: number, oldPassword: string, newPassword: string): Promise<boolean> {
  const user = await getUserById(id)
  if (!user) throw new Error('User tidak ditemukan')
  const ok = await verifyPassword(oldPassword, user.password)
  if (!ok) throw new Error('Password lama salah')
  const hashed = await hashPassword(newPassword)
  const updated = await repoUpdateUser(id, { password: hashed })
  return !!updated
}

export async function deleteUser(id: number): Promise<boolean> {
  return repoDeleteUser(id)
}

export async function listAllUsers(limit = 100, offset = 0): Promise<PublicUser[]> {
  const users = await repoListUsers(limit, offset)
  return users.map(sanitize)
}