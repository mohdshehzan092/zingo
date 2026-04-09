import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { createAndEditShop, getShop, getShopByCity }  from '../controllers/shopController.js';
import { upload } from '../middlewares/multer.js';

const shopRouter = express.Router();

shopRouter.post('/create-edit-shop', isAuth, upload.single("image"), createAndEditShop)
shopRouter.get('/get-my-shop', isAuth, getShop);
shopRouter.get("/get-by-city/:city", isAuth, getShopByCity)
export default shopRouter;