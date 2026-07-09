import express from "express";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.route.js";
import cors from "cors";
import path from "path";
import connectDatabase from "./DB/db.js";
dotenv.config();
connectDatabase();

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://taniva.vercel.app",
      "https://abc-project-fronte.vercel.app",
    ],
    credentials: true, // if you use cookies, otherwise can be false
  })
);

app.use(express.json());
app.use(cookieParser());

// Add a root route to confirm backend is running
app.get("/", (req, res) => {
  res.json({
    message: "MERN Real Estate API is running!",
    status: "success",
    timestamp: new Date().toISOString(),
  });
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message,
  });
});
