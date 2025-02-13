import express from "express";
import Tests from "../models/test";

const router = express.Router();

router.get<{}, any>("/", async (req, res) => {
  const tests = await Tests.find().exec();
  res.json(tests);
});

export default router;
