import express from "express";
import { NewsController } from "../controllers/newsController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { upload } from "../config/multer.js";

export const newsRouter = express.Router();

newsRouter.post(
  "/news",
  authMiddleware,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
  ]),
  NewsController.create
);
newsRouter.get("/show-news", NewsController.list);
newsRouter.put("/update-news/:id", authMiddleware, NewsController.update);
newsRouter.delete("/delete-news/:id, authMiddleware", NewsController.delete);
