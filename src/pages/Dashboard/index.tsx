import { useMemo, useState } from 'react';
import { CalendarDays, FileSearch, ReceiptText, TrendingUp, WalletCards } from 'lucide-react';
import { ReceiptRow } from '@/components/ReceiptRow';
import { StatCard } from '@/components/StatCard';
import type { Status } from '@/components/StatusBadge';

type Receipt = {
  id: string;
  merchant: string;
  date: string;
  amount: number;
  status: Status;
  category: string;
};

type StatusFilter = 'all' | Status;

const mockReceipts: Receipt[] = [
  {
    id: 'r-001',
    merchant: 'ВкусВилл',
    date: '09 июня 2026',
    amount: 1840,
    status: 'success',
    category: 'Продукты',
  },
  {
    id: 'r-002',
    merchant: 'Яндекс Маркет',
    date: '08 июня 2026',
    amount: 4290,
    status: 'pending',
    category: 'Покупки',
  },
  {
    id: 'r-003',
    merchant: 'Лукойл',
    date: '07 июня 2026',
    amount: 3150,
    status: 'success',
    category: 'Транспорт',
  },
  {
    id: 'r-004',
    merchant: 'Аптека 36.6',
    date: '06 июня 2026',
    amount: 1260,
    status: 'error',
    category: 'Здоровье',
  },
  {
    id: 'r-005',
    merchant: 'Перекрёсток',
    date: '05 июня 2026',
    amount: 2380,
    status: 'success',
    category: 'Продукты',
  },
];

const statusFilters: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'success', label: 'Готово' },
  { value: 'pending', label: 'В обработке' },
  { value: 'error', label: 'Ошибки' },
];

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

export const DashboardPage = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const stats = useMemo(() => {
    const totalAmount = mockReceipts.reduce((sum, receipt) => sum + receipt.amount, 0);
    const successCount = mockReceipts.filter((receipt) => receipt.status === 'success').length;
    const averageAmount = Math.round(totalAmount / mockReceipts.length);
    const successRate = Math.round((successCount / mockReceipts.length) * 100);

    return {
      totalCount: mockReceipts.length,
      totalAmount,
      averageAmount,
      successRate,
    };
  }, []);

  const filteredReceipts = useMemo(() => {
    if (statusFilter === 'all') {
      return mockReceipts;
    }

    return mockReceipts.filter((receipt) => receipt.status === statusFilter);
  }, [statusFilter]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="text-white">Обзор</span>{' '}
            <span className="text-light">чеков</span>
          </h1>
          <p className="mt-3 max-w-2xl text-text-muted">
            Следите за расходами, статусами OCR и последними загруженными чеками.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-2xl border border-white/[0.07] bg-surface px-4 py-3 text-sm text-text-muted">
          <CalendarDays size={18} className="text-primary" />
          Июнь 2026
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Всего чеков" value={stats.totalCount} trend="+12% за неделю" />
        <StatCard title="Сумма расходов" value={currencyFormatter.format(stats.totalAmount)} trend="+8%" />
        <StatCard title="Средний чек" value={currencyFormatter.format(stats.averageAmount)} trend="-3%" isPositive={false} />
        <StatCard title="Успешный OCR" value={`${stats.successRate}%`} trend={`${stats.successRate}/100`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-surface">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Последние чеки</h2>
              <p className="mt-1 text-sm text-text-muted">
                Мок-данные для будущих результатов OCR-сканирования.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => {
                const isActive = statusFilter === filter.value;

                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setStatusFilter(filter.value)}
                    className={`smooth-transition h-9 cursor-pointer rounded-xl px-3 text-sm font-medium ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'bg-elevated text-text-muted hover:text-white'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredReceipts.length > 0 ? (
            <div>
              {filteredReceipts.map((receipt) => (
                <ReceiptRow
                  key={receipt.id}
                  merchant={receipt.merchant}
                  date={receipt.date}
                  amount={receipt.amount}
                  status={receipt.status}
                  category={receipt.category}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileSearch size={28} />
              </div>
              <h3 className="text-lg font-bold text-white">Чеки не найдены</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">
                Для выбранного статуса пока нет чеков. Измените фильтр или загрузите новый чек через сканер.
              </p>
            </div>
          )}
        </div>

        <aside className="grid gap-4">
          <div className="rounded-2xl border border-white/[0.07] bg-surface p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <WalletCards size={24} />
            </div>
            <h2 className="text-lg font-bold text-white">Категории расходов</h2>
            <div className="mt-5 grid gap-4">
              {['Продукты', 'Покупки', 'Транспорт', 'Здоровье'].map((category) => {
                const categoryTotal = mockReceipts
                  .filter((receipt) => receipt.category === category)
                  .reduce((sum, receipt) => sum + receipt.amount, 0);
                const width = Math.max(12, Math.round((categoryTotal / stats.totalAmount) * 100));

                return (
                  <div key={category}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-text-muted">{category}</span>
                      <span className="font-semibold text-white">{currencyFormatter.format(categoryTotal)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-elevated">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-surface p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-lg font-bold text-white">OCR-качество</h2>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              Большинство чеков распознаётся успешно. Ошибочные документы стоит отправлять на повторную загрузку.
            </p>
            <div className="mt-5 flex items-end gap-2">
              <span className="text-4xl font-bold text-white">{stats.successRate}%</span>
              <span className="pb-1 text-sm font-medium text-success">успешно</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-surface p-5">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-500">
              <ReceiptText size={24} />
            </div>

          </div>
        </aside>
      </section>
    </div>
  );
};
