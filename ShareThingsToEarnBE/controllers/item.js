const models =  require('../models');
const Op = require('sequelize').Op;
const { BlobServiceClient } = require('@azure/storage-blob');

// Azure Blob Storage setup
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient('sharethingsearbimagedb');

async function createItem(data, fileData, userId) {
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

        let itemImage = {
            id: null
        }
        if (fileData) {
            const blockBlobClient = containerClient.getBlockBlobClient(fileData.originalname);
            const uploadBlobResponse = await blockBlobClient.uploadFile(fileData.path);
            // Get the URL of the uploaded file
            const documentUrl = blockBlobClient.url;
            itemImage = await models.ItemImages.create({
                itemId: Item.id,
                imageUrl: documentUrl,
                fileName: fileData.originalname
            });
        }

        return {
            itemImageId: itemImage.id,
            Item: Item
        };
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
                },
                {
                    model: models.ItemImages,
                    attributes: ['imageUrl', 'fileName']
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

async function updateItem(itemId, data, fileData, customerId) {
    try {
        const userExists = await models.User.findByPk(customerId);
        if(!userExists) throw new Error('User not exists');
        const ItemExists = await models.Item.findOne({where: {id: itemId}});
        if(!ItemExists) throw new Error('Item not exists');
        const itemRequestExists = await models.ItemRequest.findOne({where: { itemId: itemId, status: { [Op.in]: ['pending', 'approved'] }}});
        if(itemRequestExists) throw new Error('Item rented cannot be edited');
        await models.Item.update(data, { where: { id: itemId } })
        if (fileData) {
            const itemImageExists = await models.ItemImages.findOne({where: {itemId: itemId}});

            const blockBlobClient = containerClient.getBlockBlobClient(fileData.originalname);
            const uploadBlobResponse = await blockBlobClient.uploadFile(fileData.path);
            // Get the URL of the uploaded file
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
        const itemRequestExists = await models.ItemRequest.findOne({where: { itemId: itemId, status: { [Op.in]: ['pending', 'approved'] }}});
        if(itemRequestExists) throw new Error('Item rented cannot be destroyed');
        await models.ItemRequest.destroy({ where: { itemId }});
        await models.ItemImages.destroy({ where: { itemId }})
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
        if (userExists.phoneNumber === null) throw new Error('Please update your profile to proceed further');
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const items = await models.Item.findAndCountAll({
            where: { userId: {
                [Op.ne]: userId
            }, availabilityEndDate: {
                [Op.gt]: today
            }, isRequested: false
        },
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