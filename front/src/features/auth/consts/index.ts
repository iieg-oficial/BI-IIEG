export const AUTH_LABELS = {
  LOGIN_TITLE: 'Iniciar sesión',
  REGISTER_TITLE: 'Crear cuenta',
  EMAIL_LABEL: 'Correo electrónico',
  PASSWORD_LABEL: 'Contraseña',
  CONFIRM_PASSWORD_LABEL: 'Confirmar contraseña',
  FULL_NAME_LABEL: 'Nombre completo',
  LOGIN_BUTTON: 'Iniciar sesión',
  REGISTER_BUTTON: 'Crear cuenta',
  NO_ACCOUNT: '¿No tienes cuenta?',
  HAS_ACCOUNT: '¿Ya tienes cuenta?',
  REGISTER_LINK: 'Regístrate',
  LOGIN_LINK: 'Inicia sesión',
} as const;

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MISMATCH: 'Las contraseñas no coinciden.',
  PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 8 caracteres.',
  REQUIRED_FIELDS: 'Todos los campos son obligatorios.',
} as const;
