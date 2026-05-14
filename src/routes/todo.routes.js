import { Router } from "express";

import {
  createTodo,
  getTodosByList,
  updateTodo,
  deleteTodo,
} from "../controllers/todo.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


// ALL TODO ROUTES ARE PROTECTED

router.use(verifyJWT);


// CREATE TODO

router.route("/:listId")
  .post(createTodo)
  .get(getTodosByList);


// UPDATE TODO

router.route("/update/:id")
  .patch(updateTodo);


// DELETE TODO

router.route("/delete/:id")
  .delete(deleteTodo);


export default router;