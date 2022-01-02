import "reflect-metadata";
import express from "express";
import "express-async-errors";
import { router } from "./routes";
import { ensureError } from "./middlewares/ensureError";
import "./database";

const app = express();
app.use(express.json());
app.use(router);
app.use(ensureError);
app.listen(3000, () => console.log("Server is running NLW"));
