import Fastify from 'fastify';
import bearerAuthPlugin from '@fastify/bearer-auth';
import ngrok from '@ngrok/ngrok';
import { exec } from 'node:child_process';
import { $ } from 'bun';

const fastify = Fastify();
fastify.register(bearerAuthPlugin, { keys: [process.env['BEARER_TOKEN']!] });

fastify.post('/shutdown', async (request, _) => {
    if (!request.body) return;

    const minutes = parseInt(request.body as string);
    if (!minutes || minutes <= 0) return;

    exec(`shutdown -P ${minutes}`);
    return;
});

await fastify.listen({ port: 3000 });

const who = await $`hostname`.text();
await ngrok.forward({
    domain: `${who === 'kony' ? 'quietly-nice-bull' : 'arriving-fairly-dodo'}.ngrok-free.app`,
    addr: 3000,
    authtoken: process.env[`${who.toUpperCase()}_AUTHTOKEN`],
});
