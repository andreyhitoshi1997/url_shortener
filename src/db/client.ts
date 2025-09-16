import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { urlReference } from './schemas/url_reference';

export const db = drizzle(process.env.DATABASE_URL!, { schema: { urlReference } });