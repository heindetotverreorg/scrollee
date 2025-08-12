import mongoose from "mongoose";
import { Request, Response } from 'express';

const { Schema } = mongoose

const mongoController = {
    connectToMongoClient: async (req: Request, res: Response) => {
        try {
            console.log("Connecting to MongoDB...");

            const { connectString } = req.body;
            console.log("Received connection string:", connectString);

            const connectionString = connectString || `mongodb://${process.env.MONGO_URL as string}`;

            console.log("MongoDB connection string:", connectionString);

            await mongoose.connect(connectionString, {
                serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if no server is found
                directConnection: true, // Use direct connection to the MongoDB server
            });

            console.log("Connected to MongoDB successfully");

            res.status(200).json({
                message: 'Connected to MongoDB successfully'
            });
        } catch (error) {
            console.log('db connection error: ', error);
            res.status(500).json({
                message: 'Failed to connect to MongoDB'
            });
        }
    }
}

export { mongoController };