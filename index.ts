import { insertUrl } from './src/controller/insert';
import { searchUrl } from './src/controller/search';
import { Elysia as App } from 'elysia';

const app = new App();

app.post('/api/shorten', async ({ body, set }) => {
    const response = await insertUrl.handle({ body });
    set.status = response.statusCode;
    return response.body;
});

app.get('/api/', async ({ query, set }) => {
    const response = await searchUrl.handle({ query });
    set.status = response.statusCode;
    return response.body;
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
