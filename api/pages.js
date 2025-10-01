// api/pages.js
import { Router } from "express";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import { getPageWithOptions, updatePage, deletePage } from "#db/queries/pages";

const router = Router();

// get page with its options
router.get("/:id/full", requireUser, async (req, res) => {
  try {
    const page = await getPageWithOptions(req.params.id);
    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json(page);
  } catch (err) {
    console.error("Error fetching page:", err);
    res.status(500).json({ error: "Failed to fetch page" });
  }
});

// update page text
router.put(
  "/:id",
  requireUser,
  requireBody(["text"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { text } = req.body;

      const page = await updatePage(id, text);
      if (!page) return res.status(404).json({ error: "Page not found" });

      res.json(page);
    } catch (err) {
      console.error("Error updating page:", err);
      res.status(500).json({ error: "Failed to update page" });
    }
  }
);

// delete page
router.delete("/:id", requireUser, async (req, res) => {
  try {
    const page = await deletePage(req.params.id);
    if (!page) return res.status(404).json({ error: "Page not found" });

    res.json({ message: "Page deleted", page });
  } catch (err) {
    console.error("Error deleting page:", err);
    res.status(500).json({ error: "Failed to delete page" });
  }
});

export default router;
