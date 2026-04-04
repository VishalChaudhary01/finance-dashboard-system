import { Router } from "express";
import { Role } from "@/generated/prisma/enums";
import { authorize } from "@/middlewares/authorize";
import {
  getCategoryTotals,
  getDashboard,
  getMonthlyTrends,
  getRecentActivity,
  getSummary,
  getWeeklyTrends,
} from "./dashboard.controller";

const dashboardRoutes = Router();

// VIEWER, ANALYST, and ADMIN
dashboardRoutes.get("/", getDashboard);
// all below routes is for ANALYST and ADMIN only
dashboardRoutes.get(
  "/summary",
  authorize(Role.ADMIN, Role.ANALYST),
  getSummary,
);
dashboardRoutes.get(
  "/category-totals",
  authorize(Role.ADMIN, Role.ANALYST),
  getCategoryTotals,
);
dashboardRoutes.get(
  "/recent-activity",
  authorize(Role.ADMIN, Role.ANALYST),
  getRecentActivity,
);
dashboardRoutes.get(
  "/monthly-trends",
  authorize(Role.ADMIN, Role.ANALYST),
  getMonthlyTrends,
);
dashboardRoutes.get(
  "/weekly-trends",
  authorize(Role.ADMIN, Role.ANALYST),
  getWeeklyTrends,
);

export default dashboardRoutes;
