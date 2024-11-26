const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a MongoDB model
const Country = mongoose.model('Country', {
  code: String,
  name: String,
  capital: String,
  currency: String,
});

const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    country: async (_, { code }) => {
      return await Country.findOne({ code });
    },
  },
};
