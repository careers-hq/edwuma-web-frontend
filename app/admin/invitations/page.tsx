'use client';

import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { AdminError, AdminPageHeader, AdminPagination } from '@/components/admin/AdminChrome';
import { formatDate } from '@/lib/utils';
import {
  adminService,
  getApiErrorMessage,
  invitationStatus,
  type AdminInvitation,
  type AdminPagination as Pagination,
} from '@/lib/api/admin';

const STATUS_OPTIONS = [
  { value: '', label: 'All invitations' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'expired', label: 'Expired' },
];

const ROLE_OPTIONS = [
  { value: 'user', label: 'Job seeker' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'admin', label: 'Admin' },
];

const STATUS_BADGE = {
  pending: 'warning',
  accepted: 'success',
  expired: 'destructive',
} as const;

const emptyForm = {
  email: '',
  role: 'recruiter',
  firstName: '',
  lastName: '',
  phone: '',
  expiryHours: '72',
};

export default function AdminInvitationsPage() {
  const [invitations, setInvitations] = useState<AdminInvitation[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isSending, setIsSending] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadInvitations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await adminService.listInvitations({
        status: status ? (status as 'pending' | 'accepted' | 'expired') : undefined,
        page,
        per_page: 15,
      });
      setInvitations(result.invitations);
      setPagination(result.pagination);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'Unable to load invitations.'));
    } finally {
      setIsLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    void loadInvitations();
  }, [loadInvitations]);

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    const expiryHours = Number(form.expiryHours);
    if (!Number.isFinite(expiryHours) || expiryHours < 1 || expiryHours > 168) {
      toast.error('Expiry must be between 1 and 168 hours.');
      return;
    }

    try {
      setIsSending(true);
      await adminService.sendInvitation({
        email: form.email.trim(),
        role: form.role as 'admin' | 'user' | 'recruiter',
        expiry_hours: expiryHours,
        invitation_data: {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
        },
      });
      toast.success('Invitation sent.');
      setForm(emptyForm);
      setShowForm(false);
      setPage(1);
      await loadInvitations();
    } catch (sendError) {
      toast.error(getApiErrorMessage(sendError, 'Unable to send invitation.'));
    } finally {
      setIsSending(false);
    }
  };

  const handleResend = async (invitation: AdminInvitation) => {
    try {
      setBusyId(invitation.id);
      await adminService.resendInvitation(invitation.id);
      toast.success(`Invitation resent to ${invitation.email}.`);
      await loadInvitations();
    } catch (resendError) {
      toast.error(getApiErrorMessage(resendError, 'Unable to resend invitation.'));
    } finally {
      setBusyId(null);
    }
  };

  const handleCancel = async (invitation: AdminInvitation) => {
    if (!window.confirm(`Cancel the invitation for ${invitation.email}?`)) return;

    try {
      setBusyId(invitation.id);
      await adminService.cancelInvitation(invitation.id);
      toast.success('Invitation cancelled.');
      await loadInvitations();
    } catch (cancelError) {
      toast.error(getApiErrorMessage(cancelError, 'Unable to cancel invitation.'));
    } finally {
      setBusyId(null);
    }
  };

  const handleCopy = async (invitation: AdminInvitation) => {
    if (!invitation.invitation_url) {
      toast.error('This invitation does not include a link.');
      return;
    }
    try {
      await navigator.clipboard.writeText(invitation.invitation_url);
      toast.success('Invitation link copied.');
    } catch {
      toast.error('Unable to copy the invitation link.');
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Invitations"
        description="Invite someone by email. They get a link to create an account with the role you choose."
        action={
          <Button variant={showForm ? 'outline' : 'primary'} onClick={() => setShowForm((open) => !open)}>
            {showForm ? 'Close form' : 'Invite someone'}
          </Button>
        }
      />

      {showForm ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New invitation</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleInvite}>
              <Input
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="name@company.com"
              />
              <Select
                label="Role"
                value={form.role}
                options={ROLE_OPTIONS}
                onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
              />
              <Input
                label="First name"
                required
                value={form.firstName}
                onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
              />
              <Input
                label="Last name"
                required
                value={form.lastName}
                onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
              />
              <Input
                label="Phone"
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                placeholder="Optional"
              />
              <Input
                label="Expires in hours"
                type="number"
                min={1}
                max={168}
                required
                value={form.expiryHours}
                onChange={(event) => setForm((current) => ({ ...current, expiryHours: event.target.value }))}
                helperText="Between 1 and 168 hours."
              />
              <div className="md:col-span-2">
                <Button type="submit" loading={isSending}>
                  Send invitation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <div className="mb-4 max-w-xs">
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

      {error ? <AdminError message={error} onRetry={loadInvitations} /> : null}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-[#f8fafc] text-xs uppercase tracking-wide text-[rgba(0,0,0,0.55)]">
                <tr>
                  <th className="px-6 py-3 font-medium">Invitee</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Expires</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-[rgba(0,0,0,0.6)]">
                      Loading invitations…
                    </td>
                  </tr>
                ) : invitations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-[rgba(0,0,0,0.6)]">
                      No invitations yet.
                    </td>
                  </tr>
                ) : (
                  invitations.map((invitation) => {
                    const statusName = invitationStatus(invitation);
                    const busy = busyId === invitation.id;
                    const inviteeName = [invitation.invitation_data?.first_name, invitation.invitation_data?.last_name]
                      .filter(Boolean)
                      .join(' ');
                    return (
                      <tr key={invitation.id} className="border-b border-gray-100 last:border-0">
                        <td className="px-6 py-4">
                          <p className="font-medium text-[#244034]">{inviteeName || invitation.email}</p>
                          <p className="text-[rgba(0,0,0,0.6)]">{invitation.email}</p>
                          {invitation.inviter?.display_name ? (
                            <p className="text-xs text-[rgba(0,0,0,0.45)]">Invited by {invitation.inviter.display_name}</p>
                          ) : null}
                        </td>
                        <td className="px-6 py-4 capitalize text-[#244034]">{invitation.role || 'user'}</td>
                        <td className="px-6 py-4">
                          <Badge variant={STATUS_BADGE[statusName]} size="sm" className="capitalize">
                            {statusName}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-[rgba(0,0,0,0.7)]">
                          {invitation.expires_at ? formatDate(invitation.expires_at) : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {invitation.invitation_url ? (
                              <Button variant="outline" size="sm" onClick={() => void handleCopy(invitation)}>
                                Copy link
                              </Button>
                            ) : null}
                            {statusName === 'pending' ? (
                              <>
                                <Button variant="outline" size="sm" disabled={busy} onClick={() => void handleResend(invitation)}>
                                  Resend
                                </Button>
                                <Button variant="ghost" size="sm" disabled={busy} onClick={() => void handleCancel(invitation)}>
                                  Cancel
                                </Button>
                              </>
                            ) : null}
                          </div>
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
