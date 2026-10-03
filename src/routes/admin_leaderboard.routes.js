import { Router } from "express";

import {
    getoverview,
    getsalesanalytics,
    salesovertime,
    topproducts,
    topcustomers,
    topcategories
} from "../controllers/admin_leaderboard.controller.js";

import { verifyjwt } from "../middlewares/auth.middleware.js";
import { verifyadmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.get(
    "/overview",
    verifyjwt,
    verifyadmin,
    getoverview
);

router.get(
    "/sales",
    verifyjwt,
    verifyadmin,
    getsalesanalytics
);

router.get(
    "/sales-over-time",
    verifyjwt,
    verifyadmin,
    salesovertime
);

router.get(
    "/leaderboard/products",
    verifyjwt,
    verifyadmin,
    topproducts
);

router.get(
    "/leaderboard/categories",
    verifyjwt,
    verifyadmin,
    topcategories
);

router.get(
    "/leaderboard/customers",
    verifyjwt,
    verifyadmin,
    topcustomers
);

export default router;