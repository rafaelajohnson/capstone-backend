// app.js
import express from "express";
import cors from "cors"; // lets our frontend (different port) talk to backend
import usersRoutes from "./api/users.js";
import storiesRoutes from "./api/stories.js";
import pagesRoutes from "./api/pages.js";
import optionsRoutes from "./api/options.js";

const app = express();

// enable CORS so frontend (localhost:5173) can access backend (localhost:3000)
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // allows cookies/headers if we need them later
  })
);

// parse JSON bodies from incoming requests
app.use(express.json());

// mount routes for different parts of the app
app.use("/auth", usersRoutes); // signup + login
app.use("/stories", storiesRoutes); // save + get stories
app.use("/pages", pagesRoutes); // get page + options
app.use("/options", optionsRoutes); // add/fetch options

// quick health check so I know server is alive
app.get("/", (req, res) => {
  res.send("API is running");
});

export default app;
