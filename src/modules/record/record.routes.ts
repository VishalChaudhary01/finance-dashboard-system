import { Router } from "express";
import { Role } from "@/generated/prisma/enums";
import { authorize } from "@/middlewares/authorize";
import {
  createRecordSchema,
  updateRecordSchema,
} from "@/common/validators/record.validator";
import {
  createRecord,
  deleteRecord,
  getRecord,
  getRecords,
  updateRecord,
} from "./record.controller";
import { inputValidator } from "@/middlewares/inputValidator";

const recordRoutes = Router();

// ANALYST + ADMIN
recordRoutes.get("/", authorize(Role.ADMIN, Role.ANALYST), getRecords);

// ANALYST + ADMIN
recordRoutes.get("/:id", authorize(Role.ADMIN, Role.ANALYST), getRecord);

// ADMIN only
recordRoutes.post(
  "/",
  authorize(Role.ADMIN),
  inputValidator(createRecordSchema),
  createRecord,
);

// ADMIN only
recordRoutes.patch(
  "/:id",
  authorize(Role.ADMIN),
  inputValidator(updateRecordSchema),
  updateRecord,
);

// ADMIN only
recordRoutes.delete("/:id", authorize(Role.ADMIN), deleteRecord);

export default recordRoutes;
