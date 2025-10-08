// Keep track of created charges for testing
let createdCharges = [];

const stripe = {
  charges: {
    create: jest.fn().mockImplementation((options) => {
      const charge = { 
        id: `ch_${Math.random().toString(36).substr(2, 9)}`,
        amount: options.amount,
        currency: options.currency,
        source: options.source,
        description: options.description
      };
      createdCharges.push(charge);
      return Promise.resolve(charge);
    }),
    list: jest.fn().mockImplementation((options) => {
      return Promise.resolve({
        data: createdCharges.slice(0, options.limit || 50)
      });
    })
  },
  // Helper function to clear charges for testing
  __clearCharges: () => {
    createdCharges = [];
  }
};

module.exports = { stripe };