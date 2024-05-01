declare namespace NodeJS {
  interface ProcessEnv {
    readonly DB_USERNAME: string;
    readonly DB_PASSWORD: string;
    readonly DB_DATABASE: string;
    readonly SESSION_SECRET: string;
    readonly JWT_SECRET: string;
    readonly NODE_ENV: 'development' | 'production';
    readonly LOGGING: boolean;
    readonly DB_HOST: string;
    readonly SALT_ROUNDS: number;
  }
}
