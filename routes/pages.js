import { Router } from "express";
import {
  createPage,
  updatePage,
  deletePage,
  getPagesByStory,
} from "#db/queries/pages";
import requireUser from "#middleware/requireUser";

const router = Router();

// get all pages for a story
router.get("/:storyId/pages", requireUser, async (req, res, next) => {
  try {
    const pages = await getPagesByStory(req.params.storyId);
    res.json(pages);
  } catch (err) {
    next(err);
  }
});

// create a new page
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { storyId, page_number, text } = req.body;
    const page = await createPage(storyId, page_number, text);
    res.status(201).json(page);
  } catch (err) {
    next(err);
  }
});

// update a page
router.put("/:id", requireUser, async (req, res, next) => {
  try {
    const { text } = req.body;
    const page = await updatePage(req.params.id, text);
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
