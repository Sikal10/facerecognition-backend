import express from "express";
import {registerUser, loginUser, getUsers, getUser, userPhotoUpload} from "../controllers/userControllers.js";

const router = express.Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/").get(getUsers)
router.route("/:id").get(getUser)
router.route("/image").post(userPhotoUpload)

export default router;