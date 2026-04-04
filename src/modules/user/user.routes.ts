import { Router } from "express";
import { Role } from "@/generated/prisma/enums";
import { authorize } from "@/middlewares/authorize";
import { createUser, getUser, getUsers, updateUser } from "./user.controller";
import { inputValidator } from "@/middlewares/inputValidator";
import {
  createUserSchema,
  updateUserSchema,
} from "@/common/validators/user.validator";

const userRoutes = Router();

userRoutes.post(
  "/",
  inputValidator(createUserSchema),
  authorize(Role.ADMIN),
  createUser,
);
userRoutes.get("/", authorize(Role.ADMIN), getUsers);
userRoutes.get("/:id", authorize(Role.ADMIN), getUser);
userRoutes.patch(
  "/:id",
  inputValidator(updateUserSchema),
  authorize(Role.ADMIN),
  updateUser,
);

export default userRoutes;
