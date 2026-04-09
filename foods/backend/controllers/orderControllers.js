import Order from '../models/orderModel.js';
import shop from '../models/shopModel.js';
import User from '../models/userModel.js';
import Delivery from '../models/deliveryModel.js';
import {sendDeliveryOtpMail} from '../utils/mail.js'
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

let instance = new Razorpay({
    key_id:process.env.RAZORPAY_API_KEY,
    key_secret:process.env.RAZORPAY_API_SECRET
})

export const placeOrder = async (req, res) => {
    try {
        const {cartItems, paymentMethod, deliveryAddress, totalAmount} = req.body;
        if(!cartItems.length===0 || !cartItems){
            return res.status(400).json({message:"Cart is empty"})
        }
        
        
        if(!deliveryAddress.text || !deliveryAddress.latitude || !deliveryAddress.longitude){
            return res.status(400).json({message:"Delivery adderss is required"})
        }
        const groupItemsByShop = {}

        cartItems.forEach(item => {
            const shopId = item.shop
            if(!groupItemsByShop[shopId]){
                groupItemsByShop[shopId]=[]
            }
            groupItemsByShop[shopId].push(item)
        });
        const shopOrders = await Promise.all(Object.keys(groupItemsByShop).map(async (shopId)=>{
            const Shop = await shop.findById(shopId).populate("owner")
            if(!Shop){
                return res.status(400).json({message:"shop not found"})
            }
            const items = groupItemsByShop[shopId]
            const subTotal = items.reduce((sum, i)=>sum+Number(i.price)*Number(i.quantity),0)
            return {
                shop:Shop._id,
                owner:Shop.owner._id,
                subTotal,
                shopOrderItems: items.map((i)=>({
                    item: i.id,
                    price: i.price,
                    quantity: i.quantity,
                    name: i.name
                }))
            }
    })) 

    if(paymentMethod==="online"){
        const razorOrder= await instance.orders.create({
            amount: Math.round(totalAmount*100),
            currency:"INR",
            receipt: `receipt_${Date.now()}`,
            
        })
         const newOrder = await Order.create({
        user:req.userId,
        paymentMethod,
        deliveryAddress,
        totalAmount,
        shopOrders,
        razorpayOrderId: razorOrder.id,
        payment: false
    })
        return res.status(200).json({
            razorOrder,
            orderId: newOrder._id,
            
        })
    }

    const newOrder = await Order.create({
        user:req.userId,
        paymentMethod,
        deliveryAddress,
        totalAmount,
        shopOrders
    })
await newOrder.populate("shopOrders.shopOrderItems.item", "name image price")
await newOrder.populate("shopOrders.shop", "name")
await newOrder.populate("shopOrders.owner", "name socketId")
await newOrder.populate("user", "name email mobileNumber")

    const io = req.app.get('io')
    if(io){
        newOrder.shopOrders.forEach(shopOrder =>{
            const ownerSocketId = shopOrder.owner.socketId
            if(ownerSocketId){
                io.to(ownerSocketId).emit('newOrder',{
                _id: newOrder._id,
                paymentMethod: newOrder.paymentMethod,
                user: newOrder.user,
                shopOrders: shopOrder,
                createdAt: newOrder.createdAt,
                deliveryAddress: newOrder.deliveryAddress,
                payment: newOrder.payment
            } )
            }
        })
    }

    return res.status(201).json(newOrder)
    } catch (error) {
        return res.status(500).json({message:`place order failed ${error}`})
    }
}

export const verifyPayment = async (req, res) =>{
    try {
        const {razorpay_payment_id, orderId} = req.body
        const payment = await instance.payments.fetch(razorpay_payment_id)
        if(!payment || payment.status!="captured"){
            return res.status(400).json({message:"Payment not captured"})
        }
        const order= await Order.findById(orderId)
        if(!order){
            return res.status(400).json({message:"Order not found"})
        }
        order.payment=true
        order.razorpayPaymentId=razorpay_payment_id
        await order.save()

       
        await order.populate("shopOrders.shopOrderItems.item", "name image price")
await order.populate("shopOrders.shop", "name")
await order.populate("shopOrders.owner", "name socketId")
await order.populate("user", "name email mobileNumber")

    const io = req.app.get('io')
    if(io){
        order.shopOrders.forEach(shopOrder =>{
            const ownerSocketId = shopOrder.owner.socketId
            if(ownerSocketId){
                io.to(ownerSocketId).emit('newOrder',{
                _id: order._id,
                paymentMethod: order.paymentMethod,
                user: order.user,
                shopOrders: shopOrder,
                createdAt: order.createdAt,
                deliveryAddress: order.deliveryAddress,
                payment: order.payment
            } )
            }
        })
    }

        return res.status(200).json(order)
    }catch(error){
        return res.status(500).json({message:`verify payment failed ${error}`})
    }
}

