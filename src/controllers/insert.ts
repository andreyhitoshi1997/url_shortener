import { userAlreadyExists, insertUser } from '../usecases/insert_url_shortener';
import { closeDbConnection } from '../db/close_db';

export async function insertUrl({ body }: { body: { shortRef?: string, targetRef?: string } }) {
    const { shortRef, targetRef } = body;
    if (!shortRef || !targetRef) {
        await closeDbConnection();
        return { error: 'shortRef and targetRef are required' };
    }

    const exists = await userAlreadyExists(shortRef, targetRef);

    if (!exists.error) {
        await closeDbConnection();
        return { error: 'Combination of shortRef and targetRef already exists' };
    }

    const inserted = await insertUser(shortRef, targetRef);
    await closeDbConnection();
    return { inserted };
}

