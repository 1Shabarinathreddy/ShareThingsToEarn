const Joi = require('joi');
const { addItemRequest, listRequestedItems, listRentalItems, approveOrReject, itemReturn, listRentedItems } = require('../controllers/itemrequest');

const addItemRequestSchema = Joi.object({
    itemId: Joi.number().label('Item Id').required(),
    rentalStartDate: Joi.date().required(),
    rentalEndDate: Joi.date().required(),
    notes: Joi.string().allow(null, '')
});

async function bookItem(req, res) {
    try{
        const data = req.body;
        const { error, value } = addItemRequestSchema.validate(data);
        if (error) {
            throw new Error(error.details[0].message);
        }
        const result = await addItemRequest(data, req.userId);
        res.send(result);
    } catch (error) {
        res.status(400);
        res.send({
            error: error.message
        })
    }
}

async function getRequestedItems (req, res) {
    try {
        const result = await listRequestedItems(req.userId);
        res.send(result);
    } catch (error) {
        res.status(400);
        res.send({
            error: error.message
        })
    }
}

async function getRentalItems (req, res) {
    try {
        const result = await listRentalItems(req.userId);
        res.send(result);
    } catch (error) {
        res.status(400);
        res.send({
            error: error.message
        })
    }
}

async function updateStatus (req, res) {
    try {
        const result = await approveOrReject(req.params.id, req.body, req.userId);
        res.send(result);
    } catch (error) {
        res.status(400);
        res.send({
            error: error.message
        })
    }
}

async function returnItem (req, res) {
    try {
        const result = await itemReturn(req.params.id, req.userId);
        res.send(result);
    } catch (error) {
        res.status(400);
        res.send({
            error: error.message
        })
    }
}


async function getRentedItems (req, res) {
    try {
        const result = await listRentedItems();
        res.send(result);
    } catch (error) {
        res.status(400);
        res.send({
            error: error.message
        })
    }
}


module.exports = {
    bookItem,
    getRequestedItems,
    getRentalItems,
    updateStatus,
    returnItem,
    getRentedItems
}