//get
export const getMyOrders = async (req, res) =>{
    try {
        const user=await User.findById(req.userId)
        if(user.role=="user"){
        const orders = await Order.find({user:req.userId})
        .sort({createdAt:-1})
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price")


        return res.status(200).json(orders)
        }else if(user.role=="owner"){
            const orders = await Order.find({"shopOrders.owner":req.userId})
            .sort({createdAt:-1})
            .populate("shopOrders.shop", "name")
            .populate("user")
            .populate("shopOrders.shopOrderItems.item", "name image price")
            .populate("shopOrders.assignedDeliveryBoy.item", "fullName mobileNumber")

            const filteredOrders = orders.map((order=>({
                _id: order._id,
                paymentMethod: order.paymentMethod,
                user: order.user,
                shopOrders: order.shopOrders.filter(o=>o.owner._id==req.userId),
                createdAt: order.createdAt,
                deliveryAddress: order.deliveryAddress,
                payment: order.payment
            })))

        return res.status(200).json(filteredOrders)   
        }
    } catch (error) {
        return res.status(500).json({message:`Failed to get user orders ${error}`})
    }
} 

// status
export const updateOrderStatus = async (req, res) =>{
    try {
        const {orderId, shopId} = req.params
        const {status} = req.body
        const order = await Order.findById(orderId)

        const shopOrder = await order.shopOrders.find(o=>o.shop==shopId)
        if(!shopOrder){
            return res.status(400).json({message:"shop order not found"})
        }
        shopOrder.status=status
        let deliveryBoyPayload = []

        if(status=="out of delivery" && !shopOrder.assignment){
            const {longitude, latitude} = order.deliveryAddress
            const nearByDeliveryBoy = await User.find({
                role: "deliveryBoy",
                location:{
                    $near:{
                        $geometry:{
                            type: "Point", 
                            coordinates:[Number(longitude), Number(latitude)]
                        },
                        $maxDistance: 100000
                    }
                }
            })
            const nearByIds= nearByDeliveryBoy.map(b=>b._id)
            const busyIds = await Delivery.find({
                assignTo: {$in: nearByIds},
                status: {$nin:["brodcasted", "completed"]}
            }).distinct("assignTo")

            const busyIdSet = new Set(busyIds.map(id=>String(id)))

            const availableBoys = nearByDeliveryBoy.filter(b=>!busyIdSet.has(String(b._id)))
            const candidates = availableBoys.map(b=>b._id)
            if(candidates.length==0){
                await order.save()
                return res.json({
                    message:"order status updated but there is no delivery boys"
                })
            }
            const deliveryAssignment = await Delivery.create({
                order: order._id,
                shop: shopOrder.shop,
                shopOrderId: shopOrder._id,
                brodcastedTo: candidates,
                status: "brodcasted"
            })
            shopOrder.assignedDeliveryBoy= deliveryAssignment.assignTo
            shopOrder.assignment=deliveryAssignment._id
            deliveryBoyPayload = availableBoys.map(b=>({
                id: b._id,
                fullName: b.fullName,
                longitude: b.location.coordinates?.[0],
                latitude: b.location.coordinates?.[1],
                mobileNumber: b.mobileNumber
            }))
            await deliveryAssignment.populate("order")
            await deliveryAssignment.populate("shop")
            const io = req.app.get('io')
            if(io){
                availableBoys.forEach(boy=>{
                    const boySocketId = boy.socketId
                    if(boySocketId){
                        io.to(boySocketId).emit('newAssignment', {
                            sentTo:boy._id, 
                            assignmentId: deliveryAssignment._id,
                            orderId:deliveryAssignment.order._id,
                            shopName:deliveryAssignment.shop.name,
                            deliveryAddress: deliveryAssignment.order.deliveryAddress,
                            items:deliveryAssignment.order.shopOrders.find(so=>so._id.equals(deliveryAssignment.shopOrderId))?.shopOrderItems || [],
                            subTotal:deliveryAssignment.order.shopOrders.find(so=>so._id.equals(deliveryAssignment.shopOrderId))?.subTotal,
                        })
                    }
                })
            }

        }


        await shopOrder.save()
        await order.save()

        const updatedShopOrder = order.shopOrders.find(o=>o.shop==shopId)
        await order.populate("shopOrders.shop", "name")
        await order.populate("shopOrders.assignedDeliveryBoy", "fullName mobileNumber email")
        await order.populate("user", "socketId")
        
        const io = req.app.get('io')
        if(io){
            const userSocketId = order.user.socketId
            if(userSocketId){
                io.to(userSocketId).emit('update-status', {
                    orderId:order._id,
                    shopId:updatedShopOrder.shop._id,
                    status:updatedShopOrder.status,
                    userId:order.user._id
                })
            }
        }

        return res.status(200).json({
            shopOrder: updatedShopOrder,
            assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
            availableBoys: deliveryBoyPayload,
            assignment:updatedShopOrder?.assignment._id
        })
    } catch (error) {
        return res.status(500).json({message:`order status error ${error}`})
    }
}

