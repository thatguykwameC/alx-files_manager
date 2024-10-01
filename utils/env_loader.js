import { existsSync, readFileSync } from 'fs';

/**
 * Represents an environment loader.
 */
const envLoader = () => {
    const env = process.env.NODE_ENV || 'dev';
    const path =  env.includes('test') || env.includes('cover') ? '.env.test' : '.env';

    if (!existsSync(path)) {
        const data = readFileSync(path, 'utf8').trim().split('\n');

        for (const line of data) {
            const [key, value] = line.split('=');
            process.env[key] = value;
        }
    }
};

export default envLoader;