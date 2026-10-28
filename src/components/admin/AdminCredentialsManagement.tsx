'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  KeyRound, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Loader2, 
  Save, 
  CheckCircle2, 
  AlertTriangle,
  UserPlus,
  Users,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  X,
  Shield,
  Calendar,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { adminApi, getApiError, type User } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function AdminCredentialsManagement() {
  const { user: currentUser, updateUser, login } = useAuthStore();

  // ─── Administrator Roster State ──────────────────────────────────────────────
  const [admins, setAdmins] = useState<User[]>([]);
  const [currentAdminId, setCurrentAdminId] = useState<string>('');
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  // ─── Add New Admin State ────────────────────────────────────────────────────
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminConfirmPassword, setNewAdminConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  // ─── Update Specific Admin Password Modal / Row State ────────────────────────
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);
  const [editAdminPassword, setEditAdminPassword] = useState('');
  const [editAdminConfirmPassword, setEditAdminConfirmPassword] = useState('');
  const [editAdminEmail, setEditAdminEmail] = useState('');
  const [editAdminName, setEditAdminName] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [updatingAdmin, setUpdatingAdmin] = useState(false);

  // ─── Delete Admin State ─────────────────────────────────────────────────────
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ─── Self Credential Update State (Current Session) ──────────────────────────
  const [myCurrentPassword, setMyCurrentPassword] = useState('');
  const [myNewEmail, setMyNewEmail] = useState(currentUser?.email || 'saturn3d@gmail.com');
  const [myNewPassword, setMyNewPassword] = useState('');
  const [myConfirmPassword, setMyConfirmPassword] = useState('');
  const [savingSelf, setSavingSelf] = useState(false);
  const [selfSuccessMsg, setSelfSuccessMsg] = useState('');

  // ─── Fetch Admins List ───────────────────────────────────────────────────────
  const fetchAdmins = useCallback(async () => {
    setLoadingAdmins(true);
    try {
      const res = await adminApi.getAdmins();
      if (res.data.success && res.data.data) {
        setAdmins(res.data.data.admins);
        setCurrentAdminId(res.data.data.currentAdminId || currentUser?.id || '');
      }
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoadingAdmins(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Keep self email synced if store changes
  useEffect(() => {
    if (currentUser?.email) {
      setMyNewEmail(currentUser.email);
    }
  }, [currentUser?.email]);

  // ─── Handle Add New Admin ────────────────────────────────────────────────────
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAdminEmail.trim() || !newAdminPassword.trim()) {
      toast.error('Email and initial password are required');
      return;
    }

    const cleanEmail = newAdminEmail.trim().toLowerCase();
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (newAdminPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newAdminPassword !== newAdminConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setCreatingAdmin(true);
    try {
      const res = await adminApi.createAdmin({
        email: cleanEmail,
        name: newAdminName.trim() || undefined,
        password: newAdminPassword,
      });

      if (res.data.success) {
        toast.success(res.data.message || `Administrator ${cleanEmail} created successfully!`);
        setNewAdminEmail('');
        setNewAdminName('');
        setNewAdminPassword('');
        setNewAdminConfirmPassword('');
        fetchAdmins();
      }
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setCreatingAdmin(false);
    }
  };

  // ─── Handle Open Edit Admin Modal ────────────────────────────────────────────
  const handleOpenEdit = (admin: User) => {
    setEditingAdmin(admin);
    setEditAdminEmail(admin.email);
    setEditAdminName(admin.name || '');
    setEditAdminPassword('');
    setEditAdminConfirmPassword('');
    setShowEditPassword(false);
  };

  // ─── Handle Submit Update Admin Password / Info ──────────────────────────────
  const handleUpdateAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    if (editAdminPassword) {
      if (editAdminPassword.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      if (editAdminPassword !== editAdminConfirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }

    setUpdatingAdmin(true);
    try {
      const res = await adminApi.updateAdminPassword({
        adminId: editingAdmin.id,
        newPassword: editAdminPassword || undefined,
        newEmail: editAdminEmail.trim().toLowerCase() !== editingAdmin.email ? editAdminEmail.trim().toLowerCase() : undefined,
        name: editAdminName.trim() || undefined,
      });

      if (res.data.success) {
        toast.success(res.data.message || `Updated credentials for ${editingAdmin.email}`);
        setEditingAdmin(null);
        fetchAdmins();

        // If updated the currently logged in admin's own email/name
        if (editingAdmin.id === currentAdminId && res.data.data?.admin) {
          updateUser(res.data.data.admin);
        }
      }
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setUpdatingAdmin(false);
    }
  };

  // ─── Handle Delete Admin ─────────────────────────────────────────────────────
  const handleDeleteAdmin = async (admin: User) => {
    if (admins.length <= 1) {
      toast.error('Cannot remove the sole administrator on the system');
      return;
    }

    const confirm = window.confirm(`Revoke administrator access for ${admin.email}? This action is immediate.`);
    if (!confirm) return;

    setDeletingId(admin.id);
    try {
      const res = await adminApi.deleteAdmin(admin.id);
      if (res.data.success) {
        toast.success(`Administrator ${admin.email} removed`);
        fetchAdmins();
      }
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setDeletingId(null);
    }
  };

  // ─── Handle Self Credentials Update ──────────────────────────────────────────
  const handleSelfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSelfSuccessMsg('');

    if (!myCurrentPassword) {
      toast.error('Current password is required to verify identity');
      return;
    }

    if (myNewPassword && myNewPassword !== myConfirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }

    if (myNewPassword && myNewPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setSavingSelf(true);
    try {
      const res = await adminApi.updateCredentials({
        currentPassword: myCurrentPassword,
        newEmail: myNewEmail !== currentUser?.email ? myNewEmail : undefined,
        newPassword: myNewPassword ? myNewPassword : undefined,
      });

      if (res.data.success) {
        const updatedUser = res.data.data?.user;
        const newToken = res.data.data?.token;

        if (updatedUser && newToken) {
          login(updatedUser, newToken);
        } else if (updatedUser) {
          updateUser(updatedUser);
        }

        toast.success(res.data.message || 'Credentials synchronized successfully!');
        setSelfSuccessMsg('Admin credentials updated! Active session renewed with fresh cryptographic tokens.');
        setMyCurrentPassword('');
        setMyNewPassword('');
        setMyConfirmPassword('');
        fetchAdmins();
      }
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setSavingSelf(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl font-mono">
      {/* Title & Banner */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[9px] font-black bg-ink text-paper px-2 py-0.5 uppercase">AUTH::ROOT</span>
          <h1 className="font-display font-black text-2xl text-ink uppercase tracking-tight">Admin Accounts & Security Panel</h1>
        </div>
        <p className="font-mono text-xs text-ink/70 font-bold uppercase tracking-wider">
          Manage administrative emails, grant access to new administrators, and update passwords for all operational accounts.
        </p>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border-3 border-ink shadow-brutal flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black text-ink/60 uppercase">Active Administrators</div>
            <div className="text-2xl font-black text-ink mt-0.5">{admins.length} Accounts</div>
          </div>
          <div className="w-10 h-10 border-2 border-ink bg-lemon flex items-center justify-center text-ink shadow-brutal-sm">
            <Users className="w-5 h-5 text-saturn-orange" />
          </div>
        </div>

        <div className="p-4 bg-white border-3 border-ink shadow-brutal flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[10px] font-black text-ink/60 uppercase">Current Session</div>
            <div className="text-xs font-black text-ink truncate mt-0.5">{currentUser?.email || 'saturn3d@gmail.com'}</div>
          </div>
          <div className="w-10 h-10 border-2 border-ink bg-mint flex items-center justify-center text-ink shadow-brutal-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-800" />
          </div>
        </div>

        <div className="p-4 bg-white border-3 border-ink shadow-brutal flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black text-ink/60 uppercase">Cryptographic Layer</div>
            <div className="text-xs font-black text-ink mt-0.5">BCRYPT 10-ROUNDS + JWT</div>
          </div>
          <div className="w-10 h-10 border-2 border-ink bg-paper flex items-center justify-center text-ink shadow-brutal-sm">
            <KeyRound className="w-5 h-5 text-saturn-orange" />
          </div>
        </div>
      </div>

      {/* Grid: Add New Admin (Left) & Active Admins Roster (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SECTION 1: Add New Administrator Form (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="card-slab bg-white border-3 border-ink shadow-brutal p-6 space-y-5">
            <div className="bg-lemon -mx-6 -mt-6 p-4 border-b-3 border-ink flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-saturn-orange" />
                <h2 className="font-display font-black text-sm text-ink uppercase tracking-wider">
                  Add New Administrator
                </h2>
              </div>
              <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 border border-ink bg-white">
                NEW_ACCOUNT
              </span>
            </div>

            <p className="text-[11px] text-ink/70 font-bold leading-relaxed">
              Register a new administrative email to grant operational command over products, orders, categories, and customer data.
            </p>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink flex items-center gap-1.5 mb-1">
                  <Mail className="w-3.5 h-3.5 text-saturn-orange" />
                  Admin Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="e.g. operations@saturn3d.in"
                  className="h-10 font-mono font-bold border-2 border-ink shadow-brutal-sm bg-white"
                />
              </div>

              <div>
                <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink flex items-center gap-1.5 mb-1">
                  <Shield className="w-3.5 h-3.5 text-saturn-orange" />
                  Display Name (Optional)
                </Label>
                <Input
                  type="text"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="e.g. Lead Engineer / Ops Admin"
                  className="h-10 font-mono font-bold border-2 border-ink shadow-brutal-sm bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink flex items-center gap-1.5 mb-1">
                    <Lock className="w-3.5 h-3.5 text-saturn-orange" />
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="h-10 pr-8 font-mono font-bold border-2 border-ink shadow-brutal-sm bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-ink/60 hover:text-ink"
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink flex items-center gap-1.5 mb-1">
                    <Lock className="w-3.5 h-3.5 text-saturn-orange" />
                    Confirm
                  </Label>
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newAdminConfirmPassword}
                    onChange={(e) => setNewAdminConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="h-10 font-mono font-bold border-2 border-ink shadow-brutal-sm bg-white"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={creatingAdmin}
                className="w-full h-11 bg-saturn-orange text-white hover:bg-orange-600 font-mono font-black uppercase tracking-wider border-2 border-ink shadow-brutal active:translate-x-0.5 active:translate-y-0.5 transition-all mt-2"
              >
                {creatingAdmin ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Provisioning Admin...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Authorize New Administrator
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* SECTION 2: Active Administrator Roster & Password Management (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="card-slab bg-white border-3 border-ink shadow-brutal p-6 space-y-5">
            <div className="bg-paper -mx-6 -mt-6 p-4 border-b-3 border-ink flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-saturn-orange" />
                <h2 className="font-display font-black text-sm text-ink uppercase tracking-wider">
                  Active Administrators Roster ({admins.length})
                </h2>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={fetchAdmins}
                disabled={loadingAdmins}
                className="h-7 px-2 border-2 border-ink bg-white text-ink text-[10px] font-black uppercase hover:bg-lemon"
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${loadingAdmins ? 'animate-spin' : ''}`} />
                Sync
              </Button>
            </div>

            {loadingAdmins ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-saturn-orange" />
                <span className="text-xs font-bold text-ink/70 uppercase">Loading admin directory...</span>
              </div>
            ) : admins.length === 0 ? (
              <div className="p-6 text-center text-xs font-bold text-ink/60 border-2 border-dashed border-ink/30">
                No administrators found in registry.
              </div>
            ) : (
              <div className="space-y-3">
                {admins.map((admin) => {
                  const isCurrent = admin.id === currentAdminId || admin.id === currentUser?.id;
                  return (
                    <div
                      key={admin.id}
                      className={`p-4 border-2 border-ink shadow-brutal-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                        isCurrent ? 'bg-lemon/20' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-9 h-9 border-2 border-ink bg-lemon flex items-center justify-center text-xs font-black text-ink shadow-brutal-sm flex-shrink-0">
                          {admin.name ? admin.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-xs text-ink truncate">{admin.name || 'Saturn Admin'}</span>
                            {isCurrent && (
                              <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 bg-saturn-orange text-white border border-ink">
                                YOU
                              </span>
                            )}
                            <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 bg-mint text-ink border border-ink">
                              ACTIVE
                            </span>
                          </div>
                          <div className="text-xs font-bold text-ink/70 truncate flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-saturn-orange" />
                            {admin.email}
                          </div>
                          {admin.created_at && (
                            <div className="text-[10px] text-ink/50 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-2.5 h-2.5" />
                              Added {new Date(admin.created_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button
                          size="sm"
                          onClick={() => handleOpenEdit(admin)}
                          className="h-8 px-3 border-2 border-ink bg-white hover:bg-lemon text-ink text-xs font-black uppercase shadow-brutal-sm"
                        >
                          <KeyRound className="w-3.5 h-3.5 mr-1 text-saturn-orange" />
                          Update Password
                        </Button>

                        {!isCurrent && admins.length > 1 && (
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={deletingId === admin.id}
                            onClick={() => handleDeleteAdmin(admin)}
                            className="h-8 px-2.5 border-2 border-ink bg-red-500 hover:bg-red-600 text-white text-xs font-black uppercase shadow-brutal-sm"
                            title="Revoke Admin Access"
                          >
                            {deletingId === admin.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: My Current Admin Credentials (Self Password & Email Update) */}
      <div className="card-slab bg-white border-3 border-ink shadow-brutal p-6 sm:p-8 space-y-6">
        <div className="bg-mint -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 p-4 sm:p-5 border-b-3 border-ink flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 border-2 border-ink bg-white flex items-center justify-center text-ink shadow-brutal-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
            </div>
            <div>
              <h2 className="font-display font-black text-sm text-ink uppercase tracking-wider">
                My Admin Credentials & Master Security
              </h2>
              <span className="text-[10px] text-ink/70 font-bold uppercase">
                Active Session Account: {currentUser?.email}
              </span>
            </div>
          </div>
          <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 border border-ink bg-white">
            ACTIVE_SESSION
          </span>
        </div>

        {selfSuccessMsg && (
          <div className="p-4 bg-mint border-3 border-ink shadow-brutal flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-ink flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-black text-xs uppercase tracking-wide text-ink">Credentials Synchronized</div>
              <div className="text-xs font-bold text-ink/80 mt-0.5">{selfSuccessMsg}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSelfSubmit} className="space-y-6">
          <div className="bg-paper/80 border-2 border-ink/30 p-4 space-y-1">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-ink">
              <AlertTriangle className="w-4 h-4 text-saturn-orange" />
              Default System Credentials Notice
            </div>
            <p className="text-[11px] text-ink/70 leading-relaxed font-bold">
              Default administrator email configured in <span className="font-black text-ink">.env</span> is <span className="underline font-black text-ink">saturn3d@gmail.com</span> with password <span className="underline font-black text-ink">Saturn3D@123</span>. You can change your active email and password below at any time.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-saturn-orange" />
                My Admin Email Address
              </Label>
              <Input
                type="email"
                required
                value={myNewEmail}
                onChange={(e) => setMyNewEmail(e.target.value)}
                placeholder="saturn3d@gmail.com"
                className="h-11 mt-1 font-mono font-bold border-2 border-ink shadow-brutal-sm bg-white"
              />
              <span className="text-[10px] text-ink/60 font-bold block mt-1">
                Used to log into the admin console directly at /admin
              </span>
            </div>

            <div className="pt-4 border-t-2 border-ink/10">
              <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink flex items-center gap-2">
                <KeyRound className="w-3.5 h-3.5 text-saturn-orange" />
                Current Admin Password <span className="text-red-500">*</span>
              </Label>
              <Input
                type="password"
                required
                value={myCurrentPassword}
                onChange={(e) => setMyCurrentPassword(e.target.value)}
                placeholder="Enter current password (e.g. Saturn3D@123)"
                className="h-11 mt-1 font-mono font-bold border-2 border-ink shadow-brutal-sm bg-white"
              />
              <span className="text-[10px] text-ink/60 font-bold block mt-1">
                Identity verification required before committing changes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-saturn-orange" />
                  New Password (Optional)
                </Label>
                <Input
                  type="password"
                  value={myNewPassword}
                  onChange={(e) => setMyNewPassword(e.target.value)}
                  placeholder="Leave blank to keep unchanged"
                  className="h-11 mt-1 font-mono font-bold border-2 border-ink shadow-brutal-sm bg-white"
                />
              </div>

              <div>
                <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-saturn-orange" />
                  Confirm New Password
                </Label>
                <Input
                  type="password"
                  value={myConfirmPassword}
                  onChange={(e) => setMyConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="h-11 mt-1 font-mono font-bold border-2 border-ink shadow-brutal-sm bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={savingSelf}
              className="h-12 px-8 bg-saturn-orange text-white hover:bg-orange-600 font-mono font-black uppercase tracking-wider border-3 border-ink shadow-brutal active:translate-x-1 active:translate-y-1 transition-all"
            >
              {savingSelf ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Encrypting & Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update My Credentials
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* MODAL: Update Any Administrator's Password & Details */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border-3 border-ink shadow-brutal-lg animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-lemon border-b-3 border-ink flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-saturn-orange" />
                <h3 className="font-display font-black text-sm text-ink uppercase tracking-wider">
                  Update Administrator Password
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingAdmin(null)}
                className="w-7 h-7 border-2 border-ink bg-white flex items-center justify-center text-ink hover:bg-red-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdateAdminPassword} className="p-6 space-y-4">
              <div className="p-3 bg-paper border-2 border-ink/30 text-xs font-bold text-ink">
                Modifying credentials for <span className="underline font-black">{editingAdmin.email}</span>
              </div>

              <div>
                <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink mb-1 block">
                  Admin Email Address
                </Label>
                <Input
                  type="email"
                  value={editAdminEmail}
                  onChange={(e) => setEditAdminEmail(e.target.value)}
                  className="h-10 font-mono font-bold border-2 border-ink shadow-brutal-sm bg-white"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink mb-1 block">
                  Display Name
                </Label>
                <Input
                  type="text"
                  value={editAdminName}
                  onChange={(e) => setEditAdminName(e.target.value)}
                  placeholder="Admin Name"
                  className="h-10 font-mono font-bold border-2 border-ink shadow-brutal-sm bg-white"
                />
              </div>

              <div className="pt-2 border-t-2 border-ink/10 space-y-3">
                <div>
                  <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink flex items-center justify-between mb-1">
                    <span>Assign New Password</span>
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="text-[10px] text-saturn-orange font-bold hover:underline"
                    >
                      {showEditPassword ? 'Hide' : 'Show'}
                    </button>
                  </Label>
                  <Input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editAdminPassword}
                    onChange={(e) => setEditAdminPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="h-10 font-mono font-bold border-2 border-ink shadow-brutal-sm bg-white"
                  />
                  <span className="text-[10px] text-ink/60 font-bold block mt-1">
                    Leave blank to keep existing password unchanged
                  </span>
                </div>

                {editAdminPassword && (
                  <div>
                    <Label className="text-xs font-mono font-black uppercase tracking-wider text-ink mb-1 block">
                      Confirm New Password
                    </Label>
                    <Input
                      type={showEditPassword ? 'text' : 'password'}
                      value={editAdminConfirmPassword}
                      onChange={(e) => setEditAdminConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="h-10 font-mono font-bold border-2 border-ink shadow-brutal-sm bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t-2 border-ink/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingAdmin(null)}
                  className="h-10 px-4 border-2 border-ink bg-white text-ink text-xs font-black uppercase hover:bg-paper"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updatingAdmin}
                  className="h-10 px-6 bg-saturn-orange text-white hover:bg-orange-600 text-xs font-black uppercase tracking-wider border-2 border-ink shadow-brutal active:translate-x-0.5 active:translate-y-0.5"
                >
                  {updatingAdmin ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                      Save & Commit
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
