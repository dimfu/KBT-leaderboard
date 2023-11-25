import { Env } from "./types";
import router from "./router";
import getTimingRecords from "../app/timing";

export default {
	async fetch(request: Request) {
		return await router.handle(request)
	},
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		switch (event.cron) {
			case "*/2 * * * *":
				await getTimingRecords(env)
				break;
		}
	},
};
