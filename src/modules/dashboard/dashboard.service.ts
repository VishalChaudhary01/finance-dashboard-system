import { prisma } from "@/config/prisma";

export const getSummaryService = async () => {
  const result = await prisma.financialRecord.groupBy({
    by: ["type"],
    where: { isDeleted: false },
    _sum: { amount: true },
  });

  const income = result.find((r) => r.type === "INCOME")?._sum.amount ?? 0;
  const expenses = result.find((r) => r.type === "EXPENSE")?._sum.amount ?? 0;

  const totalIncome = Number(income);
  const totalExpenses = Number(expenses);
  const netBalance = totalIncome - totalExpenses;

  return { totalIncome, totalExpenses, netBalance };
};

export const getCategoryTotalsService = async () => {
  const result = await prisma.financialRecord.groupBy({
    by: ["category", "type"],
    where: { isDeleted: false },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
  });

  const totals = result.map((r) => ({
    category: r.category,
    type: r.type,
    total: Number(r._sum.amount ?? 0),
  }));

  return { totals };
};

export const getRecentActivityService = async (limit: number = 10) => {
  const records = await prisma.financialRecord.findMany({
    where: { isDeleted: false },
    orderBy: { date: "desc" },
    take: limit,
    select: {
      id: true,
      amount: true,
      type: true,
      category: true,
      date: true,
      notes: true,
      user: {
        select: { id: true, name: true },
      },
    },
  });

  const activity = records.map((r) => ({
    ...r,
    amount: Number(r.amount),
  }));

  return { activity };
};

export const getMonthlyTrendsService = async (year?: number) => {
  const targetYear = year ?? new Date().getFullYear();

  const result = await prisma.$queryRaw<
    { month: number; type: string; total: number }[]
  >`
    SELECT
      EXTRACT(MONTH FROM "date")::int AS month,
      "type",
      SUM("amount")::float AS total
    FROM "FinancialRecord"
    WHERE
      "isDeleted" = false
      AND EXTRACT(YEAR FROM "date") = ${targetYear}
    GROUP BY month, "type"
    ORDER BY month ASC
  `;

  const map = new Map<string, number>();

  result.forEach((r) => {
    map.set(`${r.month}-${r.type}`, r.total);
  });

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;

    const income = map.get(`${month}-INCOME`) ?? 0;
    const expense = map.get(`${month}-EXPENSE`) ?? 0;

    return {
      month,
      income,
      expense,
      net: income - expense,
    };
  });

  return { year: targetYear, months };
};

export const getWeeklyTrendsService = async () => {
  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const result = await prisma.$queryRaw<
    {
      day: string;
      type: string;
      total: number;
    }[]
  >`
    SELECT
        DATE("date") AS day, type,
        SUM(amount)::float AS total
    FROM "FinancialRecord"
    WHERE
        "isDeleted" = false
        AND date >= ${since}
    GROUP BY day, type
    ORDER BY day ASC
  `;

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const day = d.toISOString().split("T")[0];

    const map = new Map<string, number>();

    result.forEach((r) => {
      map.set(`${r.day}-${r.type}`, r.total);
    });

    const income = map.get(`${day}-INCOME`) ?? 0;
    const expense = map.get(`${day}-EXPENSE`) ?? 0;

    return { day, income, expense, net: income - expense };
  });

  return { days };
};

export const getDashboardService = async (year?: number) => {
  const [summary, categoryTotals, recentActivity, monthlyTrends, weeklyTrends] =
    await Promise.all([
      getSummaryService(),
      getCategoryTotalsService(),
      getRecentActivityService(10),
      getMonthlyTrendsService(year),
      getWeeklyTrendsService(),
    ]);

  return {
    summary,
    categoryTotals,
    recentActivity,
    monthlyTrends,
    weeklyTrends,
  };
};
