import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';

@Injectable()
export class FirebaseRepository {
    #db: FirebaseFirestore.Firestore;
    #collection: FirebaseFirestore.CollectionReference;

    constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
        this.#db = firebaseApp.firestore();
        this.#collection = this.#db.collection('<collection_name>');
    }
}