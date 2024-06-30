const models = require('../models');
const Op = require('sequelize').Op;

async function addItemRequest(data, userId) {
    try {
        const userExists = await models.User.findByPk(userId);
        if(!userExists) throw new Error('User not exists');
        const itemExists = await models.Item.findByPk(data.itemId);
        if(!itemExists) throw new Error('Item not found');
        const ItemRequestExists = await models.ItemRequest.findOne({where: { itemId: data.itemId, status: 'pending' }});
        if(ItemRequestExists) throw new Error('Cannot book the item, other user have been requested');
        const ItemRequest = await models.ItemRequest.create({
            requestedUserId: userId,
            ...data
        });
        const itemUpdate = await models.Item.update({ isRequested: true, updatedAt: new Date() }, { where: {id: data.itemId } });
        console.log(itemUpdate)
        return ItemRequest;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


async function listRequestedItems(userId) {
    try {
        const userExists = await models.User.findByPk(userId);
        if(!userExists) throw new Error('User not exists');
        const itemRequests = await models.ItemRequest.findAndCountAll({
            attributes: ['id', 'rentalStartDate', 'rentalEndDate', 'notes', 'itemId', 'status'],
            where: { requestedUserId: userId },
            include: [
                {
                    model: models.Item,
                    attributes: ['id', 'title', 'description', 'rentalPrice', 'rentalPeriod', 'availabilityStartDate', 'availabilityEndDate', 'location', 'notes'],
                    include: [
                        {
                            model: models.Category,
                            attributes: ['id', 'name']
                        },
                        {
                            model: models.ItemImages,
                            attributes: ['imageUrl', 'fileName']
                        }
                    ]
                }
            ]
        })
        return itemRequests;
    } catch(error) {
        console.log(error);
        throw error;
    }
}

async function listRentalItems(userId) {
    try {
        let queryObj = {}
        const userExists = await models.User.findByPk(userId);
        if(!userExists) throw new Error('User not exists');
        if(userExists.role === 'User') {
            queryObj.userId = userId
        }
        const rentalItems = await models.Item.findAndCountAll({
            where: queryObj,
            include: [
                {
                    model: models.ItemRequest
                },
                {
                    model: models.Category,
                    attributes: ['id', 'name']
                },
                {
                    model: models.ItemImages,
                    attributes: ['imageUrl', 'fileName']
                },
                {
                    model: models.User
                }
            ]

        })
        return rentalItems;
    } catch(error) {
        console.log(error);
        throw error;
    }
}

async function approveOrReject(itemRequestId, data, userId) {
    try {
        const userExists = await models.User.findByPk(userId);
        if(!userExists) throw new Error('User not exists');
        const itemRequestExists = await models.ItemRequest.findOne({where: { id: itemRequestId, status: 'pending' }});
        if(!itemRequestExists) throw new Error('Item Request not Exists');
        await models.ItemRequest.update({status: data.status, updatedAt: new Date}, { where: { id: itemRequestId } })
        if (data.status === 'reject') {
            await models.Item.update({isRequested: false, updatedAt: new Date()}, { where: { id: itemRequestExists.itemId } });
        }
        return {
            id: itemRequestId
        };
    } catch(error) {
        console.log(error);
        throw error;
    }
}

async function itemReturn(itemId, userId) {
    try {
        const userExists = await models.User.findByPk(userId);
        if(!userExists) throw new Error('User not exists');
        const itemExists = await models.Item.findByPk(itemId);
        if(!itemExists) throw new Error('Item not found');
        const itemRequestExists = await models.ItemRequest.findOne({where: { itemId: itemId, status: 'approved' }});
        if(!itemRequestExists) throw new Error('No Item is present to Return');
        await models.ItemRequest.update({status: 'returned', updatedAt: new Date}, { where: { id: itemRequestExists.id } })
        await models.Item.update({isRequested: false, updatedAt: new Date()}, { where: { id: itemId } });
        return {
            id: itemId
        };
    } catch(error) {
        console.log(error);
        throw error;
    }
}

async function listRentedItems() {
    try {
        const itemRequests = await models.ItemRequest.findAndCountAll({
            attributes: ['id', 'rentalStartDate', 'rentalEndDate', 'notes', 'itemId', 'status'],
            where: { status: {
                [Op.in]: ['approved', 'returned'] },
            },
            include: [
                {
                    model: models.Item,
                    attributes: ['id', 'title', 'description', 'rentalPrice', 'rentalPeriod', 'availabilityStartDate', 'availabilityEndDate', 'location', 'notes'],
                    include: [
                        {
                            model: models.Category,
                            attributes: ['id', 'name']
                        },
                        {
                            model: models.ItemImages,
                            attributes: ['fileName', 'imageUrl']
                        }
                    ]
                }
            ]
        })
        return itemRequests;
    } catch(error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    addItemRequest,
    listRequestedItems,
    listRentalItems,
    approveOrReject,
    itemReturn,
    listRentedItems
}