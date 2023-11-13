import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import apiRoutes from "./routes/apiRoutes";
import authRoutes from "./routes/authRoutes";
import i18n from "i18n";

const port = process.env.PORT || 3000;
export const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

i18n.configure({
  locales: ["en", "mm"], // List of locales supported
  directory: __dirname + "/locales",
  defaultLocale: "en",
  queryParameter: "lang",
  autoReload: true,
  syncFiles: true,
  cookie: "i18n",
});

app.use(i18n.init);

app.use("/api", apiRoutes);
app.use("/auth", authRoutes);

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.statusCode || 500;
    const { message, data } = err;
    res.status(status).json({ message, data });
  }
);

app.get("/", (req: Request, res: Response) => {
  let lang = (req.query.lang as string) || "mm";
  req.setLocale(lang);
  res.send(req.__("HELLO WORLD"));
});

export const server = app.listen(port, () => {
  console.log(`Listening to requests in port - ${port}`);
});
