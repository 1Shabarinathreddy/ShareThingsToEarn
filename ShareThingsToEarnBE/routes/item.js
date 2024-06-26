const Joi = require('joi');
const { listCategories, createItem, listItems, updateItem, destroyItem, listItemsToBook } = require('../controllers/item');

const addItemSchema = Joi.object({
    title: Joi.string().label('Title').required(),
    categoryId: Joi.number().label('Category Id').required(),
    description: Joi.string().allow(null),
    rentalPrice: Joi.number().required(),
    rentalPeriod: Joi.string().required(),
    availabilityStartDate: Joi.date().required(),
    availabilityEndDate: Joi.date().required(),
    location: Joi.string().allow(null).required(),
    notes: Joi.string().allow(null) 
});

const editItemSchema = Joi.object({
    title: Joi.string().label('Title'),
    description: Joi.string().allow(null),
    rentalPrice: Joi.number().allow(null),
    rentalPeriod: Joi.string().allow(null),
    availabilityStartDate: Joi.date(),
    availabilityEndDate: Joi.date(),
    location: Joi.string(),
    notes: Joi.string().allow(null)
});

async function addItem (req, res) {
    try {
        console.log(req.body);
        const data = req.body;
        const { error, value } = addItemSchema.validate(data);
        if (error) {
            throw new Error(error.details[0].message);
        }
        const result = await createItem(data, req.file, req.userId);
        res.send(result);
    } catch(error) {
        res.status(400);
        res.send({
            error: error.message
        })
    }
}

async function getItems (req, res) {
    try {
        const result = await listItems(req.userId);
        res.send(result);
    } catch (error) {
        res.status(400);
        res.send({
            error: error.message
        })
    }
}

async function getItemListToBook (req, res) {
    try {
        const result = await listItemsToBook(req.query.userId);
        res.send(result);
    } catch (error) {
        res.status(400);
        res.send({
            error: error.message
        })
    }
}

async function editItem (req, res) {
    try {
        const data = req.body;
        const { error, value } = editItemSchema.validate(data);
        if (error) {
            throw new Error(error.details[0].message);
        }
        const result = await updateItem(req.params.id, data, req.file, req.userId);
        res.send(result);
    } catch(error) {
        res.status(400);
        res.send({
            error: error.message
        })
    }
}

async function deleteItem (req, res) {
    try {
        const result = await destroyItem(req.params.id);
        res.send(result);
    } catch (error) {
        res.status(400);
        res.send({
            error: error.message
        })
    }
}

async function getCategories (req, res) {
    try {
        const result = await listCategories();
        res.send(result);
    } catch (error) {
        res.status(400);
        res.send({
            error: error.message
        })
    }
}

module.exports = {
    getCategories,
    addItem,
    getItems,
    editItem,
    deleteItem,
    getItemListToBook
}