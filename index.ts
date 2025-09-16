import { config } from 'dotenv'
import { db } from './src/db/client';
import { urlReference } from './src/db/schema';

config();

const main = async()=>{
    const allBefore = await db.select().from(urlReference);
    console.table(allBefore);

    const insert1 = await db.insert(urlReference).values({
        shortRef: 'https://localhost/tooLong',
        targetRef: 'https://localhost/short'
    }).returning();

    console.log('inserted', JSON.stringify(insert1, null, 2))

    const allAfter = await db.select().from(urlReference);
    console.table(allAfter);
}

await main();