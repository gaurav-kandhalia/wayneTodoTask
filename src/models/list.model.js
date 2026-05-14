import mongoose, { Schema } from "mongoose";

const listSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "List title is required"],
      trim: true,
      minlength: [3, "List title must be at least 3 characters"],
      maxlength: [100, "List title cannot exceed 100 characters"],
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const List = mongoose.model("List", listSchema);