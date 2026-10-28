import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'saturn3d.db');
const sqlite = new DatabaseSync(dbPath);

sqlite.exec('PRAGMA journal_mode = WAL;');
sqlite.exec('PRAGMA foreign_keys = ON;');

console.log('[Seed] Initializing Saturn 3D SQLite database at:', dbPath);

const targetEmail = 'saturn3d@gmail.com';
const defaultPassword = 'Saturn3D@123';
const passwordHash = bcrypt.hashSync(defaultPassword, 10);
const now = new Date().toISOString();

// Check if saturn3d@gmail.com exists
const existing = sqlite.prepare('SELECT id, email FROM users WHERE email = ?').get(targetEmail);
if (existing) {
  sqlite.prepare('UPDATE users SET password = ?, role = \'admin\', is_blocked = 0, updated_at = ? WHERE id = ?')
    .run(passwordHash, now, existing.id);
  console.log(`[Seed] Updated admin credentials for ${targetEmail} (password: ${defaultPassword})`);
} else {
  // Update old admin or create new
  const oldAdmin = sqlite.prepare('SELECT id FROM users WHERE role = \'admin\' LIMIT 1').get();
  if (oldAdmin) {
    sqlite.prepare('UPDATE users SET email = ?, password = ?, name = \'Saturn 3D Admin\', updated_at = ? WHERE id = ?')
      .run(targetEmail, passwordHash, now, oldAdmin.id);
    console.log(`[Seed] Migrated existing admin to ${targetEmail} (password: ${defaultPassword})`);
  } else {
    sqlite.prepare('INSERT INTO users (id, email, password, name, role, is_blocked, created_at, updated_at) VALUES (?, ?, ?, ?, \'admin\', 0, ?, ?)')
      .run(crypto.randomUUID(), targetEmail, passwordHash, 'Saturn 3D Admin', now, now);
    console.log(`[Seed] Created default admin ${targetEmail} (password: ${defaultPassword})`);
  }
}

console.log('✨ Admin credentials verified:');
console.log('   Email:    saturn3d@gmail.com');
console.log('   Password: Saturn3D@123');
