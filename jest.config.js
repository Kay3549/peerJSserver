/** @type {import('jest').Config} */
export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
		'^(\\.{1,2}/.*)\\.ts$': '$1'
	},
	transform: {
		'^.+\\.(t|j)sx?$': ['@swc/jest']
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	testMatch: ['**/__test__/**/*.(test|spec).(ts|tsx|js)'],
	collectCoverageFrom: [
		'src/**/*.{ts,tsx,js,jsx}',
		'!src/**/*.d.ts'
	]
}
