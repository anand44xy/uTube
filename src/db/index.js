import mongoose  from "mongoose";

const connectDB = async () => {
    try {
      const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);

      console.log(`MongoDB Connected Successfully. DB HOST: ${connectionInstance.connection.host}`); 
    } catch (error) {
        console.log('MongoDB Connection Failed!:', error);
        process.exit(1); // Exit the process with an error code 1 (indicating a failure)
    }
}

export default connectDB