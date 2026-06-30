export type FieldValidator = (value: string) => string | null;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailValidator: FieldValidator = (value) => {
  if (!emailPattern.test(value.trim())) {
    return 'Введите корректный email';
  }

  return null;
};

export const passwordValidator: FieldValidator = (value) => {
  if (value.length < 6) {
    return 'Минимум 6 символов';
  }

  return null;
};

export const nameValidator: FieldValidator = (value) => {
  if (!value.trim()) {
    return 'Введите имя';
  }

  return null;
};

export const validateField = (value: string, validators: FieldValidator[]) => {
  for (const validator of validators) {
    const error = validator(value);

    if (error) {
      return error;
    }
  }

  return undefined;
};
