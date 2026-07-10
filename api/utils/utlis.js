// utils/utils.js

import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

// ========== ERROR HANDLING ==========

// Custom Error Class
export class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error Handler Middleware
export const errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};

// Global Error Handler
export const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(404, message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(400, message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new AppError(400, message);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

// ========== JWT UTILITIES ==========

// Generate JWT Token
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// Verify JWT Token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Extract token from request
export const getTokenFromRequest = (req) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.access_token) {
    token = req.cookies.access_token;
  }
  
  return token;
};

// ========== PASSWORD UTILITIES ==========

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(12);
  return await bcryptjs.hash(password, salt);
};

// Compare password
export const comparePassword = async (password, hashedPassword) => {
  return await bcryptjs.compare(password, hashedPassword);
};

// ========== VALIDATION UTILITIES ==========

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
export const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

// ========== RESPONSE UTILITIES ==========

// Success Response
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Error Response
export const errorResponse = (res, message = 'Something went wrong', statusCode = 500, error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error
  });
};

// ========== FILE UPLOAD UTILITIES ==========

// Get file extension
export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

// Check if file is image
export const isImageFile = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const extension = getFileExtension(filename);
  return imageExtensions.includes(extension);
};

// Generate unique filename
export const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = getFileExtension(originalName);
  return `${timestamp}_${randomString}.${extension}`;
};

// ========== PAGINATION UTILITIES ==========

// Pagination helper
export const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;
  
  return { limit, offset };
};

// Pagination data
export const getPaginationData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  
  return { 
    totalItems, 
    items, 
    totalPages, 
    currentPage,
    hasNext: currentPage < totalPages - 1,
    hasPrevious: currentPage > 0
  };
};

// ========== DATE UTILITIES ==========

// Format date
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  switch(format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    default:
      return `${year}-${month}-${day}`;
  }
};

// Get date range
export const getDateRange = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  
  return { start, end };
};

// ========== STRING UTILITIES ==========

// Generate slug from title
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Capitalize first letter
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Generate random string
export const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// ========== PROPERTY SPECIFIC UTILITIES ==========

// Calculate property price per sqft
export const calculatePricePerSqft = (price, area) => {
  if (!price || !area || area === 0) return 0;
  return Math.round((price / area) * 100) / 100;
};

// Format price (e.g., 1500000 -> "15,00,000")
export const formatPrice = (price, currency = '₹') => {
  if (!price) return `${currency}0`;
  
  // Indian number format
  const x = price.toString();
  const lastThree = x.substring(x.length - 3);
  const otherNumbers = x.substring(0, x.length - 3);
  
  if (otherNumbers !== '') {
    const formattedOthers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    return `${currency}${formattedOthers},${lastThree}`;
  }
  
  return `${currency}${lastThree}`;
};

// Generate property reference number
export const generatePropertyRef = () => {
  const prefix = 'PROP';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// ========== EMAIL UTILITIES ==========

// Email templates
export const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to RealEstate App',
    html: `
      <h2>Welcome ${name}!</h2>
      <p>Thank you for joining our real estate platform.</p>
      <p>Start exploring amazing properties today!</p>
    `
  }),
  
  resetPassword: (name, resetLink) => ({
    subject: 'Password Reset Request',
    html: `
      <h2>Hi ${name},</h2>
      <p>You requested a password reset.</p>
      <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
      <p>This link will expire in 10 minutes.</p>
    `
  }),
  
  propertyInquiry: (propertyTitle, userName, userEmail, message) => ({
    subject: `Inquiry for ${propertyTitle}`,
    html: `
      <h2>New Property Inquiry</h2>
      <p><strong>Property:</strong> ${propertyTitle}</p>
      <p><strong>From:</strong> ${userName} (${userEmail})</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  })
};

// ========== SEARCH & FILTER UTILITIES ==========

// Build search query for MongoDB
export const buildSearchQuery = (filters) => {
  const query = {};
  
  // Text search
  if (filters.searchTerm) {
    query.$or = [
      { name: { $regex: filters.searchTerm, $options: 'i' } },
      { description: { $regex: filters.searchTerm, $options: 'i' } },
      { address: { $regex: filters.searchTerm, $options: 'i' } }
    ];
  }
  
  // Type filter
  if (filters.type && filters.type !== 'all') {
    query.type = filters.type;
  }
  
  // Offer filter
  if (filters.offer) {
    query.offer = filters.offer;
  }
  
  // Furnished filter
  if (filters.furnished) {
    query.furnished = filters.furnished;
  }
  
  // Parking filter
  if (filters.parking) {
    query.parking = filters.parking;
  }
  
  // Price range
  if (filters.minPrice || filters.maxPrice) {
    query.regularPrice = {};
    if (filters.minPrice) query.regularPrice.$gte = parseInt(filters.minPrice);
    if (filters.maxPrice) query.regularPrice.$lte = parseInt(filters.maxPrice);
  }
  
  // Bedrooms
  if (filters.bedrooms) {
    query.bedrooms = { $gte: parseInt(filters.bedrooms) };
  }
  
  // Bathrooms
  if (filters.bathrooms) {
    query.bathrooms = { $gte: parseInt(filters.bathrooms) };
  }
  
  return query;
};

// Sort options
export const getSortOptions = (sort) => {
  switch (sort) {
    case 'price_asc':
      return { regularPrice: 1 };
    case 'price_desc':
      return { regularPrice: -1 };
    case 'createdAt_desc':
      return { createdAt: -1 };
    case 'createdAt_asc':
      return { createdAt: 1 };
    default:
      return { createdAt: -1 };
  }
};

// ========== ASYNC HANDLER ==========

// Async handler wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ========== EXPORT ALL ==========
export default {
  AppError,
  errorHandler,
  globalErrorHandler,
  generateToken,
  verifyToken,
  getTokenFromRequest,
  hashPassword,
  comparePassword,
  isValidEmail,
  isStrongPassword,
  isValidPhone,
  successResponse,
  errorResponse,
  getFileExtension,
  isImageFile,
  generateUniqueFilename,
  getPagination,
  getPaginationData,
  formatDate,
  getDateRange,
  generateSlug,
  capitalize,
  generateRandomString,
  calculatePricePerSqft,
  formatPrice,
  generatePropertyRef,
  emailTemplates,
  buildSearchQuery,
  getSortOptions,
  asyncHandler
};