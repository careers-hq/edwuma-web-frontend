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
  type AdminUser,
} from '@/lib/api/admin';

const ROLE_OPTIONS = [
  { value: '', label: 'All roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'user', label: 'Job seeker' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Any status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const ASSIGN_ROLE_OPTIONS = [
  { value: 'user', label: 'Job seeker' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'admin', label: 'Admin' },
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

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

  const updateUser = (updated: AdminUser) => {
    setUsers((current) => current.map((user) => (user.id === updated.id ? updated : user)));
  };

  const handleRoleChange = async (user: AdminUser, nextRole: string) => {
    if (nextRole === userRoleName(user)) return;
    if (String(currentUser?.id) === String(user.id)) {
      toast.error('You cannot change your own role from this screen.');
      return;
    }

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

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description="Search accounts, change roles, and turn access on or off."
      />

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
              options={ROLE_OPTIONS}
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
            <div className="md:col-span-4">
              <Button type="submit" variant="primary">
                Search
              </Button>
            </div>
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
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                  <th className="px-6 py-3 font-medium">Access</th>
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
                        <td className="px-6 py-4">
                          <Select
                            aria-label={`Role for ${userDisplayName(user)}`}
                            value={userRoleName(user)}
                            options={ASSIGN_ROLE_OPTIONS}
                            disabled={busy || isSelf}
                            onChange={(event) => void handleRoleChange(user, event.target.value)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={user.is_active ? 'success' : 'destructive'} size="sm">
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-[rgba(0,0,0,0.7)]">
                          {user.created_at ? formatDate(user.created_at) : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={busy || isSelf}
                            loading={busy}
                            onClick={() => void handleStatusChange(user)}
                          >
                            {user.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
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
