// routes/options.js
import { Router } from "express";
import { requireUser } from "../middleware/requireUser.js";
import {
  getOptionsByPage,
  createOption,
  updateOption,
  deleteOption,
} from "#db/queries/options.js";

const router = Router();

// GET /options/:pageId
router.get("/:pageId", requireUser, async (req, res, next) => {
  try {
    const options = await getOptionsByPage(req.params.pageId);
    res.json(options);
  } catch (err) {
    next(err);
  }
});

// POST /options
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { pageId, option_text } = req.body;
    const option = await createOption(pageId, option_text);
    res.json(option);
  } catch (err) {
    next(err);
  }
});

// PUT /options/:id
router.put("/:id", requireUser, async (req, res, next) => {
  try {
    const { option_text } = req.body;
    const updated = await updateOption(req.params.id, option_text);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /options/:id
router.delete("/:id", requireUser, async (req, res, next) => {
  try {
    const deleted = await deleteOption(req.params.id);
    res.json(deleted);
  } catch (err) {
    next(err);
  }
});

export default router;
