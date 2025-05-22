import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FirebaseRepository } from './firebase.repository';
import * as serviceAccount from './firebase-service-account.json';

const firebaseProvider = {
    provide: 'FIREBASE_APP',
    inject: [ConfigService],
    useFactory: () => {
        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        });
    },
};

@Module({
    imports: [ConfigModule],
    providers: [firebaseProvider, FirebaseRepository],
    exports: [FirebaseRepository],
})
export class FirebaseModule { }