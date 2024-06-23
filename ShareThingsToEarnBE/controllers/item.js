const models =  require('../models');
const Op = require('sequelize').Op;

async function createItem(data, userId) {
    try {
        const userExists = await models.User.findByPk(userId);
        if(!userExists) throw new Error('User not exists');
        const categoryExists = await models.Category.findByPk(data.categoryId);
        if(!categoryExists) throw new Error('Category not found');
        const ItemExists = await models.Item.findOne({where: {title:data.title, categoryId: data.categoryId}});
        if(ItemExists) throw new Error('Item already exists');
        const Item = await models.Item.create({
            ...data,
            userId
        });
        return Item;
    } catch(error) {
        console.log(error);
        throw error;
    }
}

async function listItems(userId) {
    try {
        const userExists = await models.User.findByPk(userId);
        if(!userExists) throw new Error('User not exists');
        const items = await models.Item.findAndCountAll({
            where: { userId },
            include: [
                {
                    model: models.Category,
                    attributes: ['id', 'name']
                }
            ]
        })
        console.log(userExists)
        if (userExists.phoneNumber === null) throw new Error('Please update your profile to proceed further');
        return items;
    } catch(error) {
        console.log(error);
        throw error;
    }
}

async function updateItem(itemId, data, customerId) {
    try {
        const userExists = await models.User.findByPk(customerId);
        if(!userExists) throw new Error('User not exists');
        const ItemExists = await models.Item.findOne({where: {id: itemId}});
        if(!ItemExists) throw new Error('Item not exists');
        await models.Item.update(data, { where: { id: itemId } })
        return {
            itemId,
            name: data.name
        }
    } catch(error) {
        console.log(error);
        throw error;
    }
}

async function destroyItem(itemId) {
    try {
        const itemExists = await models.Item.findOne({where: {id: itemId}});
        if(!itemExists) throw new Error('Item not exists');
        await models.Item.destroy({ where: {id: itemId }});
        return {
            id: itemId
        }
    } catch(error) {
        console.log(error);
        throw error;
    }
}

async function listCategories() {
    try {
        const categories = await models.Category.findAll()
        return categories;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function listItemsToBook(userId) {
    try {
        const userExists = await models.User.findByPk(userId);
        if(!userExists) throw new Error('User not exists');
        const items = await models.Item.findAndCountAll({
            where: { userId: {
                [Op.ne]: userId
            }},
            include: [
                {
                    model: models.Category,
                    attributes: ['id', 'name']
                }
            ]
        })
        console.log(userExists)
        if (userExists.phoneNumber === null) throw new Error('Please update your profile to proceed further');
        return items;
    } catch(error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    listCategories,
    createItem,
    listItems,
    updateItem,
    destroyItem,
    listItemsToBook
}