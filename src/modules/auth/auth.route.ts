import { Router } from "express";
import { verifyAuth } from "@/middlewares/verifyAuth";
import { signin, signout, signup } from "@/modules/auth/auth.controller";
import { inputValidator } from "@/middlewares/inputValidator";
import { signinSchema, signupSchema } from "@/common/validators/auth.validator";

const authRoutes = Router();

authRoutes.post("/signup", inputValidator(signupSchema), signup);
authRoutes.post("/signin", inputValidator(signinSchema), signin);
authRoutes.post("/signout", verifyAuth, signout);

export default authRoutes;
