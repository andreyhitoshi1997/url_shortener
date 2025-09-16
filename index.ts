import { insertUrl } from './src/controllers/insert';
import { searchUrl } from './src/controllers/search';
import { Elysia as App } from 'elysia';

const app = new App();

app.post('/api/shorten', insertUrl);
app.get('/api/', searchUrl);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
