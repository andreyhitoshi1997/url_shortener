import { config } from 'dotenv'
import { db } from './src/db/client';
import { urlReference } from './src/db/schema';
import { Elysia } from 'elysia';
import { findTargetByShortRef } from './src/usecases/find_short_ref';
import { userAlreadyExists } from './src/usecases/insert_url_shortener';
import { insertUser } from './src/usecases/insert_url_shortener';

config();

async function closeDbConnection() {
    if (db && typeof db.end === 'function') {
        await db.end();
    }
}

async function bootstrap() {
    const allBefore = await db.select().from(urlReference);
    console.table(allBefore);


    const allAfter = await db.select().from(urlReference);
    console.table(allAfter);

    const app = new Elysia();

    app.get('/api', async ({ query }) => {
        const { shortRef } = query as { shortRef?: string };
        if (!shortRef) {
            return { error: 'shortRef query param is required' };
        }
        const target = await findTargetByShortRef(shortRef);
        await closeDbConnection();
        if (!target) {
            return { error: 'Not found' };
        }
        return { targetRef: target };
    });

    app.post('/api/shorten', async ({ body }) => {
        const { shortRef, targetRef } = body as { shortRef?: string, targetRef?: string };

        if (!shortRef || !targetRef) {
            await closeDbConnection();
            return { error: 'shortRef and targetRef are required' };
        }

        const exists = await userAlreadyExists(shortRef, targetRef);

        if (!exists.error) {
            await closeDbConnection();
            return { error: 'Combination of shortRef and targetRef already exists' };
        }

        const inserted = await insertUser(shortRef, targetRef)
    
        await closeDbConnection();
        return { inserted };
    });

    app.listen(3000);
}

await bootstrap();

