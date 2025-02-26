import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../errors";
import Merch from "../models/Merch";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

// Define interface for multer request
// interface MulterRequest extends Request {
//     files: any
// }

const createMerch = async (req: Request, res: Response) => {
    const { name, description, price } = req.body;
    const reqFiles = req.files
    
    if (!name || !description || !price) {
        throw new BadRequestError("Please provide all required fields");
    }

    if (!reqFiles || !Array.isArray(reqFiles)) {
        throw new BadRequestError("Please provide at least one photo");
    }

    const photos = reqFiles.map(file => ({
        data: file.buffer,
        contentType: file.mimetype
    }));

    const merch = await Merch.create({
        name,
        description,
        price,
        photos
    });

    res.status(StatusCodes.CREATED).json({ merch });
};

const getAllMerch = async (req: Request, res: Response) => {
    const merch = await Merch.find({});
    
    const merchWithFormattedPhotos = merch.map(item => {
      const itemObj = item.toObject();
      const formattedPhotos = item.photos.map(photo => ({
        url: `data:${photo.contentType};base64,${photo.data.toString('base64')}`
      }));
      
      return {
        ...itemObj,
        photos: formattedPhotos.length > 0 ? [formattedPhotos] : [] // Keep only first photo as per original logic
      };
    });
  
    res.status(StatusCodes.OK).json({ 
      merch: merchWithFormattedPhotos, 
      count: merchWithFormattedPhotos.length 
    });
  };
  
  const getMerchById = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid merchandise ID");
    }
    
    const merch = await Merch.findById(id);
    
    if (!merch) {
      throw new NotFoundError(`No merchandise found with id ${id}`);
    }
  
    const merchObj = merch.toObject();
    const formattedPhotos = merch.photos.map(photo => ({
      url: `data:${photo.contentType};base64,${photo.data.toString('base64')}`
    }));
  
    res.status(StatusCodes.OK).json({ 
      merch: {
        ...merchObj,
        photos: formattedPhotos
      } 
    });
  };

const updateMerch = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const reqFiles = req.files 


    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Invalid merchandise ID");
    }

    const merch = await Merch.findById(id);
    
    if (!merch) {
        throw new NotFoundError(`No merchandise found with id ${id}`);
    }

    const updates: any = {};
    if (name) updates.name = name;
    if (description) updates.description = description;
    if (price) updates.price = price;

    if (reqFiles && Array.isArray(reqFiles)) {
        updates.photos = reqFiles.map(file => ({
            data: file.buffer,
            contentType: file.mimetype
        }));
    }

    const updatedMerch = await Merch.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json({ merch: updatedMerch });
};

const deleteMerch = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Invalid merchandise ID");
    }

    const merch = await Merch.findByIdAndDelete(id);
    
    if (!merch) {
        throw new NotFoundError(`No merchandise found with id ${id}`);
    }

    res.status(StatusCodes.OK).json({ message: "Merchandise deleted successfully" });
};

export {
    createMerch,
    getAllMerch,
    getMerchById,
    updateMerch,
    deleteMerch
};