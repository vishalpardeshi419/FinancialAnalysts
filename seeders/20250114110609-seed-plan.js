'use strict';
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'plans',
      [
        {
          name: 'Basic Plan',
          price: 9.99,
          features: JSON.stringify({
            storage: '10GB',
            support: 'Email Support',
            bandwidth: 'Unlimited',
          }),
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Standard Plan',
          price: 19.99,
          features: JSON.stringify({
            storage: '50GB',
            support: 'Priority Email Support',
            bandwidth: 'Unlimited',
          }),
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Premium Plan',
          price: 49.99,
          features: JSON.stringify({
            storage: '200GB',
            support: '24/7 Support',
            bandwidth: 'Unlimited',
            analytics: 'Advanced Analytics',
          }),
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Enterprise Plan',
          price: 99.99,
          features: JSON.stringify({
            storage: '1TB',
            support: 'Dedicated Support',
            bandwidth: 'Unlimited',
            analytics: 'Custom Analytics',
            integrations: 'Third-party Integrations',
          }),
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('plans', null, {});
  },
};
