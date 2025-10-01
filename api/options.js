// api/options.js
import { Router } from "express";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import {
  getOptionsByPage,
  createOption,
  updateOption,
  deleteOption,
} from "#db/queries/options";

const router = Router();

// get all options for a page
router.get("/:pageId", requireUser, async (req, res) => {
  try {
    const options = await getOptionsByPage(req.params.pageId);
    res.json(options);
  } catch (err) {
    console.error("Error fetching options:", err);
    res.status(500).json({ error: "Failed to fetch options" });
  }
});

// create new option (limit 3 per page)
router.post(
  "/",
  requireUser,
  requireBody(["pageId", "optionText"]),
  async (req, res) => {
    try {
      const { pageId, optionText } = req.body;

      const existing = await getOptionsByPage(pageId);
      if (existing.length >= 3) {
        return res.status(400).json({ error: "Max 3 options per page" });
      }

      const option = await createOption(pageId, optionText);
      res.status(201).json(option);
    } catch (err) {
      console.error("Error creating option:", err);
      res.status(500).json({ error: "Failed to create option" });
    }
  }
);

// update option text
router.put(
  "/:id",
  requireUser,
  requireBody(["optionText"]),
  async (req, res) => {
    try {
      const option = await updateOption(req.params.id, req.body.optionText);
      if (!option) return res.status(404).json({ error: "Option not found" });

      res.json(option);
    } catch (err) {
      console.error("Error updating option:", err);
      res.status(500).json({ error: "Failed to update option" });
    }
  }
);

// delete option
router.delete("/:id", requireUser, async (req, res) => {
  try {
    const option = await deleteOption(req.params.id);
    if (!option) return res.status(404).json({ error: "Option not found" });

    res.json({ message: "Option deleted", option });
  } catch (err) {
    console.error("Error deleting option:", err);
    res.status(500).json({ error: "Failed to delete option" });
  }
});

export default router;
