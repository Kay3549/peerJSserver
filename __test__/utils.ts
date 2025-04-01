import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn, type ChildProcessWithoutNullStreams } from "child_process";

// Get current file path and directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const wait = (ms: number): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, ms));

export function startServer(params: string[] = []): Promise<ChildProcessWithoutNullStreams> {
	return new Promise<ChildProcessWithoutNullStreams>((resolve, reject) => {
		// Check if server file exists
		const serverPath = join(__dirname, "..", "dist", "bin", "peerjs.js");
		
		const ls = spawn("node", [
			serverPath,
			"--port",
			"9000",
			...params,
		]);

		let started = false;

		ls.on("error", (error) => {
			console.error('Server error:', error);
			reject(error);
		});

		ls.stdout.on('data', (data) => {
			console.log('Server output:', data.toString());
			if (!started && data.toString().includes('PeerJS Server')) {
				started = true;
				resolve(ls);
			}
		});

		ls.stderr.on('data', (data) => {
			console.error('Server error output:', data.toString());
		});

		// Fallback timeout
		setTimeout(() => {
			if (!started) {
				resolve(ls);
			}
		}, 5000);
	});
}
