import { config } from 'dotenv';

const appEnv = process.env.APP_ENV;
if (appEnv) config({ path: `.env.${appEnv}` });
config();
