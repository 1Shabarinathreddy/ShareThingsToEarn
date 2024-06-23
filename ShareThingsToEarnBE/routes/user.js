const express = require('express');
const router = express.Router();
const { register, login, getUser, updateUser, passwordReset, listUsers } = require('../controllers/user')

const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const registerSchema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.ref('password')
}).with('password', 'confirmPassword');


const updateProfileSchema = Joi.object({
    userName: Joi.string(),
    email: Joi.string().email(),
    phoneNumber: Joi.string().required(),
    dateOfBirth: Joi.string(),
    address: Joi.string().required(),
    country: Joi.string().required(),
    pinCode: Joi.number().required()
});

const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.ref('password')
}).with('password', 'confirmPassword');

async function registerUser(req, res) {
    try {
        const data = req.body;
        const { error, value } = registerSchema.validate(data);
        if (error) {
            throw new Error(error.details[0].message);
        }
        const result = await register(data);
        res.status(result.statusCode || 200);
        res.send(result.message || result);
    } catch (error) {
        res.statusCode = 400;
        res.send({
            error: error.message
        })
    }
}

async function loginUser(req, res) {
    try {
        const data = req.body;
        const { error, value } = userSchema.validate(data);
        if (error) {
            throw new Error(error.details[0].message);
        }
        const result = await login(data);
        res.status(result.statusCode || 200);
        res.send(result.message || result);
    } catch (error) {
        res.statusCode = 400;
        res.send({
            error: error.message
        })
    }
}

async function getProfile(req, res) {
    try {
        const data = req.userId;
        const result = await getUser(data);
        res.status(result.statusCode || 200);
        res.send(result.message || result);
    } catch (error) {
        res.statusCode = 400;
        res.send({
            error: error.message
        })
    }
}

async function updateProfile(req, res) {
    try {
        const data = req.body;
        const { error, value } = updateProfileSchema.validate(data);
        if (error) {
            throw new Error(error.details[0].message);
        }
        const result = await updateUser(data, req.userId);
        res.status(result.statusCode || 200);
        res.send(result.message || result);
    } catch (error) {
        res.statusCode = 400;
        res.send({
            error: error.message
        })
    }
}

async function resetPassword(req, res) {
    try {
        const data = req.body;
        const { error, value } = resetPasswordSchema.validate(data);
        if (error) {
            throw new Error(error.details[0].message);
        }
        const result = await passwordReset(data.email, data.password, data.confirmPassword);
        res.status(result.statusCode || 200);
        res.send(result.message || result);
    } catch (error) {
        res.statusCode = 400;
        res.send({
            error: error.message
        })
    }
}

async function userListing(req, res) {
    try {
        const result = await listUsers();
        res.status(result.statusCode || 200);
        res.send(result.message || result);
    } catch (error) {
        res.statusCode = 400;
        res.send({
            error: error.message
        })
    }
}

module.exports = exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    resetPassword,
    userListing
};