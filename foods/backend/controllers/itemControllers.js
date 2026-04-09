import Item from "../models/itemModel.js";
import shop from "../models/shopModel.js";
import uploadCloudinary from "../utils/cloudinary.js";

export const addItem = async (req, res) => {
    try {
        const { name, category, price, foodType} = req.body;
        let image;
        if(req.file){
            image = await uploadCloudinary(req.file.path);
            image = image.url;
        }
        const Shop = await shop.findOne({ owner : req.userId})
        if(!Shop){
            return res.status(404).json({ message: "Shop not found"})
        }
        const newItem = await Item.create({
            name, category, foodType, price, image, shop: Shop._id
        })
        Shop.items.push(newItem._id);
        await Shop.save();
        await Shop.populate([
  { path: "owner" },
  {
    path: "items",
    options: { sort: { updatedAt: -1 } },
  },
]);

        return res.status(201).json(Shop);
        
    }catch(error){
        return res.status(500).json({message: `Add item error ${error}`})
    }
}

// edit item
export const updateItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { name, category, price, foodType} = req.body;
        let image;
        if(req.file){
            image = await uploadCloudinary(req.file.path);
            image = image.url;
        }
        const item = await Item.findByIdAndUpdate(itemId, {
            name, category, foodType, price, image
        }, { new: true 
        }) 
        if(!item){
            return res.status(404).json({ message: "Item not found"})
        }
        const Shop = await shop.findOne({ owner : req.userId}).populate({
            path:"items",
            options: { sort: { updatedAt: -1}}
        })
        return res.status(200).json(Shop);
    }catch (error){
        return res.status(500).json({message: `Update item error ${error}`})
    }
}

//get all items of shop
export const getItemById = async (req, res) => {
    try {
        const { itemId} = req.params;
        const item = await Item.findById(itemId);
        if(!item){
            return res.status(404).json({ message: "Item not found"})
        }
        return res.status(200).json(item);
    } catch (error) {
        return res.status(500).json({message: `Get item by id error ${error}`})
    }
}

//delete item
export const deleteitem = async (req, res) => {
    try {
        const { itemId} = req.params;
        const item = await Item.findByIdAndDelete(itemId);
        if(!item){
            return res.status(404).json({ message : "item not found "})
        }const Shop = await shop.findOne({ owner : req.userId})
        Shop.items = Shop.items.filter(i=> i.toString() !==itemId)
        await Shop.save();
        await Shop.populate({
            path:"items",
            options: { sort: { updatedAt: -1}}
        })
        return res.status(200).json(Shop);
    } catch (error) {
        return res.status(500).json({message: `Delete item error ${error}`})
    }
}
// get item by city
export const getItemByCity = async(req, res) => {
    try{
        const {city} = req.params;
        if(!city){
            return res.status(400).json({message: "city is required"})
        }
        const shops = await shop.find({
              city: {$regex: new RegExp(`^${city}$`, "i")}
            }).populate("items")
            if(!shops){
              return res.status(400).json({message: "shops not found"})
            }
            const shopIds=shops.map((shop)=>shop._id)
            const items = await Item.find({shop:{$in:shopIds}})
            return res.status(200).json(items)
    }catch(error){
        return res.status(500).json({message: `shop item error ${error}`})
    }
}

export const getItemByShop = async (req, res) =>{
    try {
        const { shopId } = req.params;
        const Shop = await shop.findById(shopId).populate("items")
        if(!Shop){
            return res.status(404).json({message: "Shop not found"})
        }
        return res.status(200).json({
            shop: Shop,
            items: Shop.items
        })
    } catch (error) {
        return res.status(500).json({message: `get shop item error ${error}`})
    }
}

export const searchItems = async (req, res) =>{
    try {
        const {query, city} = req.query;
        if(!query || !city){
            return null 
        }
        const shops = await shop.find({
            city: {$regex: new RegExp(`^${city}$`, "i")}
            }).populate("items")
        if(!shops){
              return res.status(400).json({message: "shops not found"})
        }
        const shopIds=shops.map((shop)=>shop._id)
        const items = await Item.find({
            shop:{$in:shopIds},
            
            $or:[
                {name: {$regex:query, $options: "i"}},
                {category: {$regex:query, $options: "i"}},
            ]
        }).populate("shop", "name image")
        return res.status(200).json(items)
    } catch (error) {
        return res.status(500).json({message: `search item error ${error}`})
    }
}



export const rating = async (req, res) =>{
    try {
        const {itemId, rating} = req.body

        if(!itemId || !rating){
            return res.status(400).json({message: "item id and rating are required"})
        }
        if(rating < 1 || rating > 5){
            return res.status(400).json({message: "rating must be between 1 and 5"})
        }
        const item = await Item.findById(itemId)
        if(!item){
            return res.status(404).json({message: "item not found"})
        }
        const newCount = item.rating.count +1;
        const newAverage = (item.rating.average *item.rating.count + rating) / newCount

        item.rating.count = newCount;
        item.rating.average = newAverage;
        await item.save();
        return res.status(200).json({rating:item.rating})
    } catch (error) {
        return res.status(500).json({message: `rating item error ${error}`})
    }
}
