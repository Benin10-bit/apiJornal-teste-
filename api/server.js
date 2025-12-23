import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { newsRouter } from "./src/routes/news.js";
import { userRouter } from "./src/routes/users.js";

const server = express();

dotenv.config();

server.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "DELETE", "POST", "OPTIONS", "PUT" ]
  })
);

server.use(express.json());
server.use(newsRouter);
server.use(userRouter);

server.get("/", (req, res) => {
  res.send("sex");
});

server.listen(1992, () => {
  console.log("Servidor ouvindo na porta 1992");
});
