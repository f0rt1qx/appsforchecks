import type { ChangeEvent, FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, LogOut, Mail, Save, UserRound } from 'lucide-react';
import { FormInput } from '@/components/FormInput';
import { useAppStore } from '@/store';

type ProfileForm = {
  name: string;
  email: string;
};

const formatDate = (date?: string) => {
  if (!date) {
    return 'Не указана';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
};

export const ProfilePage = () => {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const updateUser = useAppStore((state) => state.updateUser);
  const logout = useAppStore((state) => state.logout);
  const [form, setForm] = useState<ProfileForm>({
    name: user?.name ?? '',
    email: user?.email ?? '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileForm, string>>>({});
  const [isSaved, setIsSaved] = useState(false);

  const registeredAt = useMemo(() => formatDate(user?.createdAt), [user?.createdAt]);

  const updateField = (field: keyof ProfileForm) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setIsSaved(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof ProfileForm, string>> = {};
    if (form.name.trim().length < 2) {
      nextErrors.name = 'Введите имя';
    }
    if (!form.email.includes('@')) {
      nextErrors.email = 'Введите корректный email';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      updateUser({
        name: form.name.trim(),
        email: form.email.trim(),
      });
      setIsSaved(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold">
          <span className="text-white">Профиль</span>{' '}
          <span className="text-light">аккаунта</span>
        </h1>
        <p className="mt-3 text-text-muted">
          Управляйте данными пользователя и текущей сессией.
        </p>
      </header>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-2xl border border-white/[0.07] bg-surface p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <UserRound size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-sm text-text-muted">{user?.role ?? 'user'}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            <div className="rounded-2xl border border-white/[0.07] bg-elevated/70 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-text-muted">
                <Mail size={16} />
                Email
              </div>
              <div className="font-semibold text-white">{user?.email}</div>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-elevated/70 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-text-muted">
                <CalendarClock size={16} />
                Дата регистрации
              </div>
              <div className="font-semibold text-white">{registeredAt}</div>
            </div>
          </div>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/[0.07] bg-surface p-6"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Редактирование данных</h2>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              Изменения сохраняются в localStorage и сразу обновляют текущую сессию.
            </p>
          </div>

          <div className="grid gap-5">
            <FormInput
              label="Имя"
              type="text"
              autoComplete="name"
              value={form.name}
              error={errors.name}
              onChange={updateField('name')}
            />
            <FormInput
              label="Email"
              type="email"
              autoComplete="email"
              value={form.email}
              error={errors.email}
              onChange={updateField('email')}
            />
          </div>

          {isSaved && (
            <div className="mt-5 rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
              Данные профиля сохранены.
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="smooth-transition flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 font-semibold text-white hover:bg-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
            >
              <Save size={18} />
              Сохранить
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="smooth-transition flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 font-semibold text-red-400 hover:border-red-500/40 hover:bg-red-500/15 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-surface"
            >
              <LogOut size={18} />
              Выйти
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
