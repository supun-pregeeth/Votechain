import http from 'http';
import { createApp } from './app.js';
import { ENV } from './config/env.js';
import { connectMongo } from './db/mongo.js';
import { createLowdb } from './db/lowdb.js';
import { ensureGenesis } from './bootstrap/ensureGenesis.js';
import { attachWSS } from './sockets/ws.js';

const app = createApp();
const server = http.createServer(app);

// DBs
await connectMongo(ENV.MONGO_URI);
export const db = await createLowdb(ENV.CHAIN_PATH);
await ensureGenesis(db);

// WebSocket
export const { broadcast } = attachWSS(server);

// Boot
server.listen(ENV.PORT, () => {
  console.log(`✅ VoteChain backend listening on http://localhost:${ENV.PORT}`);
  if (ENV.CORS_ORIGIN.length) console.log('CORS allowed:', ENV.CORS_ORIGIN);
});
