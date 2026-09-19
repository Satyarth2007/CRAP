import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import teamRoutes from "./routes/team.routes.js";
import companyRoutes from "./routes/company.routes.js";
import connectionRoutes from "./routes/connection.routes.js";
import jobPostingRoutes from "./routes/jobPosting.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import offerRoutes from "./routes/offer.routes.js";
import tpoRoutes from "./routes/tpo.routes.js";
import hodRoutes from "./routes/hod.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import errorHandler from "./middleware/errorHandler.js";


const app = express();


app.use(helmet());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}


//routes
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/team", teamRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/connections", connectionRoutes);
app.use("/api/v1/job-postings", jobPostingRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/offers", offerRoutes);
app.use("/api/v1/tpo", tpoRoutes);
app.use("/api/v1/hod", hodRoutes);
app.use("/api/v1/notifications", notificationRoutes);

app.use(errorHandler); // must be registered LAST, after every route

export default app;