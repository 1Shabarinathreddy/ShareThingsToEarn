const models = require('../models');
const Op = require('sequelize').Op;
const logger = require('../services/logger');

async function addItemRequest(data, userId) {
    try {
        const userExists = await models.User.findByPk(userId);
        if(!userExists) {
            logger.error(`User not found`)
            throw new Error('User not exists');
        }
        const itemExists = await models.Item.findByPk(data.itemId);
        if(!itemExists) {
            logger.error(`Item not found`)
            throw new Error('Item not found');
        }
        const ItemRequestExists = await models.ItemRequest.findOne({where: { itemId: data.itemId, status: 'approved' }});
        if(ItemRequestExists) {
            logger.error(`Cannot book the item, other user have been requested`)
            throw new Error('Cannot book the item, other user have been requested');
        }
        
        data.rentalEndDate = new Date(data.rentalEndDate);
        data.rentalEndDate.setUTCHours(0, 0, 0, 0);

        data.rentalStartDate = new Date(data.rentalStartDate);
        data.rentalStartDate.setUTCHours(0,0,0,0);

        if(data.rentalEndDate > itemExists.availabilityEndDate) {
            logger.error(`Please select the item within the availability date`)
            throw new Error('Please select the item within the availability date');
        }
        if(data.rentalStartDate < itemExists.availabilityStartDate) {
            logger.error(`Please select the item within the availability date`)
            throw new Error('Please select the item within the availability date');
        }


        const ItemRequest = await models.ItemRequest.create({
            requestedUserId: userId,
            ...data
        });
        const itemUpdate = await models.Item.update({ isRequested: true, updatedAt: new Date() }, { where: {id: data.itemId } });

        logger.info(`Item Request sent successfully`);

        return ItemRequest;
    } catch (error) {
        logger.error(error);
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
        logger.info(`Requested Items fetched successfully`);
        return itemRequests;
    } catch(error) {
         logger.error(error);
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
            queryObj.isRequested = true
        }
        const rentalItems = await models.Item.findAndCountAll({
            where: queryObj,
            include: [
                {
                    model: models.ItemRequest,
                    where: { status: 'pending' }
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
        logger.info(`Rental items fetched successfully`);
        return rentalItems;
    } catch(error) {
        logger.error(error);
        throw error;
    }
}

async function approveOrReject(itemRequestId, data, userId) {
    try {
        const userExists = await models.User.findByPk(userId);
        if(!userExists) {
            logger.error(`User not exists`)
            throw new Error('User not exists');
        }
        const itemRequestExists = await models.ItemRequest.findOne({where: { id: itemRequestId, status: 'pending' }});
        if(!itemRequestExists) {
            logger.error(`Item Request not Exists`)
            throw new Error('Item Request not Exists');
        }
        await models.ItemRequest.update({status: data.status, updatedAt: new Date}, { where: { id: itemRequestId } })
        if (data.status === 'reject') {
            await models.Item.update({isRequested: false, updatedAt: new Date()}, { where: { id: itemRequestExists.itemId } });
        }

        return {
            id: itemRequestId
        };
    } catch(error) {
        logger.error(error);
        throw error;
    }
}

async function itemReturn(itemId, userId) {
    try {
        const userExists = await models.User.findByPk(userId);
        if(!userExists) {
            logger.error(`User not exists`)
            throw new Error('User not exists');
        }
        const itemExists = await models.Item.findByPk(itemId);
        if(!itemExists) {
            logger.error(`Item not found`)
            throw new Error('Item not found');
        }
        const itemRequestExists = await models.ItemRequest.findOne({where: { itemId: itemId, status: 'approved' }});
        if(!itemRequestExists) {
            logger.error(`No Item is present to Return`)
            throw new Error('No Item is present to Return');
        }
        await models.ItemRequest.update({status: 'returned', updatedAt: new Date}, { where: { id: itemRequestExists.id } })
        await models.Item.update({isRequested: false, updatedAt: new Date()}, { where: { id: itemId } });
        logger.info(`Item returned successfully`);
        return {
            id: itemId
        };
    } catch(error) {
        logger.error(error);
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
        logger.info(`Rented items fetched successfully`);
        return itemRequests;
    } catch(error) {
        logger.error(error);
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