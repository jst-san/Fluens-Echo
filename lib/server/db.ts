// import { Pool } from 'pg'

// declare global {
//   var dbPool: Pool | undefined
// }

// export const pool = globalThis.dbPool ?? new Pool({
//     user: "fyn",
//     database: "flowform",
//     password: "101110",
//     port: 5432,
//     host: "root",
// })

// if (process.env.NODE_ENV !== 'production') {
//   globalThis.dbPool = pool
// }

import {supabase as db} from "./supabase"

export default db