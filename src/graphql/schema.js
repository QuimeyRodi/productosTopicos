import { GraphQLError } from 'graphql';
import Product from '../models/Product.js';

export const typeDefs = `#graphql
  type Product {
    id: ID!
    name: String!
    price: Float!
    stock: Int!
    category: String!
    description: String
  }

  input ProductFilter {
    name: String
    category: String
    minPrice: Float
    maxPrice: Float
    inStock: Boolean
  }

  input UpdateProductInput {
    name: String
    price: Float
    stock: Int
    category: String
    description: String
  }

  type Query {
    products(filter: ProductFilter): [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    updateProduct(id: ID!, input: UpdateProductInput!): Product
  }
`;

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const resolvers = {
  Product: {
    id: (product) => product._id.toString(),
  },
  Query: {
    products: async (_parent, { filter = {} }) => {
      const query = {};

      if (filter.name) {
        query.name = { $regex: escapeRegex(filter.name), $options: 'i' };
      }
      if (filter.category) {
        query.category = { $regex: `^${escapeRegex(filter.category)}$`, $options: 'i' };
      }
      if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
        query.price = {};
        if (filter.minPrice !== undefined) query.price.$gte = filter.minPrice;
        if (filter.maxPrice !== undefined) query.price.$lte = filter.maxPrice;
      }
      if (filter.inStock !== undefined) {
        query.stock = filter.inStock ? { $gt: 0 } : 0;
      }

      return Product.find(query).sort({ name: 1 });
    },
    product: async (_parent, { id }) => Product.findById(id),
  },
  Mutation: {
    updateProduct: async (_parent, { id, input }) => {
      if (Object.keys(input).length === 0) {
        throw new GraphQLError('Debe indicar al menos un campo para actualizar.', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      return Product.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
      });
    },
  },
};