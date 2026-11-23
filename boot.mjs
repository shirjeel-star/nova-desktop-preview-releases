// Unpacks the worker's code (stored encrypted in worker.bin, key in the WORKER_KEY variable) and starts it.
import { createDecipheriv } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
const key = Buffer.from(process.env.WORKER_KEY || '', 'base64');
if (key.length !== 32) { console.error('WORKER_KEY is missing'); process.exit(1); }
const buf = readFileSync(new URL('./worker.bin', import.meta.url));
const d = createDecipheriv('aes-256-gcm', key, buf.subarray(0, 12)); d.setAuthTag(buf.subarray(12, 28));
const tgz = Buffer.concat([d.update(buf.subarray(28)), d.final()]);
mkdirSync('/app/w', { recursive: true });
execFileSync('tar', ['-xzf', '-', '-C', '/app/w'], { input: tgz });
await import('/app/w/src/main.mjs');
