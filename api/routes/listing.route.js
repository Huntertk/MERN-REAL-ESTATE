import {Router} from "express";
import { createListing } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = Router()

router.post('/create', verifyToken, createListing)

export default router