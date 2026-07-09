
import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js";


export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      userRef: req.user.id, // ✅ from verified token
    });
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req,res,next) =>{
  const listing = await Listing.findById(req.params.id);

  if(!listing){
    return next(errorHandler(404,'listing not found'));}

  if (req.user.id !== listing.userRef.toString()) {
  return next(errorHandler(401, 'You can only delete your own listings!'));
}

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('listing has been deleted');
  } catch (error) {
    next(error)
  }

};

export const updateListing = async (req,res,next) =>{
  const listing = await Listing.findById(req.params.id);

  if(!listing){
    return next(errorHandler(401, 'listing not found'));
  }

  if(req.user.id !== listing.userRef){
    return next(errorHandler(401, 'you can only update your own listing'))
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error)
  }
};

export  const getListing = async(req,res,next)=>{
  try {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
      return errorHandler(404, 'listing not found ')
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error)
  }
}

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const order = req.query.order === 'asc' ? 1 : -1;
    const sort = req.query.sort || 'createdAt';
    const searchTerm = req.query.searchTerm || '';

    const query = {
      name: { $regex: searchTerm, $options: 'i' },
    };

    // Type
    if (req.query.type && req.query.type !== 'all') {
      query.type = req.query.type;
    }

    // Only include parking if true
    if (req.query.parking === 'true') {
      query.parking = true;
    }

    // Only include furnished if true
    if (req.query.furnished === 'true') {
      query.furnished = true;
    }

    // Only include offer if true
    if (req.query.offer === 'true') {
      query.offer = true;
    }


    const listings = await Listing.find(query)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
