import express from "express";
import usersRoutes from "./api/users.js";
import storiesRoutes from "./api/stories.js";
import pagesRoutes from "./api/pages.js";
import optionsRoutes from "./api/options.js";
import handlePostgresErrors from "./middleware/handlePostgresErrors.js";

const app = express();

// parse JSON bodies
app.use(express.json());

// mount routes
app.use("/auth", usersRoutes);     // signup + login
app.use("/stories", storiesRoutes); // save + get stories
app.use("/pages", pagesRoutes);     // get page + options
app.use("/options", optionsRoutes); // add/fetch options

// basic health check
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use(handlePostgresErrors); // add the error handling middleware

export default app;
