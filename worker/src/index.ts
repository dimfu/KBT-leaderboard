import { Env } from "./types";
import router from "./router";
import scheduledTiming from "./app/timing/schedules";

export default {
	async fetch(request: Request) {
		return await router.handle(request)
	},
	async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
		await scheduledTiming(event, env)
	},
};
