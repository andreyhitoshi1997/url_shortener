import { findTargetByShortRef } from '../usecases/find_short_ref';
import { closeDbConnection } from '../db/close_db';
import type { HttpResponse, HttpRequest } from '../protocols/http';
import { notFound, ok } from '../helpers/http-helpers';
import type { Controller } from '../protocols/controller';

export class SearchController implements Controller {
    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { shortRef } = request.query;
        
        if (!shortRef) {
            await closeDbConnection();
            return notFound({ message: 'Short reference is required' });
        }
    
        const result = await findTargetByShortRef(shortRef);
        await closeDbConnection();
        if (!result) {
            return notFound({ message: 'Short reference not found' });
        }
        return ok({ targetRef: result });
    }
}

export const searchUrl = new SearchController();