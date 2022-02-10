import firebase from 'firebase';

import { userSchema } from './user.schema';

export const createUserResource = (): unknown => ({
  collection: firebase.firestore().collection('Users'),
  schema: userSchema,
});
