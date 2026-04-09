import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { placeOrder,  getMyOrders, updateOrderStatus, getDeliveryBoyAssignment, acceptOrder, getCurrentOrder, getOrderById, sentDeliveryOtp, verifyDeliveryOtp, verifyPayment, getTodayDeliveries } from '../controllers/orderControllers.js';
const orderRouter = express.Router();

orderRouter.post('/place-order', isAuth, placeOrder)
orderRouter.post('/verify-payment', isAuth, verifyPayment)
orderRouter.get('/my-orders', isAuth, getMyOrders)
orderRouter.post('/send-delivery-otp', isAuth, sentDeliveryOtp)
orderRouter.post('/verify-delivery-otp', isAuth, verifyDeliveryOtp)
orderRouter.post('/update-status/:orderId/:shopId', isAuth, updateOrderStatus)
orderRouter.get('/get-assignments', isAuth, getDeliveryBoyAssignment)
orderRouter.get('/get-current-order', isAuth, getCurrentOrder)
orderRouter.get('/accept-order/:assignmentId', isAuth, acceptOrder)
orderRouter.get('/get-order-by-id/:orderId', isAuth, getOrderById)
orderRouter.get('/get-today-deliveries', isAuth, getTodayDeliveries)
export default orderRouter;