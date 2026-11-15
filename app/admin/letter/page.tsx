'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AdminError, AdminPagination } from '@/components/admin/AdminChrome';
import { Select } from '@/components/ui/Select';
import { StatusPill, Table, TableCard, TableMessage, TableToolbar, Td, Th, Tr } from '@/components/ui/DataTable';
import { adminService, getApiErrorMessage, type AdminPagination as Pagination, type NewsletterSubscriber } from '@/lib/api/admin';
import { formatDate } from '@/lib/utils';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'receiving', label: 'Receiving' },
  { value: 'left', label: 'Left' },
];

const STATUS_LABEL: Record<NewsletterSubscriber['status'], string> = {
  receiving: 'Receiving',
  left: 'Left',
};

export default function AdminLetterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await adminService.listNewsletterSubscriptions({
        search,
        status: status || undefined,
        page,
        per_page: 15,
      });
      setSubscribers(result.subscriptions);
      setPagination(result.pagination);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'Unable to load the letter.'));
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      {error ? <AdminError message={error} onRetry={load} /> : null}

      <TableCard>
        <TableToolbar
          search={search}
          onSearch={(value) => {
            setPage(1);
            setSearch(value.trim());
          }}
          searchPlaceholder="Email"
          filter={
            <Select
              label="Status"
              value={status}
              options={STATUS_OPTIONS}
              onChange={(event) => {
                setPage(1);
                setStatus(event.target.value);
              }}
            />
          }
        />
        <Table>
          <thead>
            <tr>
              <Th>Email</Th>
              <Th>Status</Th>
              <Th>Joined</Th>
              <Th>Last letter</Th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableMessage colSpan={4}>Loading.</TableMessage>
            ) : subscribers.length === 0 ? (
              <TableMessage colSpan={4}>No addresses match.</TableMessage>
            ) : (
              subscribers.map((subscriber) => (
                <Tr key={subscriber.id}>
                  <Td>{subscriber.email}</Td>
                  <Td>
                    <StatusPill tone={subscriber.status === 'receiving' ? 'success' : 'neutral'}>
                      {STATUS_LABEL[subscriber.status]}
                    </StatusPill>
                  </Td>
                  <Td className="whitespace-nowrap text-[#6b7280]">{subscriber.created_at ? formatDate(subscriber.created_at) : '—'}</Td>
                  <Td className="whitespace-nowrap text-[#6b7280]">{subscriber.last_sent_at ? formatDate(subscriber.last_sent_at) : '—'}</Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
        {pagination ? (
          <AdminPagination
            page={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            pageSize={pagination.per_page}
            onPageChange={setPage}
          />
        ) : null}
      </TableCard>
    </div>
  );
}
