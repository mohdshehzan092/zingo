import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { addItem, updateItem, getItemById, deleteitem, getItemByCity, getItemByShop, searchItems, rating } from '../controllers/itemControllers.js';
import { upload } from '../middlewares/multer.js';

const itemRouter = express.Router();

itemRouter.post('/add-item', isAuth, upload.single("image"), addItem);
itemRouter.put('/edit-item/:itemId', isAuth, upload.single("image"), updateItem);
itemRouter.get('/get-item/:itemId', isAuth, getItemById)
itemRouter.delete('/delete/:itemId', isAuth, deleteitem)
itemRouter.get('/get-by-city/:city', isAuth, getItemByCity)
itemRouter.get('/get-by-shop/:shopId', isAuth, getItemByShop)
itemRouter.get('/search-items', isAuth, searchItems)
itemRouter.post('/rating', isAuth, rating)


export default itemRouter;