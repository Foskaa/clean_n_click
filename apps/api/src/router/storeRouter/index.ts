import { getStore } from "@/controllers/storeController";
import { Router } from "express";

const storeRouter = Router()
storeRouter.get('/', getStore)

export default storeRouter