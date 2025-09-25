import { Router } from "express";
import { createOption, getOptionsByPage } from "#db/queries/options";
import requireUser from "#middleware/requireUser";

const router = Router();

// get options for a page (might not be used often since /pages/:id/full already gives options)
router.get("/:pageId", requireUser, async (req, res, next) => {
  try {
    const options = await getOptionsByPage(req.params.pageId);
    res.json(options);
  } catch (err) {
    next(err);
  }
});

// add a new option to a page
// limit is 3 options max per page
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { pageId, optionText } = req.body;
    if (!pageId || !optionText) {
      return res.status(400).json({ error: "pageId and optionText required" });
    }

    // check current option count
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

export default router;
