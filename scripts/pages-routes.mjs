import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { siteUrl } from './site-url.mjs';

const html = await readFile('dist/index.html', 'utf8');
const routes = [
  ['basic', 'Basic', 'تدريب وتغذية مخصصان مع متابعة أسبوعية لمدة ٣ شهور.'],
  ['standard', 'Standard', 'تدريب وتغذية ومتابعة أسبوعية ومراجعة فيديو أداء مرة في الأسبوع لمدة ٣ شهور.'],
  ['premium', 'Premium', 'تدريب وتغذية ومتابعة من مرتين إلى ثلاث أسبوعيًا مع أولوية الرد ومكالمات فيديو لمدة ٣ شهور.'],
  ['training', 'Training Plan', 'جدول تدريبي مخصص بسعر ١٠٠ جنيه، شراء لمرة واحدة بدون تغذية أو متابعة.'],
];

// Actual HTML entry files allow direct package links and refreshes on Pages.
for (const [slug, name, description] of routes) {
  const route = `packages/${slug}/`;
  const title = `${name} | AboEsmail Coaching`;
  await mkdir(`dist/${route}`, { recursive: true });

  const content = html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${title}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${title}`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${description}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${description}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${description}`)
    .replace(`rel="canonical" href="${siteUrl.href}"`, `rel="canonical" href="${new URL(route, siteUrl).href}"`)
    .replace(`property="og:url" content="${siteUrl.href}"`, `property="og:url" content="${new URL(route, siteUrl).href}"`);

  await writeFile(`dist/${route}index.html`, content);
}

await writeFile('dist/404.html', html);
await writeFile('dist/.nojekyll', '');
console.log(`Created package entry pages for ${siteUrl.href}`);
