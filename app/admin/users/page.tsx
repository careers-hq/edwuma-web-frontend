'use client';

import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { AdminError, AdminPageHeader, AdminPagination } from '@/components/admin/AdminChrome';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import {
  adminService,
  getApiErrorMessage,
  userDisplayName,
  userRoleName,
  type AdminPagination as Pagination,
  type AdminRole,
  type AdminUser,
} from '@/lib/api/admin';

const FALLBACK_ROLES = [
  { value: 'user', label: 'Job seeker' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'admin', label: 'Admin' },
];

function roleLabel(name: string): string {
  return FALLBACK_ROLES.find((role) => role.value === name)?.label ?? name;
}

const emptyCreateForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirmation: '',
  role: 'user',
};

const STATUS_OPTIONS = [
  { value: '', label: 'Any status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [menuUserId, setMenuUserId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);

  const roleOptions = roles.length
    ? roles.map((item) => ({ value: item.name, label: roleLabel(item.name) }))
    : FALLBACK_ROLES;
  const filterRoleOptions = [{ value: '', label: 'All roles' }, ...roleOptions];

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await adminService.listUsers({
        search: appliedSearch,
        role: role || undefined,
        is_active: status === '' ? undefined : status === 'active',
        page,
        per_page: 15,
      });
      setUsers(result.users);
      setPagination(result.pagination);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'Unable to load users.'));
    } finally {
      setIsLoading(false);
    }
  }, [appliedSearch, page, role, status]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    void adminService.listRoles().then(setRoles).catch(() => setRoles([]));
  }, []);

  const updateUser = (updated: AdminUser) => {
    setUsers((current) => current.map((user) => (user.id === updated.id ? updated : user)));
  };

  const handleRoleChange = async (user: AdminUser, nextRole: string) => {
    if (nextRole === userRoleName(user)) return;
    if (String(currentUser?.id) === String(user.id)) {
      toast.error('You cannot change your own role from this screen.');
      return;
    }
    const confirmed = window.confirm(
      `Change ${userDisplayName(user)} from ${roleLabel(userRoleName(user))} to ${roleLabel(nextRole)}?`
    );
    if (!confirmed) return;

    try {
      setBusyUserId(user.id);
      const updated = await adminService.updateUserRole(user.id, nextRole);
      updateUser(updated);
      toast.success(`${userDisplayName(user)} is now a ${nextRole}.`);
    } catch (changeError) {
      toast.error(getApiErrorMessage(changeError, 'Unable to update role.'));
    } finally {
      setBusyUserId(null);
    }
  };

  const handleStatusChange = async (user: AdminUser) => {
    if (String(currentUser?.id) === String(user.id)) {
      toast.error('You cannot deactivate your own account.');
      return;
    }

    const nextActive = !user.is_active;
    const confirmed = window.confirm(
      nextActive
        ? `Activate ${userDisplayName(user)}?`
        : `Deactivate ${userDisplayName(user)}? They will not be able to sign in.`
    );
    if (!confirmed) return;

    try {
      setBusyUserId(user.id);
      const updated = await adminService.updateUserStatus(user.id, nextActive);
      updateUser(updated);
      toast.success(nextActive ? 'Account activated.' : 'Account deactivated.');
    } catch (changeError) {
      toast.error(getApiErrorMessage(changeError, 'Unable to update account status.'));
    } finally {
      setBusyUserId(null);
    }
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (createForm.password !== createForm.passwordConfirmation) {
      toast.error('Password confirmation does not match.');
      return;
    }

    try {
      setIsCreating(true);
      await adminService.createUser({
        email: createForm.email.trim(),
        phone: createForm.phone.trim(),
        password: createForm.password,
        password_confirmation: createForm.passwordConfirmation,
        first_name: createForm.firstName.trim(),
        last_name: createForm.lastName.trim(),
        role: createForm.role,
      });
      toast.success('User created.');
      setCreateForm(emptyCreateForm);
      setShowCreate(false);
      setPage(1);
      await loadUsers();
    } catch (createError) {
      toast.error(getApiErrorMessage(createError, 'Unable to create user.'));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Users"
        action={
          <Button variant="primary" onClick={() => setShowCreate((open) => !open)}>
            {showCreate ? 'Close' : 'Create user'}
          </Button>
        }
      />

      {showCreate ? (
        <Card className="mb-6">
          <CardContent className="p-6">
            <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={(event) => void handleCreate(event)}>
              <Input
                label="First name"
                value={createForm.firstName}
                onChange={(event) => setCreateForm((form) => ({ ...form, firstName: event.target.value }))}
                required
              />
              <Input
                label="Last name"
                value={createForm.lastName}
                onChange={(event) => setCreateForm((form) => ({ ...form, lastName: event.target.value }))}
                required
              />
              <Input
                label="Email"
                type="email"
                value={createForm.email}
                onChange={(event) => setCreateForm((form) => ({ ...form, email: event.target.value }))}
                required
              />
              <Input
                label="Phone"
                value={createForm.phone}
                onChange={(event) => setCreateForm((form) => ({ ...form, phone: event.target.value }))}
                required
              />
              <Input
                label="Password"
                type="password"
                value={createForm.password}
                onChange={(event) => setCreateForm((form) => ({ ...form, password: event.target.value }))}
                minLength={8}
                required
              />
              <Input
                label="Confirm password"
                type="password"
                value={createForm.passwordConfirmation}
                onChange={(event) => setCreateForm((form) => ({ ...form, passwordConfirmation: event.target.value }))}
                minLength={8}
                required
              />
              <Select
                label="Role"
                value={createForm.role}
                options={roleOptions}
                onChange={(event) => setCreateForm((form) => ({ ...form, role: event.target.value }))}
              />
              <div className="flex items-end">
                <Button type="submit" variant="primary" loading={isCreating}>
                  Save user
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <Card className="mb-6">
        <CardContent className="p-6">
          <form
            className="grid grid-cols-1 gap-4 md:grid-cols-4"
            onSubmit={(event) => {
              event.preventDefault();
              setPage(1);
              setAppliedSearch(search.trim());
            }}
          >
            <div className="md:col-span-2">
              <Input
                label="Search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, email, or phone"
              />
            </div>
            <Select
              label="Role"
              value={role}
              options={filterRoleOptions}
              onChange={(event) => {
                setRole(event.target.value);
                setPage(1);
              }}
            />
            <Select
              label="Status"
              value={status}
              options={STATUS_OPTIONS}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            />
          </form>
        </CardContent>
      </Card>

      {error ? <AdminError message={error} onRetry={loadUsers} /> : null}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-[#f8fafc] text-xs uppercase tracking-wide text-[rgba(0,0,0,0.55)]">
                <tr>
                  <th className="px-6 py-3 font-medium">Person</th>
                  <th className="px-6 py-3 font-medium">Country</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-[rgba(0,0,0,0.6)]">
                      Loading users…
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-[rgba(0,0,0,0.6)]">
                      No users match these filters.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const isSelf = String(currentUser?.id) === String(user.id);
                    const busy = busyUserId === user.id;
                    return (
                      <tr key={user.id} className="border-b border-gray-100 last:border-0">
                        <td className="px-6 py-4">
                          <p className="font-medium text-[#244034]">{userDisplayName(user)}</p>
                          <p className="text-[rgba(0,0,0,0.6)]">{user.email}</p>
                          {user.phone ? <p className="text-xs text-[rgba(0,0,0,0.45)]">{user.phone}</p> : null}
                        </td>
                        <td className="px-6 py-4 text-[rgba(0,0,0,0.7)]">{user.profile?.country || '—'}</td>
                        <td className="px-6 py-4">
                          {isSelf ? (
                            <span className="text-sm text-[#244034]">{roleLabel(userRoleName(user))}</span>
                          ) : (
                            <div className="relative">
                              <button
                                type="button"
                                className="text-sm font-medium text-[#244034] disabled:opacity-50"
                                disabled={busy}
                                aria-expanded={menuUserId === user.id}
                                onClick={() => setMenuUserId((current) => (current === user.id ? null : user.id))}
                              >
                                {busy ? 'Saving…' : roleLabel(userRoleName(user))}
                              </button>
                              {menuUserId === user.id ? (
                                <div className="absolute left-0 z-10 mt-1 w-44 rounded-md border border-gray-100 bg-white py-1 shadow-lg">
                                  {roleOptions
                                    .filter((option) => option.value !== userRoleName(user))
                                    .map((option) => (
                                      <button
                                        key={option.value}
                                        type="button"
                                        className="block w-full px-3 py-2 text-left text-sm text-[#244034] hover:bg-[#f4f7f5]"
                                        onClick={() => {
                                          setMenuUserId(null);
                                          void handleRoleChange(user, option.value);
                                        }}
                                      >
                                        {option.label}
                                      </button>
                                    ))}
                                  <button
                                    type="button"
                                    className="block w-full px-3 py-2 text-left text-sm text-[#244034] hover:bg-[#f4f7f5]"
                                    onClick={() => {
                                      setMenuUserId(null);
                                      void handleStatusChange(user);
                                    }}
                                  >
                                    {user.is_active ? 'Deactivate' : 'Activate'}
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={user.is_active ? 'success' : 'destructive'} size="sm">
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-[rgba(0,0,0,0.7)]">
                          {user.created_at ? formatDate(user.created_at) : '—'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {pagination ? (
            <div className="px-6 pb-6">
              <AdminPagination
                page={pagination.current_page}
                lastPage={pagination.last_page}
                total={pagination.total}
                onPageChange={setPage}
              />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
