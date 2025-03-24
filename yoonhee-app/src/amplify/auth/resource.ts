import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  verification: {
    verificationEmailSender: 'noreply@yourdomain.com',
  },
  userAttributes: {
    profilePicture: {
      required: false,
      mutable: true,
    },
  },
}); 