import type { RequestHandler } from "express";
import { StatusCode } from "@/config/statusCode";
import type { RecordFilterInput } from "@/common/validators/record.validator";
import {
  createRecordService,
  deleteRecordService,
  getRecordByIdService,
  getRecordsService,
  updateRecordService,
} from "./record.service";

export const getRecords: RequestHandler = async (req, res) => {
  const filters = req.query as unknown as RecordFilterInput;

  const { records, pagination } = await getRecordsService(filters);

  res.status(StatusCode.OK).json({
    message: "Records fetched successfully",
    data: {
      records,
      pagination,
    },
  });
};

export const getRecord: RequestHandler = async (req, res) => {
  const { record } = await getRecordByIdService(req.params.id as string);

  res.status(StatusCode.OK).json({
    message: "Record fetched successfully",
    data: record,
  });
};

export const createRecord: RequestHandler = async (req, res) => {
  const userId = req.user!.id;

  const { record } = await createRecordService(userId, req.body);

  res.status(StatusCode.CREATED).json({
    message: "Record created successfully",
    data: record,
  });
};

export const updateRecord: RequestHandler = async (req, res) => {
  const { record } = await updateRecordService(
    req.params.id as string,
    req.body,
  );

  res.status(StatusCode.OK).json({
    message: "Record updated successfully",
    data: record,
  });
};

export const deleteRecord: RequestHandler = async (req, res) => {
  await deleteRecordService(req.params.id as string);

  res.status(StatusCode.OK).json({
    message: "Record deleted successfully",
  });
};
