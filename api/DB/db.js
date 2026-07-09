import mongoose  from "mongoose";

let retryCount = 0;
const maxRetries = 5;

const connectDatabase = async () => {
  try {
    const data = await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      maxPoolSize: 10,
    });

    console.log(
     ` mongodb connected with server: ${data.connection.host}`
    );
    retryCount = 0;
  } catch (err) {
    console.error(
      `Database connection failed (attempt ${retryCount + 1}/${maxRetries}):`,
      err.message
    );

    if (retryCount < maxRetries) {
      retryCount++;
      console.log("Retrying in 5 seconds...");
      setTimeout(connectDatabase, 5000);
    } else {
      console.error("Max retries reached. Exiting...");
      process.exit(1);
    }
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected! Attempting to reconnect...");
  connectDatabase();
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected successfully");
});

export default  connectDatabase;