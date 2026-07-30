import { createApp } from '../../src/api.ts';
import serverless from 'serverless-http';

const app = createApp();
export const handler = serverless(app);
