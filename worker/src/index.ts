import { Env } from "./types";
import router from "./router";

export default {
	async fetch(request: Request) {
		return await router.handle(request)
	},
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		const beforeRecord = await env.TOUGE_UNION.get('satoshi')
		const test = {
			before: beforeRecord ? JSON.parse(beforeRecord).now : null,
			now: new Date().toISOString()
		}
		await env.TOUGE_UNION.put('satoshi', JSON.stringify(test))
		console.log(`trigger fired at ${event.cron}`);
	},
};
