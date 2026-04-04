import { Router } from "express";
import { createUser, getUser, getUsers, updateUser } from "./user.controller";
import { inputValidator } from "@/middlewares/inputValidator";
import {
  createUserSchema,
  updateUserSchema,
} from "@/common/validators/user.validator";

const userRoutes = Router();

// ADMIN only
userRoutes.post("/", inputValidator(createUserSchema), createUser);
userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUser);
userRoutes.patch("/:id", inputValidator(updateUserSchema), updateUser);

export default userRoutes;
