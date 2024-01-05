const mongodb = require('mongoose')

const ListingSchema = new mongodb.Schema({
    housetype: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    offer: {
        type: Boolean,
        require: true
    },
    parkingspot: {
        type: Boolean,
        require: true

    },
    furnished: {
        type: Boolean,
        require: true
    },
    regularprice: {
        type: Number,
        require: true
    },
    beds: {
        type: Number,
        require: true
    },
    baths: {
        type: Number,
        require: true
    },
    images: {
        type: Array,
        require: true
    },
    userRef: {
        type: mongodb.Schema.Types.ObjectId,
        ref: 'UserModel',
        require: true
    }
}, { timestamps: true })

const ListingModel = mongodb.model('ListingModel', ListingSchema)

module.exports = ListingModel