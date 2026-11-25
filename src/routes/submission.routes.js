import express from "express";

import {
  submitForm,
  fetchSubmissions,
} from "../controllers/submission.controller.js";

const router = express.Router();

// POST /submissions
router.post("/submissions", submitForm);

// GET /forms/:form_id/submissions
router.get("/forms/:form_id/submissions", fetchSubmissions);

export default router;
