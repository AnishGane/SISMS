import express from "express";
import {
  deleteUser,
  getUserDetails,
  updateUserDetails,
} from "../../controller/shared/setting.controller";
import upload from "../../middlewares/multer";
import { auth } from "../../middlewares/auth.middleware";

const settingRoutes = express.Router();

settingRoutes.get("/user",auth, getUserDetails);
settingRoutes.put("/:id",auth, upload.single("avatar"), updateUserDetails);
settingRoutes.delete("/:id",auth, deleteUser);

export default settingRoutes;
