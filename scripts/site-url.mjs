import { readFileSync } from 'node:fs';

// GitHub Actions supplies the actual Pages URL. This file is the local fallback.
const config = JSON.parse(readFileSync(new URL('../site.config.json', import.meta.url), 'utf8'));
const siteUrl = new URL(process.env.SITE_URL || config.siteUrl);

if (!['https:', 'http:'].includes(siteUrl.protocol) || siteUrl.username || siteUrl.password) {
  throw new Error('siteUrl must be an http or https URL without credentials.');
}

siteUrl.search = '';
siteUrl.hash = '';
siteUrl.pathname = `${siteUrl.pathname.replace(/\/+$/, '')}/`;

export { siteUrl };
