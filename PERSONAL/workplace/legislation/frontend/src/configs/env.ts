// types for the envSchema

const createEnv = () => {
  const envVars = Object.entries(import.meta.env).reduce<Record<string, string>>((acc, curr) => {
    const [key, value] = curr;

    if (key.startsWith('VITE_APP_')) {
      acc[key.replace('VITE_APP_', '')] = value;
    }
    return acc;
  }, {});

  if (!Object.keys(envVars).length) {
    throw new Error(`Invalid env provided. The following variables are missing or invalid:`);
  }

  return envVars;
};

export const env = createEnv();
