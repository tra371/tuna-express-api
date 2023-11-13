import { Router } from "express";
import {
  authRefreshTokenValidator,
  authSignupValidator,
} from "../../middlewares/validators/validator";
import {
  login,
  refreshToken,
  signup,
} from "../../controllers/auth.controllers";

const router = Router();

router.post("/signup", authSignupValidator, signup);
router.post("/login", login);
router.post("/refresh-token", authRefreshTokenValidator, refreshToken);

export default router;
