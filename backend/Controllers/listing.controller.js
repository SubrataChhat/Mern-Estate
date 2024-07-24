import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    const lisitng = await Listing.create(req.body);
    return res.status(200).json(lisitng);
  } catch (error) {
    next(error);
  }
};
