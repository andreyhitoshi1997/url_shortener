import { insertUrl } from './src/controller/insert';
import { searchUrl } from './src/controller/search';
import { Elysia as App } from 'elysia';

const app = new App();

app.post('/api/shorten', async ({ body, set }) => {
    const response = await insertUrl.handle({ query: { shortRef: undefined, targetRef: undefined }, body });
    set.status = response.statusCode;
    return response.body;
});

app.get('/api/', async ({ query, set }) => {
    const { shortRef, targetRef } = query as { shortRef: any; targetRef: any };
    const response = await searchUrl.handle({ query: { shortRef, targetRef } });
    set.status = response.statusCode;
    return response.body;
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
