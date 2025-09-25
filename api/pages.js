import { Router } from "express";
import { getPageById } from "#db/queries/pages";
import { getOptionsByPage } from "#db/queries/options";
import requireUser from "#middleware/requireUser";

const router = Router();

// get a page with its options
router.get("/:id/full", requireUser, async (req, res, next) => {
  try {
    const pageId = req.params.id;

    const page = await getPageById(pageId);
    if (!page) return res.status(404).json({ error: "page not found" });

    const options = await getOptionsByPage(pageId);

    res.json({ page, options });
  } catch (err) {
    next(err);
  }
});

export default router;
