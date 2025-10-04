// routes/options.js
import express from "express";
import requireUser from "../middleware/requireUser.js";
import {
  getOptionsByPage,
  createOption,
  updateOption,
  deleteOption,
} from "../db/queries/options.js";

const router = express.Router();

// GET all options for a specific page
router.get("/:pageId", requireUser, async (req, res, next) => {
  try {
    const { pageId } = req.params;
    const options = await getOptionsByPage(pageId);
    res.json(options);
  } catch (err) {
    next(err);
  }
});

// POST a new option for a page
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { pageId, option_text } = req.body;
    const option = await createOption(pageId, option_text);
    res.status(201).json(option);
  } catch (err) {
    next(err);
  }
});

// PUT (update) an option
router.put("/:optionId", requireUser, async (req, res, next) => {
  try {
    const { optionId } = req.params;
    const { option_text } = req.body;
    const option = await updateOption(optionId, option_text);
    res.json(option);
  } catch (err) {
    next(err);
  }
});

// ✅ DELETE an option
router.delete("/:optionId", requireUser, async (req, res, next) => {
  try {
    const { optionId } = req.params;
    const option = await deleteOption(optionId);
    res.json(option);
  } catch (err) {
    next(err);
  }
});

export default router;
