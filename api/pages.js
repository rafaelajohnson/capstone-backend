
import { Router } from "express";
import {
  getPageById,
  createPage,
  updatePage,
  deletePage,
} from "#db/queries/pages";
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

// create a new page
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { storyId, pageNumber, text } = req.body;
    const page = await createPage(storyId, pageNumber, text);
    res.status(201).json(page);
  } catch (err) {
    next(err);
  }
});

// update a page
router.put("/:id", requireUser, async (req, res, next) => {
  try {
    const { pageNumber, text } = req.body;
    const page = await updatePage(req.params.id, pageNumber, text);
    res.json(page);
  } catch (err) {
    next(err);
  }
});

// delete a page
router.delete("/:id", requireUser, async (req, res, next) => {
  try {
    await deletePage(req.params.id);
    res.json({ message: "Page deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
