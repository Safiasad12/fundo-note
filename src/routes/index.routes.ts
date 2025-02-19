import userRouter from '../routes/user.routes';
import noteRouter from '../routes/note.routes';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';
import { Router } from "express";

export const handleRouter = (): Router => {
    const router = Router();

    router.use("/user", userRouter);

    router.use("/note", noteRouter);

    router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    return router;
}
