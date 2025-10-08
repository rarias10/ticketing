// Keep track of created charges for testing
let createdCharges: any[] = [];

export const stripe = {
  charges: {
    create: jest.fn().mockImplementation((options: any) => {
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
    list: jest.fn().mockImplementation((options: any) => {
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