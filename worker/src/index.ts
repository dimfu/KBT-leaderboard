import { Env } from "./types";
import router from "./router";
import getTimingRecords from "./app/timing";

export default {
	async fetch(request: Request) {
		return await router.handle(request)
	},
	async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
		switch (event.cron) {
			case '*/10 * * * *':
				await getTimingRecords(env, {
					include: { Gunma: ['pk_akina', 'ek_akagi', 'pk_usui_pass'] }
				})
				break;
		}
	},
};
