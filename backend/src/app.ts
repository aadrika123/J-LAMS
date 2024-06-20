import express from "express";
import dotenv from "dotenv";
import AssetsRoute from "./component/juidcoHrms/router";
import cors from "cors";


dotenv.config();
const app = express();
// app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(cors());

new AssetsRoute(app);

// app.use(loggerMiddleware);

export default app;
