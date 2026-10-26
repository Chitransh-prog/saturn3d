// Supabase has been completely removed in favor of local SQLite + pure JWT auth.
// This file re-exports the local SQLite database client for full backwards compatibility.

import db from './db.js';

export const supabase = db;
export const supabaseAnon = db;
export default db;
