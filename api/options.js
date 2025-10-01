
import { Router } from "express";
import {
  createOption,
  getOptionsByPage,
  updateOption,
  deleteOption,
} from "#db/queries/options";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

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

// add a new option (limit 3 per page)
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { pageId, optionText } = req.body;
    if (!pageId || !optionText) {
      return res.status(400).json({ error: "pageId and optionText required" });
    }

    const options = await getOptionsByPage(pageId);
    if (options.length >= 3) {
      return res.status(400).json({ error: "Max 3 options per page" });
    }

    const option = await createOption(pageId, optionText);
    res.status(201).json(option);
  } catch (err) {
    next(err);
  }
});

// update option text
router.put("/:id", requireUser, async (req, res, next) => {
  try {
    const { optionText } = req.body;
    const option = await updateOption(req.params.id, optionText);
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
