import { findTargetByShortRef } from '../usecases/find_short_ref';
import { closeDbConnection } from '../db/close_db';

export async function searchUrl({ query }: { query: { shortRef?: string } }) {
    const { shortRef } = query;
    if (!shortRef) {
        return { error: 'shortRef query param is required' };
    }
    const target = await findTargetByShortRef(shortRef);
    await closeDbConnection();
    if (!target) {
        return { error: 'Not found' };
    }
    return { targetRef: target };
}

