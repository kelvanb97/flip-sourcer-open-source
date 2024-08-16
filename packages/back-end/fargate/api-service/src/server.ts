import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import sqlStart from "./postgresSql";

//app routes
import { authRouter } from "./routers/auth.r";
import { userRouter } from "./routers/user.r";
import { stripeRouter } from "./routers/stripe.r";

import cluster from "cluster";
import os from "os";
import { port, stage } from "../../../shared/envVars";
import { productRouter } from "./routers/product.r";
import { unAuthRouter } from "./routers/unAuth.r";
const numCPUs = os.cpus().length;

const app = express();

let initPromise: Promise<void>;
async function init() {
  try {
    if (!initPromise) {
      initPromise = (async () => {
        await sqlStart();
        console.log("psql started");
      })();
    }
  } catch (e) {
    console.error(e);
    throw new Error("Failed to initialize psql");
  }
}
init();

app.use(cors());
app.use(bodyParser.json({ limit: "200kb" }));

//No Auth
app.use("/no-auth", unAuthRouter);

//Auth
app.use("/auth", authRouter);

//User
app.use("/user", userRouter);

//Stripe
app.use("/stripe", stripeRouter);

//Product
app.use("/product", productRouter);

// uses multiple threads to process different requests at the same time
if (stage === "prod") {
  if (cluster.isPrimary) {
    console.log(`Primary process ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    // This event is firs when worker died
    cluster.on("exit", (worker) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  }
  // For Worker
  else {
    app.listen(port, () => {
      return console.log(`Server is running on port ${port}`);
    });
  }
} else {
  app.listen(port || 4200, () => {
    return console.log(`Server is running on port ${port}`);
  });
}

app.use(
  (
    err: ErrorRequestHandler,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error(err);
    res.status(500).end();
  }
);
