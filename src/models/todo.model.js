import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Todo title is required"],
      trim: true,
      minlength: [3, "Todo title must be at least 3 characters"],
      maxlength: [200, "Todo title cannot exceed 200 characters"],
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["pending", "done"],
      default: "pending",
    },

    isOverdue: {
      type: Boolean,
      default: false,
    },

    list: {
      type: Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Todo = mongoose.model("Todo", todoSchema);