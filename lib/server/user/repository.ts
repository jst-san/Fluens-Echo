import { pool } from "../db"
import type { User } from "./types"

export type NewUser = {
    name: string
    email: string
    password: string
}

export async function createUser(data: NewUser): Promise<User> {
    const { name, email, password } = data
    const q = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, password, created_at, updated_at`
    const res = await pool.query(q, [name, email, password])
    return res.rows[0] as User
}

export async function getUserById(id: number): Promise<User | null> {
    const q = `SELECT id, name, email, password, created_at, updated_at FROM users WHERE id = $1 LIMIT 1`
    const res = await pool.query(q, [id])
    return res.rows[0] ?? null
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const q = `SELECT id, name, email, password, created_at, updated_at FROM users WHERE email = $1 LIMIT 1`
    const res = await pool.query(q, [email])
    return res.rows[0] ?? null
}

export async function updateUser(id: number, updates: Partial<NewUser>): Promise<User | null> {
    const keys = Object.keys(updates)
    if (keys.length === 0) return getUserById(id)
    const sets: string[] = []
    const values: any[] = []
    keys.forEach((k, i) => {
        sets.push(`${k} = $${i + 1}`)
        values.push((updates as any)[k])
    })
    const idx = values.length + 1
    const q = `UPDATE users SET ${sets.join(', ')} WHERE id = $${idx} RETURNING id, name, email, password, created_at, updated_at`
    values.push(id)
    const res = await pool.query(q, values)
    return res.rows[0] ?? null
}

export async function deleteUser(id: number): Promise<boolean> {
    const q = `DELETE FROM users WHERE id = $1`
    const res = await pool.query(q, [id])
    return res.rowCount ? true : false
}

export async function listUsers(limit = 100, offset = 0): Promise<User[]> {
    const q = `SELECT id, name, email, password, created_at, updated_at FROM users ORDER BY id description LIMIT $1 OFFSET $2`
    const res = await pool.query(q, [limit, offset])
    return res.rows as User[]
}





