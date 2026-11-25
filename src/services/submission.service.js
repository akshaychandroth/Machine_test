import Submission from "../models/submission.model.js";

export const createSubmission = async (payload) => {
  try {
    const submission = await Submission.create(payload);

    return {
      isDuplicate: false,
      submission,
    };
  } catch (error) {
    if (error.code === 11000) {
      const existingSubmission = await Submission.findOne({
        idempotency_key: payload.idempotency_key,
      });

      if (existingSubmission) {
        return {
          isDuplicate: true,
          submission: existingSubmission,
        };
      }
    }

    throw error;
  }
};

export const getSubmissions = async (formId, page = 1) => {
  const limit = 10;

  const skip = (page - 1) * limit;

  const [submissions, total] = await Promise.all([
    Submission.find({
      form_id: formId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Submission.countDocuments({
      form_id: formId,
    }),
  ]);

  return {
    submissions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
