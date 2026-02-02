import express from "express";
import { auth } from "../../middlewares/auth.middleware";
import { getABCStats } from "../../controller/admin/analytics.controller";

const analyticsRoute = express.Router();

analyticsRoute.get("/abc", auth, getABCStats);

export default analyticsRoute;
