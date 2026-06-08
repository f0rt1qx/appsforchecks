import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, ScanLine } from 'lucide-react';
import { FormInput } from '@/components/FormInput';
import { MOCK_USER, useAppStore } from '@/store';

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAppStore((state) => state.login);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form | 'form', string>>>({});

  const updateField = (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: '', form: '' }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof typeof form, string>> = {};
    if (!form.email.includes('@')) {
      nextErrors.email = 'Введите корректный email';
    }
    if (form.password.length < 6) {
      nextErrors.password = 'Минимум 6 символов';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      const result = login({ email: form.email, password: form.password });

      if (result.success) {
        navigate('/dashboard');
        return;
      }

      setErrors({ form: result.error });
    }
  };

  return (
    <div className="min-h-screen bg-base text-text-primary flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[440px]">
        <Link to="/login" className="mb-8 flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-white/10">
            <ScanLine size={24} />
          </span>
          <span className="text-xl font-bold tracking-normal">
            Receipt<span className="text-light">Scanner</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-white/[0.07] bg-surface p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="mb-7">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <LockKeyhole size={24} />
            </div>
            <h1 className="text-3xl font-bold">
              <span className="text-white">Вход</span>{' '}
              <span className="text-light">в аккаунт</span>
            </h1>
            <p className="mt-3 text-sm leading-6 text-text-muted">
              Авторизуйтесь, чтобы открыть дашборд чеков и OCR-модуль.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {errors.form && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {errors.form}
              </div>
            )}
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
              placeholder="Введите пароль"
              autoComplete="current-password"
              value={form.password}
              error={errors.password}
              onChange={updateField('password')}
            />

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 text-text-muted">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/10 bg-elevated text-primary focus:ring-primary"
                />
                Запомнить меня
              </label>
              <a href="#restore" className="font-medium text-light smooth-transition hover:text-white">
                Забыли пароль?
              </a>
            </div>

            <button
              type="submit"
              className="smooth-transition flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 font-semibold text-white hover:bg-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
            >
              Войти
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-white/[0.07] bg-elevated/70 p-4 text-sm text-text-muted">
            <div className="font-semibold text-white">Демо-доступ</div>
            <div className="mt-2">Email: {MOCK_USER.email}</div>
            <div>Пароль: {MOCK_USER.password}</div>
          </div>

          <p className="mt-6 text-center text-sm text-text-muted">
            Нет аккаунта?{' '}
            <Link to="/register" className="font-semibold text-light smooth-transition hover:text-white">
              Создать аккаунт
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
