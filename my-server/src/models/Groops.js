import mongoose, { Schema } from "mongoose";

const groopsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Groops", groopsSchema);
