import {
  createSubmission,
  getSubmissions,
} from "../services/submission.service.js";

export const submitForm = async (req, res, next) => {
  try {
    const { form_id, idempotency_key, email, data } = req.body;

    // Validate required fields
    if (!form_id || typeof form_id !== "string" || !form_id.trim()) {
      return res.status(400).json({
        success: false,
        message: "form_id is required",
      });
    }

    if (
      !idempotency_key ||
      typeof idempotency_key !== "string" ||
      !idempotency_key.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "idempotency_key is required",
      });
    }

    // Validate email
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        message: "data must be a JSON object",
      });
    }

    const result = await createSubmission({
      form_id: form_id.trim(),
      idempotency_key: idempotency_key.trim(),
      email,
      data,
    });

    return res.status(result.isDuplicate ? 200 : 201).json({
      success: true,
      message: result.isDuplicate
        ? "Submission already exists"
        : "Submission created successfully",

      duplicate: result.isDuplicate,

      submission: result.submission,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchSubmissions = async (req, res, next) => {
  try {
    const { form_id } = req.params;

    const page = Number(req.query.page) || 1;

    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        success: false,
        message: "Page must be a positive integer",
      });
    }

    const result = await getSubmissions(form_id, page);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
