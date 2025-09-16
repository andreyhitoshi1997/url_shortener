import { findTargetByShortRef } from '../usecases/find_short_ref';
import { closeDbConnection } from '../db/close_db';
import type { Controller } from '../protocols/http-protocol';
import type { HttpResponse, HttpRequest } from '../protocol/http';
import { notFound, ok } from '../helpers/http-helpers';

export class SearchController implements Controller {
    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { shortRef,targetRef } = request.query;
        
        if (!shortRef) {
            return {
                statusCode: 400,
                body: { error: 'shortRef query param is required' }
            };
        }
        const target = await findTargetByShortRef();
        await closeDbConnection();
        if (!target) {
            return notFound({ message: 'Short reference not found' });
        }
        return ok(target)
    }
}

export const searchUrl = new SearchController();