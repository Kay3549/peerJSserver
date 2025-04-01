import { describe, expect, it } from "@jest/globals";
import fetch from "node-fetch";
import crypto from "crypto";
import { startServer } from "./utils";

describe("Check bin/peerjs", () => {
	it("should return content of app.json file", async () => {
		expect.assertions(1);

		const ls = await startServer();
		try {
			// Add delay to ensure server is ready
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			const response = await fetch("http://localhost:9000/", {
				headers: {
					'Accept': 'application/json'
				}
			});
			const data = await response.json();

			expect(data).toEqual({
				name: "PeerJS Server",
				description: "A server side element to broker connections between PeerJS clients."
			});
		} catch (error) {
			console.error('Test error:', error);
			throw error;
		} finally {
			ls.kill();
		}
	}, 15000); // Increased timeout

	it("should reflect the origin header in CORS by default", async () => {
		expect.assertions(1);

		const ls = await startServer();
		try {
			// Add delay to ensure server is ready
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			const origin = crypto.randomUUID();
			const response = await fetch("http://localhost:9000/peerjs/id", {
				headers: {
					'Origin': origin,
					'Accept': 'application/json'
				}
			});

			expect(response.headers.get("access-control-allow-origin")).toBe(origin);
		} finally {
			ls.kill();
		}
	}, 15000); // Increased timeout

	it("should respect the CORS parameters", async () => {
		expect.assertions(3);

		const origin1 = crypto.randomUUID();
		const origin2 = crypto.randomUUID();

		const ls = await startServer([
			"--allow_discovery",
			"--cors_origin",
			origin1
		]);

		try {
			// Add delay to ensure server is ready
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			const response1 = await fetch("http://localhost:9000/peerjs/id", {
				headers: {
					'Origin': origin1,
					'Accept': 'application/json'
				}
			});

			expect(response1.headers.get("access-control-allow-origin")).toBe(origin1);

			const response2 = await fetch("http://localhost:9000/peerjs/id", {
				headers: {
					'Origin': origin2,
					'Accept': 'application/json'
				}
			});

			expect(response2.headers.get("access-control-allow-origin")).toBe(origin1);

			const response3 = await fetch("http://localhost:9000/peerjs/peers", {
				headers: {
					'Accept': 'application/json'
				}
			});
			expect(response3.status).toBe(200);
		} finally {
			ls.kill();
		}
	}, 15000); // Increased timeout
});
