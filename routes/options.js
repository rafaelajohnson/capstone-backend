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

// Get options for a page
router.get("/:pageId/options", requireUser, async (req, res, next) => {
  try {
    const options = await getOptionsByPage(req.params.pageId);
    res.json(options);
  } catch (err) {
    next(err);
  }
});

// Create option
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { pageId, option_text } = req.body;
    if (!pageId || !option_text) {
      return res.status(400).json({ error: "pageId and option_text required" });
    }
    const option = await createOption(pageId, option_text);
    res.status(201).json(option);
  } catch (err) {
    next(err);
  }
});

// Update option
router.put("/:id", requireUser, async (req, res, next) => {
  try {
    const { option_text } = req.body;
    const updated = await updateOption(req.params.id, option_text);
    if (!updated) return res.status(404).json({ error: "Option not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete option
router.delete("/:id", requireUser, async (req, res, next) => {
  try {
    const deleted = await deleteOption(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Option not found" });
    res.json({ message: "Option deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
