'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AdminError } from '@/components/admin/AdminChrome';
import {
  DotLabel,
  downloadCsv,
  RowMenu,
  RowMenuItem,
  StatusPill,
  Table,
  TableAction,
  TableCard,
  TableMessage,
  TablePager,
  TableToolbar,
  Td,
  Th,
  Tr,
} from '@/components/ui/DataTable';
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

const ROLE_DOT: Record<string, string> = {
  admin: '#244034',
  recruiter: '#3d6b56',
  user: '#7fa37a',
};

const STATUS_OPTIONS = [
  { value: '', label: 'Any status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get('q') ?? '';
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [appliedSearch, setAppliedSearch] = useState(queryFromUrl);
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
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
        per_page: pageSize,
      });
      setUsers(result.users);
      setPagination(result.pagination);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'Unable to load users.'));
    } finally {
      setIsLoading(false);
    }
  }, [appliedSearch, page, pageSize, role, status]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    setAppliedSearch(queryFromUrl);
    setPage(1);
  }, [queryFromUrl]);

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

  const exportUsers = () => {
    downloadCsv('users.csv', [
      ['Name', 'Email', 'Phone', 'Country', 'Role', 'Status', 'Joined'],
      ...users.map((user) => [
        userDisplayName(user),
        user.email,
        user.phone,
        user.profile?.country,
        roleLabel(userRoleName(user)),
        user.is_active ? 'Active' : 'Inactive',
        user.created_at ? formatDate(user.created_at) : '',
      ]),
    ]);
  };

  return (
    <div>
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

      {error ? <AdminError message={error} onRetry={loadUsers} /> : null}

      <TableCard>
        <TableToolbar
          search={queryFromUrl}
          onSearch={(value) => router.replace(value ? `/admin/users?q=${encodeURIComponent(value)}` : '/admin/users')}
          searchPlaceholder="Name, email, or phone"
          onExport={exportUsers}
          action={<TableAction onClick={() => setShowCreate((open) => !open)}>{showCreate ? 'Close' : 'Add user'}</TableAction>}
          filter={
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            </div>
          }
        />
        <Table>
          <thead>
            <tr>
              <Th>Person</Th>
              <Th>Country</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Joined</Th>
              <Th className="text-right">Action</Th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableMessage colSpan={6}>Loading users…</TableMessage>
            ) : users.length === 0 ? (
              <TableMessage colSpan={6}>No users match these filters.</TableMessage>
            ) : (
              users.map((user) => {
                const isSelf = String(currentUser?.id) === String(user.id);
                const busy = busyUserId === user.id;
                const roleName = userRoleName(user);
                return (
                  <Tr key={user.id}>
                    <Td>
                      <p className="font-medium text-[#141414]">{userDisplayName(user)}</p>
                      <p className="text-xs text-[#8b919a]">{user.email}</p>
                    </Td>
                    <Td>{user.profile?.country || '—'}</Td>
                    <Td>
                      <DotLabel color={ROLE_DOT[roleName] || '#9aa1ab'}>{busy ? 'Saving…' : roleLabel(roleName)}</DotLabel>
                    </Td>
                    <Td>
                      <StatusPill tone={user.is_active ? 'success' : 'neutral'}>{user.is_active ? 'Active' : 'Inactive'}</StatusPill>
                    </Td>
                    <Td className="whitespace-nowrap text-[#6b7280]">{user.created_at ? formatDate(user.created_at) : '—'}</Td>
                    <Td className="text-right">
                      {isSelf ? null : (
                        <div className="flex justify-end">
                          <RowMenu label={`Actions for ${userDisplayName(user)}`}>
                            {roleOptions
                              .filter((option) => option.value !== roleName)
                              .map((option) => (
                                <RowMenuItem key={option.value} onClick={() => void handleRoleChange(user, option.value)}>
                                  Make {option.label}
                                </RowMenuItem>
                              ))}
                            <RowMenuItem onClick={() => void handleStatusChange(user)}>
                              {user.is_active ? 'Deactivate' : 'Activate'}
                            </RowMenuItem>
                          </RowMenu>
                        </div>
                      )}
                    </Td>
                  </Tr>
                );
              })
            )}
          </tbody>
        </Table>
        {pagination ? (
          <TablePager
            page={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        ) : null}
      </TableCard>
    </div>
  );
}
