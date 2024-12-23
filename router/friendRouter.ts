import { Router } from "express";

import { addAsFriend, unFriend } from "../controller/makeFriend";

const router: any = Router();

router.route("/add-friends/:userID/:friendID").patch(addAsFriend);

router.route("/un-friends/:userID/:friendID").patch(unFriend);

export default router;
