import { Router } from "express";
import {
  getOptionsByPage,
  createOption,
  updateOption,
  deleteOption,
} from "#db/queries/options";
import requireUser from "#middleware/requireUser";

const router = Router();

// get options for a page
router.get("/:pageId", requireUser, async (req, res, next) => {
  try {
    const options = await getOptionsByPage(req.params.pageId);
    res.json(options);
  } catch (err) {
    next(err);
  }
});

// create an option
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { pageId, option_text } = req.body;
    const option = await createOption(pageId, option_text);
    res.status(201).json(option);
  } catch (err) {
    next(err);
  }
});

// update option
router.put("/:id", requireUser, async (req, res, next) => {
  try {
    const { option_text } = req.body;
    const option = await updateOption(req.params.id, option_text);
    res.json(option);
  } catch (err) {
    next(err);
  }
});

// delete option
router.delete("/:id", requireUser, async (req, res, next) => {
  try {
    await deleteOption(req.params.id);
    res.json({ message: "Option deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
