const express = require('express');
const { body } = require('express-validator');
const { createPlan, updatePlan, deletePlan, fetchPlans, changeUserSubscription } = require('../controllers/planController');

const router = express.Router();

// Routes for subscription plans
router.post('/plans', 
  body('name').notEmpty().withMessage('Plan name is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero'),
  body('features').isJSON().withMessage('Features must be a valid JSON'),
  createPlan
);

router.put('/plans/:id', updatePlan);
router.delete('/plans/:id', deletePlan);
router.get('/plans', fetchPlans);

// Route for handling subscription changes
router.post('/change-subscription', changeUserSubscription);

module.exports = router;
