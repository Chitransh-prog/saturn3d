import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import db from '@/lib/db';
import { getAuthUser, signJwtToken, attachAuthCookie } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/credentials
 * Returns list of all admin accounts and current authenticated admin
 */
export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      );
    }

    const admins = db.query(
      "SELECT id, email, name, role, is_blocked, created_at, updated_at FROM users WHERE role = 'admin' ORDER BY created_at ASC"
    ) as any[];

    return NextResponse.json({
      success: true,
      data: {
        admins,
        currentAdminId: authUser.userId,
      },
    });
  } catch (error: any) {
    console.error('[API /api/admin/credentials GET] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/credentials
 * Adds a new administrator account (email, name, password)
 */
export async function POST(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { email, name, password } = body;

    if (!email || !email.trim() || !password || !password.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const adminName = (name && name.trim()) || 'Saturn Admin';
    const existing = db.get<{ id: string; role: string }>('SELECT id, role FROM users WHERE LOWER(email) = ?', [cleanEmail]);

    const now = new Date().toISOString();
    const hashedPassword = bcrypt.hashSync(password, 10);

    if (existing) {
      if (existing.role === 'admin') {
        return NextResponse.json(
          { success: false, error: 'An administrator with this email already exists' },
          { status: 409 }
        );
      }
      // Upgrade existing customer to admin
      db.run(
        "UPDATE users SET role = 'admin', name = ?, password = ?, is_blocked = 0, updated_at = ? WHERE id = ?",
        [adminName, hashedPassword, now, existing.id]
      );

      return NextResponse.json({
        success: true,
        message: `Upgraded user ${cleanEmail} to administrator successfully`,
        data: {
          admin: { id: existing.id, email: cleanEmail, name: adminName, role: 'admin' },
        },
      });
    }

    // Insert new admin record
    const newAdminId = crypto.randomUUID();
    db.run(
      "INSERT INTO users (id, email, password, name, role, is_blocked, created_at, updated_at) VALUES (?, ?, ?, ?, 'admin', 0, ?, ?)",
      [newAdminId, cleanEmail, hashedPassword, adminName, now, now]
    );

    // Record audit log
    try {
      db.run(
        `INSERT INTO audit_logs (id, admin_id, action, target_type, target_id, details, ip_address, created_at)
         VALUES (?, ?, 'CREATE_ADMIN', 'user', ?, ?, ?, ?)`,
        [
          crypto.randomUUID(),
          authUser.userId,
          newAdminId,
          JSON.stringify({ createdEmail: cleanEmail, name: adminName }),
          req.headers.get('x-forwarded-for') || '127.0.0.1',
          now,
        ]
      );
    } catch (auditErr) {
      console.warn('[Audit Log] Failed to record:', auditErr);
    }

    return NextResponse.json({
      success: true,
      message: `Administrator ${cleanEmail} created successfully`,
      data: {
        admin: { id: newAdminId, email: cleanEmail, name: adminName, role: 'admin', created_at: now },
      },
    });
  } catch (error: any) {
    console.error('[API /api/admin/credentials POST] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/credentials
 * Update any specific administrator's password, email, or name by adminId
 */
export async function PUT(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { adminId, newPassword, newEmail, name } = body;

    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'Target adminId is required' },
        { status: 400 }
      );
    }

    const targetAdmin = db.get<{
      id: string;
      email: string;
      password: string;
      name: string;
      role: string;
    }>("SELECT * FROM users WHERE id = ? AND role = 'admin'", [adminId]);

    if (!targetAdmin) {
      return NextResponse.json(
        { success: false, error: 'Administrator not found' },
        { status: 404 }
      );
    }

    let updatedEmail = targetAdmin.email;
    let updatedPasswordHash = targetAdmin.password;
    let updatedName = targetAdmin.name;
    const now = new Date().toISOString();

    if (name && name.trim()) {
      updatedName = name.trim();
    }

    if (newEmail && newEmail.trim() !== '') {
      const cleanEmail = newEmail.trim().toLowerCase();
      if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        return NextResponse.json(
          { success: false, error: 'Please enter a valid email address' },
          { status: 400 }
        );
      }
      if (cleanEmail !== targetAdmin.email.toLowerCase()) {
        const existing = db.get('SELECT id FROM users WHERE LOWER(email) = ? AND id != ?', [cleanEmail, targetAdmin.id]);
        if (existing) {
          return NextResponse.json(
            { success: false, error: 'Email address already in use by another account' },
            { status: 409 }
          );
        }
        updatedEmail = cleanEmail;
      }
    }

    if (newPassword && newPassword.trim() !== '') {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: 'Password must be at least 6 characters' },
          { status: 400 }
        );
      }
      updatedPasswordHash = bcrypt.hashSync(newPassword, 10);
    }

    db.run(
      'UPDATE users SET email = ?, password = ?, name = ?, updated_at = ? WHERE id = ?',
      [updatedEmail, updatedPasswordHash, updatedName, now, targetAdmin.id]
    );

    // Record audit log
    try {
      db.run(
        `INSERT INTO audit_logs (id, admin_id, action, target_type, target_id, details, ip_address, created_at)
         VALUES (?, ?, 'UPDATE_ADMIN_PASSWORD', 'user', ?, ?, ?, ?)`,
        [
          crypto.randomUUID(),
          authUser.userId,
          targetAdmin.id,
          JSON.stringify({ updatedEmail, nameChanged: updatedName !== targetAdmin.name, passwordChanged: !!newPassword }),
          req.headers.get('x-forwarded-for') || '127.0.0.1',
          now,
        ]
      );
    } catch (auditErr) {
      console.warn('[Audit Log] Failed to record:', auditErr);
    }

    return NextResponse.json({
      success: true,
      message: `Administrator ${updatedEmail} updated successfully`,
      data: {
        admin: {
          id: targetAdmin.id,
          email: updatedEmail,
          name: updatedName,
          role: 'admin',
          updated_at: now,
        },
      },
    });
  } catch (error: any) {
    console.error('[API /api/admin/credentials PUT] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/credentials
 * Remove an administrator account
 */
export async function DELETE(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const adminId = searchParams.get('adminId');

    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'adminId is required' },
        { status: 400 }
      );
    }

    // Safety check: ensure at least one admin remains
    const adminCount = (
      db.get<{ count: number }>("SELECT COUNT(*) as count FROM users WHERE role = 'admin'") || { count: 1 }
    ).count;

    if (adminCount <= 1) {
      return NextResponse.json(
        { success: false, error: 'Cannot remove the sole administrator on the system' },
        { status: 400 }
      );
    }

    db.run("DELETE FROM users WHERE id = ? AND role = 'admin'", [adminId]);

    return NextResponse.json({
      success: true,
      message: 'Administrator removed successfully',
    });
  } catch (error: any) {
    console.error('[API /api/admin/credentials DELETE] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/credentials
 * Update currently logged-in admin's own credentials (with current password verification)
 */
export async function PATCH(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { currentPassword, newEmail, newPassword } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password is required to update credentials' },
        { status: 400 }
      );
    }

    // Fetch existing admin record
    const admin = db.get<{
      id: string;
      email: string;
      password: string;
      name: string;
      role: 'admin';
    }>('SELECT id, email, password, name, role FROM users WHERE id = ?', [authUser.userId]);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin record not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordValid = bcrypt.compareSync(currentPassword, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Incorrect current password' },
        { status: 401 }
      );
    }

    let updatedEmail = admin.email;
    let updatedPasswordHash = admin.password;
    const now = new Date().toISOString();

    // Check new email
    if (newEmail && newEmail.trim() !== '') {
      const cleanNewEmail = newEmail.trim().toLowerCase();
      if (!cleanNewEmail.includes('@') || !cleanNewEmail.includes('.')) {
        return NextResponse.json(
          { success: false, error: 'Please provide a valid email address' },
          { status: 400 }
        );
      }

      if (cleanNewEmail !== admin.email.toLowerCase()) {
        const existing = db.get('SELECT id FROM users WHERE LOWER(email) = ? AND id != ?', [cleanNewEmail, admin.id]);
        if (existing) {
          return NextResponse.json(
            { success: false, error: 'Email address already in use by another account' },
            { status: 409 }
          );
        }
        updatedEmail = cleanNewEmail;
      }
    }

    // Check new password
    if (newPassword && newPassword.trim() !== '') {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: 'New password must be at least 6 characters long' },
          { status: 400 }
        );
      }
      updatedPasswordHash = bcrypt.hashSync(newPassword, 10);
    }

    // Execute update in SQLite
    db.run(
      `UPDATE users 
       SET email = ?, password = ?, updated_at = ?
       WHERE id = ?`,
      [updatedEmail, updatedPasswordHash, now, admin.id]
    );

    // Record audit log
    try {
      db.run(
        `INSERT INTO audit_logs (id, admin_id, action, target_type, target_id, details, ip_address, created_at)
         VALUES (?, ?, 'UPDATE_CREDENTIALS', 'user', ?, ?, ?, ?)`,
        [
          crypto.randomUUID(),
          admin.id,
          admin.id,
          JSON.stringify({ updatedEmail, passwordChanged: !!newPassword }),
          req.headers.get('x-forwarded-for') || '127.0.0.1',
          now,
        ]
      );
    } catch (auditErr) {
      console.warn('[Audit Log] Failed to record:', auditErr);
    }

    // Re-sign token with updated email
    const newToken = signJwtToken({
      userId: admin.id,
      email: updatedEmail,
      name: admin.name,
      role: 'admin',
    });

    const res = NextResponse.json({
      success: true,
      message: 'Admin credentials updated successfully',
      data: {
        user: {
          id: admin.id,
          email: updatedEmail,
          name: admin.name,
          role: 'admin',
        },
        token: newToken,
      },
    });

    return attachAuthCookie(res, newToken);
  } catch (error: any) {
    console.error('[API /api/admin/credentials PATCH] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
