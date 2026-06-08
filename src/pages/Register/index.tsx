import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, LineChart, ScanLine, ShieldCheck, Sparkles } from 'lucide-react';
import { FormInput } from '@/components/FormInput';
import { useAppStore } from '@/store';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Benefit = {
  icon: ReactNode;
  title: string;
  description: string;
};

const benefits: Benefit[] = [
  {
    icon: <ScanLine size={22} />,
    title: 'OCR-сканирование',
    description: 'Загружайте чеки и извлекайте данные через Tesseract.js.',
  },
  {
    icon: <LineChart size={22} />,
    title: 'Финансовая картина',
    description: 'Смотрите суммы, категории и динамику расходов в одном месте.',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Контроль доступа',
    description: 'Приватные экраны открываются только после авторизации.',
  },
];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useAppStore((state) => state.register);
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterForm, string>>>({});

  const updateField = (field: keyof RegisterForm) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof RegisterForm, string>> = {};
    if (form.name.trim().length < 2) {
      nextErrors.name = 'Введите имя';
    }
    if (!form.email.includes('@')) {
      nextErrors.email = 'Введите корректный email';
    }
    if (form.password.length < 6) {
      nextErrors.password = 'Минимум 6 символов';
    }
    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      register({ name: form.name.trim(), email: form.email });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-base text-text-primary lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden min-h-screen border-r border-white/[0.07] bg-surface px-10 py-10 lg:flex lg:flex-col">
        <Link to="/login" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-white/10">
            <ScanLine size={24} />
          </span>
          <span className="text-xl font-bold">
            Receipt<span className="text-light">Scanner</span>
          </span>
        </Link>

        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-medium text-light">
            <Sparkles size={16} />
          </div>

          <h1 className="max-w-xl text-5xl font-bold leading-tight">
            <span className="text-white">Создайте центр</span>{' '}
            <span className="text-light">учёта чеков</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-text-muted">
            Регистрация открывает приватный дашборд, модуль распознавания и профиль аккаунта.
          </p>

          <div className="mt-10 grid max-w-xl gap-4">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/[0.07] bg-elevated/70 p-5 smooth-transition hover:border-primary/30"
              >
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                  <div>
                    <h2 className="font-bold text-white">{item.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-text-muted">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-[480px]">
          <Link to="/login" className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-white/10">
              <ScanLine size={24} />
            </span>
            <span className="text-xl font-bold">
              Receipt<span className="text-light">Scanner</span>
            </span>
          </Link>

          <div className="rounded-2xl border border-white/[0.07] bg-surface p-6 shadow-2xl shadow-black/20 sm:p-8">
            <div className="mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileText size={24} />
              </div>
              <h1 className="text-3xl font-bold">
                <span className="text-white">Регистрация</span>{' '}
                <span className="text-light">аккаунта</span>
              </h1>
              <p className="mt-3 text-sm leading-6 text-text-muted">
                Заполните данные, чтобы перейти к приватному дашборду.
              </p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <FormInput
                label="Имя"
                type="text"
                placeholder="Алексей"
                autoComplete="name"
                value={form.name}
                error={errors.name}
                onChange={updateField('name')}
              />
              <FormInput
                label="Email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                value={form.email}
                error={errors.email}
                onChange={updateField('email')}
              />
              <FormInput
                label="Пароль"
                type="password"
                placeholder="Минимум 6 символов"
                autoComplete="new-password"
                value={form.password}
                error={errors.password}
                onChange={updateField('password')}
              />
              <FormInput
                label="Повторите пароль"
                type="password"
                placeholder="Введите пароль ещё раз"
                autoComplete="new-password"
                value={form.confirmPassword}
                error={errors.confirmPassword}
                onChange={updateField('confirmPassword')}
              />

              <button
                type="submit"
                className="smooth-transition flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 font-semibold text-white hover:bg-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
              >
                Создать аккаунт
                <ArrowRight size={18} />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-muted">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="font-semibold text-light smooth-transition hover:text-white">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
