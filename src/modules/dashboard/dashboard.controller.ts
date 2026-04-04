import type { RequestHandler } from "express";
import { StatusCode } from "@/config/statusCode";
import {
  getCategoryTotalsService,
  getDashboardService,
  getMonthlyTrendsService,
  getRecentActivityService,
  getSummaryService,
  getWeeklyTrendsService,
} from "./dashboard.service";

export const getDashboard: RequestHandler = async (req, res) => {
  const year = req.query["year"]
    ? parseInt(req.query["year"] as string, 10)
    : undefined;

  const data = await getDashboardService(year);

  res.status(StatusCode.OK).json({
    message: "Dashboard fetched successfully",
    data,
  });
};

export const getSummary: RequestHandler = async (_req, res) => {
  const data = await getSummaryService();

  res.status(StatusCode.OK).json({
    message: "Summary fetched successfully",
    data,
  });
};

export const getCategoryTotals: RequestHandler = async (_req, res) => {
  const data = await getCategoryTotalsService();

  res.status(StatusCode.OK).json({
    message: "Category totals fetched successfully",
    data,
  });
};

export const getRecentActivity: RequestHandler = async (req, res) => {
  const limit = req.query["limit"]
    ? parseInt(req.query["limit"] as string, 10)
    : 10;

  const data = await getRecentActivityService(limit);

  res.status(StatusCode.OK).json({
    message: "Recent activity fetched successfully",
    data,
  });
};

export const getMonthlyTrends: RequestHandler = async (req, res) => {
  const year = req.query["year"]
    ? parseInt(req.query["year"] as string, 10)
    : undefined;

  const data = await getMonthlyTrendsService(year);

  res.status(StatusCode.OK).json({
    message: "Monthly trends fetched successfully",
    data,
  });
};

export const getWeeklyTrends: RequestHandler = async (_req, res) => {
  const data = await getWeeklyTrendsService();

  res.status(StatusCode.OK).json({
    message: "Weekly trends fetched successfully",
    data,
  });
};
