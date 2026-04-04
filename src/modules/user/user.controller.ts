import { RequestHandler } from "express";
import {
  createUserService,
  getUserByIdService,
  getUsersService,
  updateUserService,
} from "./user.service";
import { StatusCode } from "@/config/statusCode";

export const getUsers: RequestHandler = async (_req, res) => {
  const { users } = await getUsersService();

  res
    .status(StatusCode.OK)
    .json({ message: "All users fetched successfully", data: users });
};

export const getUser: RequestHandler = async (req, res) => {
  const { user } = await getUserByIdService(req.params.id as string);

  res
    .status(StatusCode.OK)
    .json({ message: "User fetched successfully", data: user });
};

export const createUser: RequestHandler = async (req, res) => {
  const { user } = await createUserService(req.body);

  res
    .status(StatusCode.CREATED)
    .json({ message: "User created successfully", data: user });
};

export const updateUser: RequestHandler = async (req, res) => {
  const { user } = await updateUserService(req.params.id as string, req.body);

  res.status(StatusCode.OK).json({
    message: "User updated successfully",
    data: user,
  });
};
