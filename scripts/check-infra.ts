import mongoose from 'mongoose';

const MAX_RETRIES  = 3;
const RETRY_DELAY  = 2000;
const SERVICE_NAME = process.env.npm_package_name ?? 'service';

function getMongoUri(): string {
    const uri = process.env.MONGODB_URI ?? process.env.MONGODB_URL_STRING;
    if (!uri) {
        console.error('  MONGODB_URI is not set. Check your .env file.');
        process.exit(1);
    }
    return uri;
}

async function tryConnect(uri: string, attempt = 1): Promise<boolean> {
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 3000,
            connectTimeoutMS: 3000,
            maxPoolSize: 1,
        });
        await mongoose.connection.db?.admin().ping();
        return true;
    } catch {
        if (attempt < MAX_RETRIES) {
            console.log(`  retrying ${attempt}/${MAX_RETRIES} in ${RETRY_DELAY / 1000}s...`);
            await new Promise(r => setTimeout(r, RETRY_DELAY));
            return tryConnect(uri, attempt + 1);
        }
        return false;
    } finally {
        if (mongoose.connection.readyState === 1) await mongoose.disconnect();
    }
}

async function main() {
    const uri       = getMongoUri();
    const deployEnv = process.env.DEPLOY_ENV ?? 'local';
    const maskedUri = uri.replace(/:[^:@]+@/, ':****@');

    console.log('');
    console.log('  Bitdoot Infrastructure Check');
    console.log('  ────────────────────────────');
    console.log(`  Service  : ${SERVICE_NAME}`);
    console.log(`  Deploy   : ${deployEnv}`);
    console.log(`  MongoDB  : ${maskedUri}`);
    console.log('');

    const ok = await tryConnect(uri);

    if (!ok) {
        console.error('');
        console.error('  ✗ Infrastructure error');
        console.error('  ────────────────────────────────────────────────');
        console.error(`  MongoDB unreachable after ${MAX_RETRIES} attempts`);
        console.error('');
        console.error('  Start the infrastructure service first:');
        console.error('    cd service-infrastructure/mongodb');
        console.error('    docker compose up -d');
        console.error('');
        process.exit(1);
    }

    console.log(`  ✓ MongoDB reachable`);
    console.log(`  ✓ Database : ${process.env.MONGODB_DATABASE ?? 'bitdoot_db'}`);
    console.log('');
    console.log('  Infrastructure ready. Starting service...');
    console.log('');
}

main();