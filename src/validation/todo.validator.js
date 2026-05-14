import { z } from "zod";

export const createTodoSchema = z.object({

  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),

  description: z
    .string()
    .trim()
    .optional(),

  priority: z
    .enum(["low", "medium", "high"])
    .optional(),

  dueDate: z
    .string()
    .datetime()
    .optional(),

});



export const updateTodoSchema = z.object({

  title: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .optional(),

  description: z
    .string()
    .trim()
    .optional(),

  priority: z
    .enum(["low", "medium", "high"])
    .optional(),

  status: z
    .enum(["pending", "done"])
    .optional(),

  dueDate: z
    .string()
    .datetime()
    .optional(),

  isOverdue: z
    .boolean()
    .optional(),

});