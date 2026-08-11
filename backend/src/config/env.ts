const DEV_JWT_SECRET = 'skyticket-dev-secret-change-me';

let hasWarnedAboutJwtFallback = false;

export function getJwtSecret() {
  const configuredSecret = process.env.JWT_SECRET?.trim();
  if (configuredSecret) {
    return configuredSecret;
  }

  const nodeEnv = process.env.NODE_ENV || 'development';
  if (nodeEnv !== 'production') {
    if (!hasWarnedAboutJwtFallback) {
      console.warn('WARNING: JWT_SECRET is missing. Falling back to a development-only secret.');
      hasWarnedAboutJwtFallback = true;
    }
    return DEV_JWT_SECRET;
  }

  throw new Error('JWT_SECRET is not configured');
}

export function getJwtExpiresIn() {
  return process.env.JWT_EXPIRES_IN || '7d';
}
