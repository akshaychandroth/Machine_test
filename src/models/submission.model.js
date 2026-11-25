import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    form_id: {
      type: String,
      required: true,
      trim: true,
    },

    idempotency_key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
