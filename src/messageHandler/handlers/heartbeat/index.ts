import type { IClient } from "../../../models/client.js";

export const HeartbeatHandler = (client: IClient | undefined): boolean => {
	if (client) {
		const nowTime = new Date().getTime();
		client.setLastPing(nowTime);
	}

	return true;
};
