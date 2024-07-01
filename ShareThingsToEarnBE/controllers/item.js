const models =  require('../models');
const Op = require('sequelize').Op;
const { BlobServiceClient } = require('@azure/storage-blob');
const logger = require('../services/logger');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient('sharethingsearbimagedb');

async function createItem(data, fileData, userId) {
    try {
        const userExists = await models.User.findByPk(userId);
        if(!userExists) {
            logger.error(`User not exists`)
            throw new Error('User not exists');
        }
        const categoryExists = await models.Category.findByPk(data.categoryId);
        if(!categoryExists) {
            logger.error(`Category not found`)
            throw new Error('Category not found');
        }
        const ItemExists = await models.Item.findOne({where: {title:data.title, categoryId: data.categoryId}});
        if(ItemExists) {
            logger.error('Item already exists')
            throw new Error('Item already exists');
        }
        const Item = await models.Item.create({
            ...data,
            userId
        });

        let itemImage = {
            id: null
        }
        if (fileData) {
            const blockBlobClient = containerClient.getBlockBlobClient(fileData.originalname);
            const uploadBlobResponse = await blockBlobClient.uploadFile(fileData.path);
            const documentUrl = blockBlobClient.url;
            itemImage = await models.ItemImages.create({
                itemId: Item.id,
                imageUrl: documentUrl,
                fileName: fileData.originalname
            });
        }

        logger.info(`Item ${data.title} created successfully`);
        return {
            itemImageId: itemImage.id,
            Item: Item
        };
    } catch(error) {
        logger.error(error);
        throw error;
    }
}

async function listItems(userId) {
    try {
        const userExists = await models.User.findByPk(userId);
        if(!userExists) {
            logger.error(`User not exists`)
            throw new Error('User not exists');
        }
        const items = await models.Item.findAndCountAll({
            where: { userId },
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
        })
        return items;
    } catch(error) {
        logger.error(error);
        throw error;
    }
}

async function updateItem(itemId, data, fileData, customerId) {
    try {
        const userExists = await models.User.findByPk(customerId);
        if(!userExists) {
            logger.error(`User not exists`)
            throw new Error('User not exists');
        }
        const ItemExists = await models.Item.findOne({where: {id: itemId}});
        if(!ItemExists) {
            logger.error(`Item not exists`)
            throw new Error('Item not exists');
        }
        const itemRequestExists = await models.ItemRequest.findOne({where: { itemId: itemId, status: { [Op.in]: ['pending', 'approved'] }}});
        if(itemRequestExists) {
            logger.error(`Item rented cannot be edited`)
            throw new Error('Item rented cannot be edited');
        }
        await models.Item.update(data, { where: { id: itemId } })
        if (fileData) {
            const itemImageExists = await models.ItemImages.findOne({where: {itemId: itemId}});

            const blockBlobClient = containerClient.getBlockBlobClient(fileData.originalname);
            const uploadBlobResponse = await blockBlobClient.uploadFile(fileData.path);
            const documentUrl = blockBlobClient.url;
            if(itemImageExists) {
                await models.ItemImages.update({
                    imageUrl: documentUrl,
                    fileName: fileData.originalname
                }, { where: { id: itemImageExists.id } });
            } else {
                await models.ItemImages.create({
                    itemId: itemId,
                    imageUrl: documentUrl,
                    fileName: fileData.originalname
                })
            }
        }
        logger.info(`Item updated successfully`);
        return {
            itemId,
            name: data.name
        }
    } catch(error) {
        logger.error(error);
        throw error;
    }
}

async function destroyItem(itemId) {
    try {
        const itemExists = await models.Item.findOne({where: {id: itemId}});
        if(!itemExists) {
            logger.error(`Item not exists`)
            throw new Error('Item not exists');
        }
        const itemRequestExists = await models.ItemRequest.findOne({where: { itemId: itemId, status: { [Op.in]: ['pending', 'approved'] }}});
        if(itemRequestExists){
            logger.error(`Item rented cannot be destroyed`)
            throw new Error('Item rented cannot be destroyed');
        }
        await models.ItemRequest.destroy({ where: { itemId }});
        await models.ItemImages.destroy({ where: { itemId }})
        await models.Item.destroy({ where: {id: itemId }});
        logger.info(`Item deleted successfully`);
        return {
            id: itemId
        }
    } catch(error) {
        logger.error(error);
        throw error;
    }
}

async function listCategories() {
    try {
        const categories = await models.Category.findAll()
        return categories;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

async function listItemsToBook(data, userId) {
    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        let queryObj = {
            availabilityEndDate: {
                [Op.gt]: today
            }, isRequested: false
        }
        
        if(userId !== undefined) {
            const userExists = await models.User.findByPk(userId);
            if(!userExists) {
                logger.error(`User not exists`)
                throw new Error('User not exists');
            }
            queryObj.userId = {
                [Op.ne]: userId
            }
        }

        if(data.categoryId) {
            queryObj.categoryId = data.categoryId
        }
        
        const items = await models.Item.findAndCountAll({
            where: queryObj,
            include: [
                {
                    model: models.Category,
                    attributes: ['id', 'name']
                },
                {
                    model: models.User,
                    attributes: ['phoneNumber', 'userName', 'email', 'address', 'country', 'pinCode']
                },
                {
                    model: models.ItemImages,
                    attributes: ['imageUrl', 'fileName']
                }
            ]
        })

        logger.info(`Items fetched successfully`);
        return items;
    } catch(error) {
        logger.error(error);
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
