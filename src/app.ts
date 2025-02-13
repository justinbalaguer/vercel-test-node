import "dotenv/config";
import express from "express";
// import NoteModel from "./models/notes";
import { Request, Response, NextFunction } from "express";
import notesRoutes from "./routes/notes";
import userRoutes from "./routes/users";
import testsRoutes from "./routes/tests";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import validateEnv from "./util/validateEnv";
import MongoStore from "connect-mongo";
import projectsRoutes from "./routes/projects";
import cors from "cors";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(
    cors()
  );

app.use(session({
    secret: validateEnv.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: validateEnv.MONGO_CONNECTION_STRING
    })
}));

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.use("/api/users", userRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/tests", testsRoutes);

app.use((req, res, next) => {
   next(createHttpError(404, "END POINT NOT FOUND"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    let errorMessage = "Something went wrong";
    let statusCode = 500;
    if(isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    // if (error instanceof Error) errorMessage = error.message;
    res.status(statusCode).json({ error: errorMessage });
});

export default app;
