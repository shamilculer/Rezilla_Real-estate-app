import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import uploadImages from "../utils/cloudinarySetup.js";

const getListings = async (req, res) => {
  const query = req.query;
  const {
    itemsPerPage = 8,
    page = 1,
    cityname,
    type,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    amenities
  } = query;

  const limit = parseInt(itemsPerPage, 10);
  const skip = (parseInt(page, 10) - 1) * limit;

  try {
    // Construct search conditions based on query parameters
    const conditions = {
      ...(cityname && { cityname: { $regex: new RegExp(cityname, 'i') } }),
      ...(type && type !== "any" && { type }),
      ...(bedrooms && bedrooms !== "any" && { bedrooms: { $gte: parseInt(bedrooms) } }),
      ...(bathrooms && bathrooms !== "any" && { bathrooms: { $gte: parseInt(bathrooms) } }),
    };

    // Construct price condition only if minPrice or maxPrice is provided
    if (minPrice || maxPrice) {
      conditions.price = {};
      if (minPrice) conditions.price.$gte = parseInt(minPrice, 10);
      if (maxPrice) conditions.price.$lte = parseInt(maxPrice, 10);

      // If both minPrice and maxPrice are not set, delete the price condition
      if (Object.keys(conditions.price).length === 0) {
        delete conditions.price;
      }
    }

    // Handle amenities condition
    if (amenities && amenities.length > 0) {
      conditions.amenities = { $all: amenities.split(',') };
    }

    // Check if the conditions object is empty
    const isQueryEmpty = Object.keys(conditions).length === 0;

    // Fetch listings from the database, sorted by createdAt in descending order
    const listings = await Listing.find(isQueryEmpty ? {} : conditions)
                                  .sort({ createdAt: -1 }) // Sort by newest first
                                  .skip(skip)
                                  .limit(limit);

    // Get total count of listings that match the conditions
    const totalListings = await Listing.countDocuments(isQueryEmpty ? {} : conditions);

    // Calculate if there's a next page
    const hasNextPage = skip + listings.length < totalListings;

    res.status(200).json({
      message: "Listings fetched successfully",
      listings,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(totalListings / limit),
      hasNextPage,
      totalListings
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: "Failed to fetch listings" });
  }
};



const getListing = async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    } else {
      await listing.populate('user');
      res.status(200).json({ message: `Listing found with the id ${id}`, listing });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching listing" });
  }
};



const addListing = async (req, res) => {
  const newListingData = { ...req.body, };
  const newListingImages = req.files

  if (typeof newListingData.amenities === 'string') {
    newListingData.amenities = newListingData.amenities.split(',');
  }

  try {
    const uploadedImages = await uploadImages(newListingImages)
    newListingData.images = uploadedImages;

    if(!uploadedImages && uploadImages.length < 1) {
      return res.status(400).json({ message: "No images provided." });
    }

    const newlisting = await Listing.create(newListingData);

    const user = await User.findById( { _id : newlisting.user })
    user.listingsCount = user.listingCount ? user.listingCount + 1 : 1;
    await user.save();

    const responseData = await newlisting.populate('user');
    res.status(200).json({ message: "Added new Listing successfully", listing: responseData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add listing." });
  }
};

const getMinMaxPrice = async (req, res) => {
  try {
    const prices = await Listing.aggregate([
      {
        $group: {
          _id: null,
          maxPrice: { $max: "$price" },
          minPrice: { $min: "$price" }
        }
      },
      {
        $project: {
          _id: 0,
          maxPrice: 1,
          minPrice: 1
        }
      }
    ]);

      res.status(200).json({ message: "Fetched prices successfully", prices })

  } catch (error) {
    console.error('Error in getMinMaxPrice:', error);
    res.status(500).json({ error: 'Error fetching prices' });
  }
};


const deleteListing = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.user.toString() !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(500).json({ message: "Error deleting listing" });
    }

    res.status(200).json({ message: "Listing deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteListing:", error);
    res.status(500).json({ message: "Error deleting listing" });
  }
};

export { getListings, getListing, addListing, getMinMaxPrice, deleteListing };
