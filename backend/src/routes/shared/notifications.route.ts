import express from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import {
  getNotifications,
  markAllRead,
  markAsRead,
  unreadCount,
} from "../../controller/shared/notification.controller.js";

const notificationRoutes = express.Router();

notificationRoutes.get("/", auth, getNotifications);
notificationRoutes.patch("/markAllRead",auth, markAllRead)
notificationRoutes.patch("/:id/read", auth, markAsRead);
notificationRoutes.get("/unread/count", auth, unreadCount);

export default notificationRoutes;
