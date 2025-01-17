type EnvVariables = {
  readonly ENV: 'production' | 'staging' | 'development' | 'test';
  readonly NODE_ENV: 'production' | 'development';
  readonly FRAMEWORK_PROVIDER: 'graphql' | 'rest';
  readonly COMMERCETOOLS_API_URL: string;
  readonly COMMERCETOOLS_AUTH_URL: string;
  readonly COMMERCETOOLS_PROJECT_KEY: string;
  readonly COMMERCETOOLS_CLIENT_ID: string;
  readonly COMMERCETOOLS_CLIENT_SECRET: string;
  readonly JWT_SECRET: string;
};

export function getEnv(
  name: keyof EnvVariables,
): EnvVariables[keyof EnvVariables] {
  const val = process?.env[name];
  if (!val) {
    throw new Error(`Cannot find environmental variable: ${name}`);
  }
  return val;
}
