import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/users/signout", (req: Request, res: Response) => {
  req.session = null; // ✅ cookie-session clears the session when set to null
  res.send({});
});

export { router as signoutRouter };
