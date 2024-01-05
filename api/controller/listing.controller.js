const ListingModel = require('../models/listing.model.js')
const ErrorHandler = require('../utils/ErrorHandler.js')

const CreateListing = async (req, res, next) => {
    try {
        const { name } = req.body
        const existingName = await ListingModel.findOne({ name })
        if (existingName) return next(ErrorHandler(401, 'name already exist'))

        const createNewListing = await ListingModel.create(req.body)
        res.status(201).json(createNewListing)
    } catch (error) {
        next(error)
    }

}

const ListData = async (req, res, next) => {
    // console.log(req.params.id)
    try {
        const listLimit = parseInt(req.query.limit) || 9
        const startIndex = req.query.startIndex || 0
        const gettingId = await ListingModel.find({ userRef: req.params.id }).sort({ 'createdAt': 'desc' }).limit(listLimit).skip(startIndex)
        if (!gettingId) return next(ErrorHandler(404, 'Listing not found'))
        res.status(200).json(gettingId)
    } catch (error) {
        next(error)
    }
}

const getCreatedList = async (req, res, next) => {
    try {
        const gettingCreatedId = req.params.id
        const getCreatedData = await ListingModel.findById(gettingCreatedId)

        if (!getCreatedData) return next(ErrorHandler(404, 'Listing Not Found'))
        res.status(200).json(getCreatedData)

    } catch (error) {
        next(error)
    }
}

const deleteData = async (req, res, next) => {
    try {
        const getId = req.params.id
        const deleteData = await ListingModel.findByIdAndDelete(getId)
        if (!deleteData) return next(ErrorHandler(404, 'Listing Not Found'))
        res.status(200).json('successfully deleted')

    } catch (error) {
        next(error)
    }
}

const getEditData = async (req, res, next) => {
    try {
        const getId = req.params.id
        const gettingData = await ListingModel.findById(getId)
        if (!gettingData) return next(ErrorHandler(404, 'Listing Not Found'))
        res.status(200).json(gettingData)
    } catch (error) {
        next(error)
    }
}

const getUpdateData = async (req, res, next) => {
    try {
        const getId = req.params.id
        const gettingId = await ListingModel.findById(getId)
        if (!gettingId) return next(ErrorHandler(404, 'Listing Not Found'))
        if (req.user.id !== gettingId.userRef.toString()) return next(ErrorHandler(404, 'You only update your own data'))
        const updateData = await ListingModel.findByIdAndUpdate(
            getId,
            req.body,
            { new: true })
        if (!updateData) return next(ErrorHandler(401, 'List not found or update failed'))
        res.status(200).json(updateData)
    } catch (error) {
        next(error)
    }
}

const getSearchData = async (req, res, next) => {
    try {
        let limit = parseInt(req.query.limit) || 9;
        let startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer

        if (offer === undefined || offer === 'false') {
            offer = { $in: [true, false] }
        }

        let furnished = req.query.furnished

        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] }
        }

        let parking = req.query.parking

        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] }
        }

        let housetype = req.query.housetype

        if (housetype === undefined || housetype === "all") {
            housetype = { $in: ['rent', 'sell'] }
        }


        let searchTerm = req.query.searchTerm || '';
        let sort = req.query.sort || 'createdAt';
        let order = req.query.order || 'desc';


        const listing = await ListingModel.find({
            name: { $regex: searchTerm, $options: 'i' },
            housetype,
            offer,
            parkingspot: parking,
            furnished,

        }).sort({ [sort]: order }).limit(limit).skip(startIndex);
        res.status(200).json(listing)
    } catch (error) {
        console.log(error)
        next(error);
    }
};


module.exports = { CreateListing, ListData, getCreatedList, deleteData, getEditData, getUpdateData, getSearchData }