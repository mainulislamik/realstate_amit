import app from './app';

const PORT = process.env.PORT || 3000;

if (process.env.VERCEL) {
  // On Vercel the serverless handler (api/index.ts) serves requests.
  // Nothing to listen to here.
} else {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
