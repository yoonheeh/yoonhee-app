import { defineData } from '@aws-amplify/backend';
import { type ClientSchema } from '@aws-amplify/data-schema';

// Define your schema with models for storing chat messages and user information
const schema = {
  Message: {
    id: 'ID!',
    content: 'String!',
    isUser: 'Boolean!',
    createdAt: 'AWSDateTime!',
    updatedAt: 'AWSDateTime!',
    userId: 'ID!',
    sessionId: 'ID!',
  },
  Session: {
    id: 'ID!',
    title: 'String!',
    createdAt: 'AWSDateTime!',
    updatedAt: 'AWSDateTime!',
    userId: 'ID!',
  },
  User: {
    id: 'ID!',
    username: 'String!',
    email: 'String!',
    createdAt: 'AWSDateTime!',
    updatedAt: 'AWSDateTime!',
  }
} satisfies ClientSchema;

// Define authorization rules for the data
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  }
}); 