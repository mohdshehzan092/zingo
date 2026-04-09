import { upload } from "../middlewares/multer.js";
import shop from "../models/shopModel.js";
import uploadCloudinary from "../utils/cloudinary.js";

// create shop
export const createAndEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;

    let image;
    if (req.file) {
      image = await uploadCloudinary(req.file.path);
    }

    let shopDoc = await shop.findOne({ owner: req.userId });

    let result;

    if (!shopDoc) {
      result = await shop.create({
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
      });
    } else {
      result = await shop.findByIdAndUpdate(
        shopDoc._id,
        {
          name,
          city,
          state,
          address,
          ...(image && { image }),
        },
        { new: true }
      );
    }

    await result.populate("owner items");

    res.status(201).json(result);
  } catch (error) {
    console.error("❌ create shop error:", error);
    return res.status(500).json({
      message: "create shop error",
      error: error.message,
    });
  }
};


// get shop
export const getShop = async (req, res) => {
    try {
        const newShop = await shop.findOne({ owner: req.userId}).populate("owner").populate({
            path:"items",
            options: { sort: { updatedAt: -1}}
        });
        if(!newShop){
            return null
        }
        return res.status(200).json(newShop) 
    } catch (error) {
        return res.status(500).json({ message : `get my shop error ${error}`})

    }
}

export const getShopByCity = async(req, res) => {
  try {
    const {city} = req.params
    
    const shops = await shop.find({
      city: {$regex: new RegExp(`^${city}$`, "i")}
    }).populate("items")
    if(!shops){
      return res.status(400).josn({message: "shops not found"})
    }
    return res.status(200).json(shops)
  } catch (error) {
            return res.status(500).json({ message : `get shop by city error ${error}`})
  }
}