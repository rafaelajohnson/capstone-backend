// routes/options.js
import { Router } from "express";
import { getOptionsByPage, createOption, updateOption, deleteOption } from "#db/queries/options";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

const router = Router();

// get all options for a given page
router.get("/page/:pageId", requireUser, async (req, res, next) => {
  try {
    const options = await getOptionsByPage(req.params.pageId);
    res.json(options);
  } catch (err) {
    next(err);
  }
});

// create a new option for a page
router.post(
  "/page/:pageId",
  requireUser,
  requireBody(["optionText"]),
  async (req, res, next) => {
    try {
      const { optionText } = req.body;
      const option = await createOption(req.params.pageId, optionText);
      res.status(201).json(option);
    } catch (err) {
      next(err);
    }
  }
);

// update an option
router.put("/:id", requireUser, requireBody(["optionText"]), async (req, res, next) => {
  try {
    const { optionText } = req.body;
    const option = await updateOption(req.params.id, optionText);
    res.json(option);
  } catch (err) {
    next(err);
  }
});

// delete an option
router.delete("/:id", requireUser, async (req, res, next) => {
  try {
    const option = await deleteOption(req.params.id);
    res.json(option);
  } catch (err) {
    next(err);
  }
});

export default router;
