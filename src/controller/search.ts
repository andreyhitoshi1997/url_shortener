import { findTargetByShortRef } from '../usecases/find_short_ref';
import { closeDbConnection } from '../db/close_db';
import type { Controller } from '../protocols/http';
import type { HttpResponse, HttpRequest } from '../protocols/http';
import { notFound, ok } from '../helpers/http-helpers';

export class SearchController implements Controller {
    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { shortRef,targetRef } = request.query;
    
        const result = await findTargetByShortRef(shortRef);
        await closeDbConnection();
        if (!result) {
            return notFound({ message: 'Short reference not found' });
        }
        return ok(result)
    }
}

export const searchUrl = new SearchController();