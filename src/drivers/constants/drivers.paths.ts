// Базовый путь модуля водителей (задаётся при подключении роутера в setup-app).
export const DRIVERS_PATH = '/api/drivers';

// Относительные под-маршруты внутри роутера водителей.
export const DRIVERS_ROUTES = {
  ROOT: '',
  BY_ID: '/:id',
  DRIVER_RIDES: '/:id/rides',
} as const;