export const getDeliveryBoyAssignment = async (req, res) => {
    try {
        const delivryBoyId = req.userId
        const assignments = await Delivery.find({brodcastedTo: delivryBoyId, status:"brodcasted"})
        .populate("order")
        .populate("shop")
        
        const formated= assignments.map(a=>({
            assignmentId: a._id,
            orderId:a.order._id,
            shopName:a.shop.name,
            deliveryAddress: a.order.deliveryAddress,
            items:a.order.shopOrders.find(so=>so._id.equals(a.shopOrderId))?.shopOrderItems || [],
            subTotal:a.order.shopOrders.find(so=>so._id.equals(a.shopOrderId))?.subTotal,
        }))
        return res.status(200).json(formated)
    } catch (error) {
        return res.status(500).json({message:`error fetching assignments ${error}`})
    }
}


export const acceptOrder = async(req, res) =>{
    try {
        const {assignmentId} = req.params
        const assignment= await Delivery.findById(assignmentId)
        if(!assignment){
            return res.status(200).json({message:"assignment not found"})
        }
        if(assignment.status!=="brodcasted"){
            return res.status(200).json({message:"assignment is expired"})
        }
        const alreadyAssigned = await Delivery.findOne({
            assignedTo: req.userId,
            status:{$nin:["brodcasted", "completed"]}
        })
        if(alreadyAssigned){
            return res.status(400).json({message:"You are assigned to another order"})
        }
        assignment.assignedTo=req.userId
        assignment.status='assigned'
        assignment.acceptedAt= new Date()
        await assignment.save()

        const order=await Order.findById(assignment.order)
        if(!order){
            return res.status(200).json({message:"order not found"})
        }
        const shopOrder= order.shopOrders.id(assignment.shopOrderId)
        shopOrder.assignedDeliveryBoy=req.userId
        await order.save()
        
        return res.status(200).json({
            message:"order accepted"
        })
    } catch (error) {
        return res.status(500).json({message:`accept order error ${error}`})
    
    }
}

export const getCurrentOrder = async (req, res) =>{
    try {
        const assignment = await Delivery.findOne({
    assignedTo: req.userId,
    status: "assigned"
}).populate("shop", "name")
  .populate("assignedTo", "fullName email mobileNumber location")
  .populate({
    path:"order",
    populate:[{path:"user", select:"fullName email mobileNumber location"}]
  })

if(!assignment){
    return res.status(200).json(null)
}
        
        if(!assignment.order){
            return res.status(400).json({message:"order not found"})
        }
        const shopOrder=assignment.order.shopOrders.find(so=>toString(so._id)==toString(assignment.shopOrderId))
        if(!shopOrder){
            return res.status(400).json({message:"Shop order not found"})
        }
        let deliveryBoyLocation={lat:null, lon:null}
        if(assignment.assignedTo.location.coordinates.length==2){
            deliveryBoyLocation.lat=assignment.assignedTo.location.coordinates[1]
            deliveryBoyLocation.lon=assignment.assignedTo.location.coordinates[0]
        }
        let customerLocation={lat:null,lon:null}
        if(assignment.order.deliveryAddress){
            customerLocation.lat=assignment.order.deliveryAddress.latitude
            customerLocation.lon=assignment.order.deliveryAddress.longitude
        }
       return res.status(200).json({
        _id:assignment.order._id,
        user:assignment.order.user,
        shopOrder,
        deliveryAddress:assignment.order.deliveryAddress,
        deliveryBoyLocation,
        customerLocation
       })
        
    } catch (error) {
        return res.status(500).json({message:`current order error ${error}`})
    }
}

