import { Todo } from "../models/todo.model.js";
import { List } from "../models/list.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

import {
  createTodoSchema,
  updateTodoSchema,
} from "../validation/todo.validator.js";


import { getIO } from "../socket/socket.js";




// CREATE TODO

export const createTodo = asyncHandler(async (req, res) => {

  const validatedData = createTodoSchema.parse(req.body);

  const {
    title,
    description,
    priority,
    dueDate,
  } = validatedData;

  const { listId } = req.params;

  const list = await List.findById(listId);

  if (!list) {
    throw new ApiError(404, "List not found");
  }

  const isOwner =
    list.owner.toString() === req.user._id.toString();

  const isCollaborator =
    list.collaborators.includes(req.user._id);

  if (!isOwner && !isCollaborator) {
    throw new ApiError(403, "Access denied");
  }

  const todo = await Todo.create({
    title,
    description,
    priority,
    dueDate,
    list: listId,
    createdBy: req.user._id,
  });

  const io = getIO();

  io.to(listId).emit("todo-created",todo);

  return res.status(201).json(
    new ApiResponse(
      201,
      todo,
      "Todo created successfully"
    )
  );

});



// GET TODOS OF A LIST

export const getTodosByList = asyncHandler(async (req, res) => {

  const { listId } = req.params;

  const list = await List.findById(listId);

  if (!list) {
    throw new ApiError(404, "List not found");
  }

  const isOwner =
    list.owner.toString() === req.user._id.toString();

  const isCollaborator =
    list.collaborators.includes(req.user._id);

  if (!isOwner && !isCollaborator) {
    throw new ApiError(403, "Access denied");
  }

  const todos = await Todo.find({
    list: listId,
  })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      todos,
      "Todos fetched successfully"
    )
  );

});



// UPDATE TODO

export const updateTodo = asyncHandler(async (req, res) => {

  const validatedData = updateTodoSchema.parse(req.body);

  const { id } = req.params;

  const todo = await Todo.findById(id)
    .populate("list");

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const isOwner =
    todo.list.owner.toString() === req.user._id.toString();

  const isCollaborator =
    todo.list.collaborators.includes(req.user._id);

  if (!isOwner && !isCollaborator) {
    throw new ApiError(403, "Access denied");
  }

  const updatedTodo = await Todo.findByIdAndUpdate(
    id,
    validatedData,
    {
      new: true,
      runValidators: true,
    }
  );

  const io = getIO();

  io.to(todo.list._id.toString()).emit("todo-updated",updatedTodo)

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedTodo,
      "Todo updated successfully"
    )
  );

});



// DELETE TODO

export const deleteTodo = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const todo = await Todo.findById(id)
    .populate("list");

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  const isOwner =
    todo.list.owner.toString() === req.user._id.toString();

  const isCollaborator =
    todo.list.collaborators.includes(req.user._id);

  if (!isOwner && !isCollaborator) {
    throw new ApiError(403, "Access denied");
  }

  const listId = todo.list._id.toString();

  await Todo.findByIdAndDelete(id);

  const io = getIO();

  io.to(listId).emit("todo-deleted", {
  todoId: id,
});

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Todo deleted successfully"
    )
  );

});