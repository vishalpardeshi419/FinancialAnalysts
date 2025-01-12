const { validationResult } = require('express-validator');
const Plan = require('../models/plan');
const User = require('../models/user');
const clickhouse = require('../config/clickhouse');

/* Create Plan */
const createPlan = async (req, res) => {  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { name, price, features } = req.body;
    try {
      const plan = await Plan.create({ name, price, features });
      res.status(201).json({ message: 'Plan created successfully', plan });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

const updatePlan = async (req, res) => {  
    const { id } = req.params;
  const { name, price, features } = req.body;

  try {
    const plan = await Plan.findByPk(id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    plan.name = name || plan.name;
    plan.price = price || plan.price;
    plan.features = features || plan.features;
    await plan.save();

    res.status(200).json({ message: 'Plan updated successfully', plan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePlan = async (req, res) => {
    const { id } = req.params;

    try {
      const plan = await Plan.findByPk(id);
      if (!plan) return res.status(404).json({ error: 'Plan not found' });
  
      await plan.destroy();
      res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

const fetchPlans = async (req, res) => {
    try {
        const plans = await Plan.findAll();
        res.status(200).json({ plans });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}

const changeUserSubscription = async (req, res) => {
    const { userId, newPlan } = req.body;

    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const currentPlan = await Plan.findOne({ where: { name: user.current_plan } });
        const newPlanDetails = await Plan.findOne({ where: { name: newPlan } });

        if (!newPlanDetails) return res.status(404).json({ error: 'New plan not found' });

        // Check trial period or upgrade/downgrade logic
        if (user.trial_end_date && newPlanDetails.price > currentPlan.price) {
        return res.status(400).json({ error: 'Upgrade not allowed during trial period' });
        }

        // Update user subscription
        user.current_plan = newPlan;
        await user.save();

        // Log metrics in Clickhouse
        await clickhouse.query(`INSERT INTO subscription_metrics (user_id, old_plan, new_plan, change_date) VALUES ('${userId}', '${user.current_plan}', '${newPlan}', NOW())`).toPromise();

        res.status(200).json({ message: 'Subscription updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createPlan, updatePlan, deletePlan, fetchPlans, changeUserSubscription };

