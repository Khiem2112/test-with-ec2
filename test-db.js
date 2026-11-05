const fs = require('fs');
const path = require('path');
const net = require('net');

function loadEnv() {
  const envPath = path.resolve(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('[Error] File .env not found at:', envPath);
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const splitIndex = trimmed.indexOf('=');
    if (splitIndex > 0) {
      const key = trimmed.slice(0, splitIndex).trim();
      const val = trimmed.slice(splitIndex + 1).trim();
      env[key] = val;
    }
  }
  return env;
}

const env = loadEnv();
const host = env.DB_HOST;
const port = parseInt(env.DB_PORT || '5432', 10);
const user = env.DB_USER;
const pass = env.DB_PASS;
const dbName = env.DB_NAME || 'postgres';

console.log('Testing connection to PostgreSQL RDS:');
console.log('Host:', host);
console.log('Port:', port);
console.log('User:', user);
console.log('Database:', dbName);
console.log('---');

const socket = new net.Socket();
socket.setTimeout(5000);

socket.connect(port, host, () => {
  console.log('[PASS] TCP Network handshake successful: Port', port, 'is OPEN and reachable.');
  socket.end();

  try {
    const { Client } = require('pg');
    const client = new Client({
      host: host,
      port: port,
      user: user,
      password: pass,
      database: dbName,
      ssl: { rejectUnauthorized: false }
    });

    console.log('Executing database authentication query...');
    client.connect((err) => {
      if (err) {
        console.error('[FAIL] PostgreSQL Authentication failed:', err.message);
        process.exit(1);
      }
      client.query('SELECT current_database(), current_user, version();', (queryErr, res) => {
        if (queryErr) {
          console.error('[FAIL] Query error:', queryErr.message);
        } else {
          console.log('[PASS] Connected successfully to database:', res.rows[0].current_database);
          console.log('Authenticated user:', res.rows[0].current_user);
          console.log('PostgreSQL version:', res.rows[0].version.split(' on ')[0]);
        }
        client.end();
        process.exit(queryErr ? 1 : 0);
      });
    });
  } catch (e) {
    console.log('[INFO] Package "pg" is not installed. To run full SQL query test, run: npm install pg');
    console.log('TCP port is already confirmed open and reachable.');
    process.exit(0);
  }
});

socket.on('error', (err) => {
  console.error('[FAIL] TCP Connection failed:', err.message);
  console.error('Note: If running from local machine, RDS may have Public Access set to "No".');
  console.error('Ensure you run this test from your EC2 instance in the same VPC.');
  process.exit(1);
});

socket.on('timeout', () => {
  console.error('[FAIL] Connection timed out after 5000ms.');
  console.error('Check RDS Security Group to allow inbound traffic on port', port);
  socket.destroy();
  process.exit(1);
});

