import mongoose from 'mongoose';
import { ENV} from "../../../config/env";

export class MongoDBConfig {
    private static instance: MongoDBConfig;
    private isConnected: boolean = false;

    private constructor() {}

    public static getInstance(): MongoDBConfig {
        if (!MongoDBConfig.instance) {
            MongoDBConfig.instance = new MongoDBConfig();
        }
        return MongoDBConfig.instance;
    }

    public async connect(): Promise<void> {
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB: Using existing connection');
            this.isConnected = true;
            this.setupEventHandlers();
            return;
        }

        if (this.isConnected) {
            console.log('MongoDB: Already connected');
            return;
        }

        try {
            const options: mongoose.ConnectOptions = {
                maxPoolSize:                ENV.MONGODB_MAX_POOL_SIZE,
                minPoolSize:                ENV.MONGODB_MIN_POOL_SIZE,
                connectTimeoutMS:           ENV.MONGODB_CONNECT_TIMEOUT_MS,
                socketTimeoutMS:            ENV.MONGODB_SOCKET_TIMEOUT_MS,
                serverSelectionTimeoutMS:   5000,
                heartbeatFrequencyMS:       10000,
            };

            await mongoose.connect(ENV.MONGODB_URI, options);

            this.isConnected = true;

            console.log('✅ MongoDB: Connected successfully');
            console.log(`📦 Database: ${ENV.MONGODB_DATABASE}`);
            console.log(`🌐 Host: ${mongoose.connection.host}`);
            console.log(`🔌 Port: ${mongoose.connection.port}`);

            this.setupEventHandlers();

        } catch (error) {
            console.error('');
            console.error('❌ MongoDB: Connection failed');
            console.error('');
            this.isConnected = false;
            throw error;
        }
    }

    private setupEventHandlers(): void {
        mongoose.connection.once('connected', () => {
            console.log('📡 MongoDB: Connection established');
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  MongoDB: Connection lost');
            this.isConnected = false;
        });

        mongoose.connection.on('error', (error) => {
            console.error('❌ MongoDB: Connection error:', error);
            this.isConnected = false;
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB: Reconnected successfully');
            this.isConnected = true;
        });

        process.once('SIGINT', async () => {
            await this.disconnect();
            process.exit(0);
        });

        process.once('SIGTERM', async () => {
            await this.disconnect();
            process.exit(0);
        });
    }

    public async disconnect(): Promise<void> {
        if (!this.isConnected) return;

        try {
            await mongoose.disconnect();
            this.isConnected = false;
            console.log('MongoDB: Disconnected gracefully');
        } catch (error) {
            console.error('MongoDB: Error during disconnect:', error);
            throw error;
        }
    }

    public isConnectionActive(): boolean {
        return this.isConnected && mongoose.connection.readyState === 1;
    }

    public async healthCheck(): Promise<boolean> {
        try {
            if (!this.isConnected || !mongoose.connection.db) return false;
            await mongoose.connection.db.admin().ping();
            return true;
        } catch (error) {
            console.error('MongoDB: Health check failed:', error);
            return false;
        }
    }
}

export const mongoDBConfig = MongoDBConfig.getInstance();