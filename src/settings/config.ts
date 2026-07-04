const env = process.env;

// Учётные данные супер-админа (Basic Auth). Берём из окружения, с дефолтами для локали.
export const ADMIN_USERNAME = env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'qwerty';

// Все настройки приложения собраны в одном месте, а не разбросаны по коду.
export const SETTINGS = {
  PORT: env.PORT || 5003,
  MONGO_URL: env.MONGO_URL || 'mongodb://localhost:27017/ed-back-lessons-uber',
  DB_NAME: env.DB_NAME || 'ed-back-lessons-uber',
};
