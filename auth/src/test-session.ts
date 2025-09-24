import { Request } from "express";

function clear(req: Request) {
  req.session = null;      // should compile ✅
  req.session = { jwt: "" }; // should compile ✅
}
