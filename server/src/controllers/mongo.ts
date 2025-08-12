import mongoose from "mongoose";
import { Request, Response } from 'express';

const { Schema } = mongoose

const mongoController = {
    connectToMongoClient: async (req: Request, res: Response) => {
        try {
            const connectionString = `mongodb://${process.env.MONGO_URL as string}`;

            await mongoose.connect(connectionString);

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