export const getOrderById= async(req, res) =>{
    try {
        const {orderId} = req.params;
        const order = await Order.findById(orderId)
        .populate("user")
        .populate({
            path:"shopOrders.shop",
            model:"Shop"
        })
        .populate({
            path:"shopOrders.assignedDeliveryBoy",
            model:"User"
        })
        .populate({
            path:"shopOrders.shopOrderItems.item",
            model:"Item"
        })
        .lean()
        if(!order){
            return res.status(200).json({message:"order not found"})
        }
        return res.status(200).json(order)
    } catch (error) {
        return res.status(500).json({message:`get by id order error ${error}`})
    }
}

export const sentDeliveryOtp = async(req, res)=>{
    try {
        const {orderId, shopOrderId} = req.body
        const order = await Order.findById(orderId).populate("user")
        const shopOrder = order.shopOrders.id(shopOrderId)
        if(!order || !shopOrder){
            return res.status(400).json({message:"enter valid order/shop Order"})
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        shopOrder.deliveryOtp=otp
        shopOrder.otpExpires=Date.now() + 5*60*1000
        await order.save()
        await sendDeliveryOtpMail(order.user, otp)
        return res.status(200).json({message: `Otp sent successfully to ${order?.user?.fullName}`})

    } catch (error) {
        return res.status(500).json({message : `delivery otp error ${error}`})
    }
}

export const verifyDeliveryOtp = async (req, res) =>{
    try {
        const {orderId, shopOrderId, otp} = req.body;
        const order = await Order.findById(orderId).populate("user")
        const shopOrder = order.shopOrders.id(shopOrderId)
        if(!order || !shopOrder){
            return res.status(400).json({message:"enter valid order/shop Order"})
        }
        if(shopOrder.deliveryOtp!==otp || !shopOrder.otpExpires || shopOrder.otpExpires<Date.now()){
            return res.status(400).json({message:"Invalid otp"})
        }
        shopOrder.status="delivered"
        shopOrder.deliveredAt=Date.now()
        await order.save()
        

        await Delivery.deleteOne({
            shopOrderId:shopOrder._id,
            order: order._id,
            assignedTo:shopOrder.assignedDeliveryBoy
        })
        return res.status(200).json({message:"Order delivered successfully"})
    } catch (error) {
        return res.status(500).json({message : `verify delivery otp error ${error}`})
    }
}

export const getTodayDeliveries = async (req, res) =>{
    try {
        const deliveryBoyId = req.userId
        const startsOfDay = new Date()
        startsOfDay.setHours(0, 0, 0, 0)

        const orders= await Order.find({
            "shopOrders.assignedDeliveryBoy": deliveryBoyId,
            "shopOrders.status":"delivered",
            "shopOrders.deliveredAt": {$gte: startsOfDay}
        }).lean()

        let todaysDeliveries = []

        orders.forEach(order=>{
            order.shopOrders.forEach(shopOrder=>{
                if(shopOrder.assignedDeliveryBoy==deliveryBoyId && 
                    shopOrder.status=="delivered" &&
                    shopOrder.deliveredAt && shopOrder.deliveredAt==startsOfDay
                ){
                    todaysDeliveries.push({shopOrder})
                }
            })
        })
        let stats = {}

        todaysDeliveries.forEach(shopOrder=>{
            const hour = new Date(shopOrder.deliveredAt).getHours()
            stats[hour] = (stats[hour] || 0) + 1
        })
        let formatedStats = Object.keys(stats).map(hour=>({
            hour:parseInt(hour),
            count:stats[hour]
        }))
        formatedStats.sort((a,b)=>a.hour-b.hour)
        return res.status(200).json(formatedStats)
    } catch (error) {
        return res.status(500).json({message: `today deliveries error ${error}`})
    }
}