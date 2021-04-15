export const PORT = process.env.PORT || 4500;
export const isDev = process.env.NODE_ENV === 'development';

export const ALLOWED_ORIGINS = [process.env.ALLOWED_ORIGIN, 'http://localhost:3000'];
