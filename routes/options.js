// routes/options.js
import { Router } from "express";
import {
  getOptionsByPage,
  createOption,
  updateOption,
  deleteOption,
} from "../db/queries/options.js";
import requireUser from "../middleware/requireUser.js";
import requireBody from "../middleware/requireBody.js";

const router = Router();

/**
 * GET /options/page/:pageId
 * Get all options for a given page (requires login)
 */
router.get("/page/:pageId", requireUser, async (req, res, next) => {
  try {
    const options = await getOptionsByPage(req.params.pageId);
    res.json(options);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /options/page/:pageId
 * Add a new option to a page
 * Body: { option_text: string }
 */
router.post(
  "/page/:pageId",
  requireUser,
  requireBody(["option_text"]),
  async (req, res, next) => {
    try {
      const option = await createOption(
        req.params.pageId,
        req.body.option_text
      );
      res.status(201).json(option);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /options/:id
 * Update option text
 * Body: { option_text: string }
 */
router.put(
  "/:id",
  requireUser,
  requireBody(["option_text"]),
  async (req, res, next) => {
    try {
      const option = await updateOption(req.params.id, req.body.option_text);
      res.json(option);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /options/:id
 * Delete option by id
 */
router.delete("/:id", requireUser, async (req, res, next) => {
  try {
    const deleted = await deleteOption(req.params.id);
    res.json(deleted);
  } catch (err) {
    next(err);
  }
});

export default router;
