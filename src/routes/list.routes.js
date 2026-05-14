import { Router } from "express";

import {
  createList,
  getUserLists,
  getSingleList,
  deleteList,
} from "../controllers/list.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


// PROTECTED ROUTES

router.use(verifyJWT);


// CREATE LIST

router.route("/")
  .post(createList)
  .get(getUserLists);

  


// GET SINGLE LIST

router.route("/:id")
  .get(getSingleList)
  .delete(deleteList);


export default router;