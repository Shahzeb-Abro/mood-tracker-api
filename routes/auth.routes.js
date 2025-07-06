import { Router } from "express";
import {
  changePassword,
  deleteMe,
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resetPassword,
  signToken,
  updateUserDetails,
} from "../controllers/auth.controller.js";
import passport from "passport";
import { authorize } from "../middlewares/authorize.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logout);
router.post("/change-password", authorize, changePassword);
router.delete("/delete-me", authorize, deleteMe);
router.post(
  "/update-me",
  authorize,
  upload.single("avatar"),
  updateUserDetails
);

router.get("/me", authorize, getMe);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    successRedirect: process.env.FRONTEND_URL,
    session: false,
  }),
  (req, res) => {
    signToken(req?.user?._id, res);
    res.redirect(process.env.FRONTEND_URL);
  }
);

export default router;
