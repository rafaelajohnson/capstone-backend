// routes/pages.js
import { Router } from "express";
import { createPage, updatePage, deletePage, getPageById } from "#db/queries/pages";
import { getOptionsByPage } from "#db/queries/options";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

const router = Router();

// get a page by id, including its options
router.get("/:id", requireUser, async (req, res, next) => {
  try {
    const page = await getPageById(req.params.id);
    if (!page) return res.status(404).json({ error: "Page not found" });

    const options = await getOptionsByPage(page.id);
    res.json({ ...page, options });
  } catch (err) {
    next(err);
  }
});

// create a new page for a story
router.post(
  "/story/:storyId",
  requireUser,
  requireBody(["page_number", "text"]),
  async (req, res, next) => {
    try {
      const { page_number, text } = req.body;
      const page = await createPage(req.params.storyId, page_number, text);
      res.status(201).json(page);
    } catch (err) {
      next(err);
    }
  }
);

// update an existing page
router.put("/:id", requireUser, requireBody(["text"]), async (req, res, next) => {
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
    const page = await deletePage(req.params.id);
    res.json(page);
  } catch (err) {
    next(err);
  }
});

export default router;
