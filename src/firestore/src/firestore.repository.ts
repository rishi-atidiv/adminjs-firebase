/* eslint-disable @typescript-eslint/explicit-function-return-type */
import firebase from 'firebase';
import CollectionReference = firebase.firestore.CollectionReference;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import UpdateData = firebase.firestore.UpdateData;
import Query = firebase.firestore.Query;
import DocumentData = firebase.firestore.DocumentData;

export type FirestoreRepository = {
  find: () => CollectionReference<DocumentType>;

  findOne: (id: string) => Promise<DocumentSnapshot>;

  delete: (id: string) => Promise<void>;

  count: (queryFn?: (ref: CollectionReference<DocumentData>) => Query<DocumentData>)  => Promise<number>;

  updateOne: (
    id: string,
    updatedRecord: UpdateData
  ) => Promise<DocumentSnapshot>;

  create: (record) => Promise<DocumentSnapshot>;

  query: (queryFn: (ref: CollectionReference<DocumentData>) => Query<DocumentData>) => Query<DocumentData>;
};
const firestoreRepository = (
  collection: CollectionReference<DocumentType>
): FirestoreRepository => ({
  findOne: (id: string) => collection.doc(id).get(),

  find: () => collection,

  delete: (id: string) => collection.doc(id).delete(),

  async count(queryFn?: (ref: CollectionReference<DocumentData>) => Query<DocumentData>) {
    let query: Query<DocumentData> | CollectionReference<DocumentData> = collection;

    if (queryFn) {
      query = queryFn(collection);
    }

    const querySnapshot = await query.get();

    return querySnapshot.docs.length;
  },

  async updateOne(id: string, updatedRecord: UpdateData) {
    await collection.doc(id).update(updatedRecord);
    return this.findOne(id);
  },

  async create(record: DocumentType) {
    const createdDocument = collection.doc();
    await createdDocument.set(record);
    return collection.doc(createdDocument.id).get();
  },

  query(queryFn: (ref: CollectionReference<DocumentData>) => Query<DocumentData>) {
    return queryFn(collection);
  }
});

export default firestoreRepository;
