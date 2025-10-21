import { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
// import { compilerOptions } from './tsconfig.json'; //Jest does not support ES module syntax for config files yet
// eslint-disable-next-line @typescript-eslint/no-require-imports
const tsconfig = require('./tsconfig.json') as {
	compilerOptions: {
		paths?: Record<string, string[]>;
	};
};

const { compilerOptions } = tsconfig;

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'js', 'json'],
	rootDir: '.',
	testRegex: '.*\\.spec\\.ts$',

	// ✅ Tell Jest about your @ alias
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths ?? {}, {
		prefix: '<rootDir>/',
	}),

	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: './coverage',
	transformIgnorePatterns: [
		'/node_modules/(?!jose)/', // Transpile 'jose' but ignore others
	],
};

export default config;
