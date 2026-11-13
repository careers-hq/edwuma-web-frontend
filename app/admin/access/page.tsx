'use client';

import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AdminError, AdminPageHeader } from '@/components/admin/AdminChrome';
import { adminService, getApiErrorMessage, type AdminPermission, type AdminRole } from '@/lib/api/admin';
import { cn } from '@/lib/utils';

function roleLabel(name: string): string {
  if (name === 'user') return 'Job seeker';
  if (name === 'recruiter') return 'Recruiter';
  if (name === 'admin') return 'Admin';
  return name;
}

export default function AdminAccessPage() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [roleName, setRoleName] = useState('');
  const [permissionName, setPermissionName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isCreatingPermission, setIsCreatingPermission] = useState(false);

  const loadAccess = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [nextRoles, nextPermissions] = await Promise.all([
        adminService.listRoles(),
        adminService.listPermissions(),
      ]);
      setRoles(nextRoles);
      setPermissions(nextPermissions);
      setSelectedId((current) => current ?? (nextRoles[0] ? String(nextRoles[0].id) : null));
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'Unable to load roles and permissions.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAccess();
  }, [loadAccess]);

  const selected = roles.find((role) => String(role.id) === selectedId) ?? null;

  useEffect(() => {
    setChecked((selected?.permissions ?? []).map((permission) => permission.name));
  }, [selected]);

  const togglePermission = (name: string) => {
    setChecked((current) => (
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name]
    ));
  };

  const handleCreateRole = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsCreatingRole(true);
      const role = await adminService.createRole(roleName.trim());
      setRoles((current) => [...current, role].sort((a, b) => a.name.localeCompare(b.name)));
      setSelectedId(String(role.id));
      setRoleName('');
      toast.success(`Role ${role.name} created.`);
    } catch (createError) {
      toast.error(getApiErrorMessage(createError, 'Unable to create role.'));
    } finally {
      setIsCreatingRole(false);
    }
  };

  const handleCreatePermission = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsCreatingPermission(true);
      const permission = await adminService.createPermission(permissionName.trim());
      setPermissions((current) => [...current, permission].sort((a, b) => a.name.localeCompare(b.name)));
      setPermissionName('');
      toast.success(`Permission ${permission.name} created.`);
    } catch (createError) {
      toast.error(getApiErrorMessage(createError, 'Unable to create permission.'));
    } finally {
      setIsCreatingPermission(false);
    }
  };

  const handleSave = async () => {
    if (!selected) return;
    try {
      setIsSaving(true);
      const updated = await adminService.updateRolePermissions(selected.id, checked);
      setRoles((current) => current.map((role) => (String(role.id) === String(updated.id) ? updated : role)));
      toast.success(`${roleLabel(updated.name)} permissions saved.`);
    } catch (saveError) {
      toast.error(getApiErrorMessage(saveError, 'Unable to save permissions.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Roles and permissions"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <form className="flex flex-col gap-4 sm:flex-row sm:items-end" onSubmit={(event) => void handleCreateRole(event)}>
              <div className="flex-1">
                <Input
                  label="New role"
                  value={roleName}
                  onChange={(event) => setRoleName(event.target.value)}
                  placeholder="reviewer"
                  pattern="[a-z][a-z0-9-]{1,49}"
                  title="Lowercase letters, numbers, and hyphens"
                  required
                />
              </div>
              <Button type="submit" variant="primary" loading={isCreatingRole}>
                Create role
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <form className="flex flex-col gap-4 sm:flex-row sm:items-end" onSubmit={(event) => void handleCreatePermission(event)}>
              <div className="flex-1">
                <Input
                  label="New permission"
                  value={permissionName}
                  onChange={(event) => setPermissionName(event.target.value)}
                  placeholder="review-applications"
                  pattern="[a-z][a-z0-9-]{1,63}"
                  title="Lowercase letters, numbers, and hyphens"
                  required
                />
              </div>
              <Button type="submit" variant="primary" loading={isCreatingPermission}>
                Create permission
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {error ? <AdminError message={error} onRetry={loadAccess} /> : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
        <Card>
          <CardContent className="p-3">
            {isLoading ? (
              <p className="px-3 py-6 text-sm text-[rgba(0,0,0,0.6)]">Loading roles…</p>
            ) : roles.length === 0 ? (
              <p className="px-3 py-6 text-sm text-[rgba(0,0,0,0.6)]">No roles yet.</p>
            ) : (
              <ul className="space-y-1">
                {roles.map((role) => {
                  const active = String(role.id) === selectedId;
                  return (
                    <li key={role.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(String(role.id))}
                        className={cn(
                          'w-full rounded-md px-3 py-2 text-left text-sm font-medium',
                          active ? 'bg-[#244034] text-white' : 'text-[#244034] hover:bg-[#244034]/5'
                        )}
                      >
                        {roleLabel(role.name)}
                        <span className={cn('mt-0.5 block text-xs font-normal', active ? 'text-white/80' : 'text-[rgba(0,0,0,0.5)]')}>
                          {role.name}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {!selected ? (
              <p className="text-sm text-[rgba(0,0,0,0.6)]">Select a role to edit its permissions.</p>
            ) : (
              <>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#244034]">{roleLabel(selected.name)}</h2>
                    <p className="text-sm text-[rgba(0,0,0,0.6)]">
                      {checked.length} of {permissions.length} permissions
                    </p>
                  </div>
                  <Button variant="primary" loading={isSaving} onClick={() => void handleSave()}>
                    Save permissions
                  </Button>
                </div>
                {selected.name === 'admin' ? (
                  <p className="mb-4 text-sm text-[rgba(0,0,0,0.65)]">
                    The admin role must keep user, role, and permission management.
                  </p>
                ) : null}
                {permissions.length === 0 ? (
                  <p className="text-sm text-[rgba(0,0,0,0.6)]">No permissions yet.</p>
                ) : (
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {permissions.map((permission) => (
                      <li key={permission.id}>
                        <label className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 px-3 py-2 text-sm text-[#244034]">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[#244034]"
                            checked={checked.includes(permission.name)}
                            onChange={() => togglePermission(permission.name)}
                          />
                          {permission.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
