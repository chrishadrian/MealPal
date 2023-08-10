import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
// https://firebase.google.com/docs/web/setup#available-libraries

const production = process.env.NODE_ENV === 'prod';

const firebaseProdConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: 'recipebuddy-prod.firebaseapp.com',
	projectId: 'recipebuddy-prod',
	storageBucket: 'recipebuddy-prod.appspot.com',
	messagingSenderId: '183607586953',
	appId: '1:183607586953:web:f1fe0ee63efe55b6239658',
	measurementId: 'G-T2WHGEXCPV',
};

const firebaseDevConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: 'recipebuddy-1261c.firebaseapp.com',
	projectId: 'recipebuddy-1261c',
	storageBucket: 'recipebuddy-1261c.appspot.com',
	messagingSenderId: '794295590368',
	appId: '1:794295590368:web:b34b05e9fc8ef22a73df85',
	measurementId: 'G-4VYXX6XK1J',
};

// Initialize Firebase
const app = initializeApp(production ? firebaseProdConfig : firebaseDevConfig);
getAnalytics(app);

// auth
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const auth = getAuth();
export const signInWithGooglePopUp = () => signInWithPopup(auth, provider);

// firestore
export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth) => {
	const userDocRef = doc(db, 'users', userAuth.uid);
	// console.log(userDocRef);

	const userSnapshot = await getDoc(userDocRef);
	// console.log(userSnapshot);
	// check if the data exists in the database
	// console.log(userSnapshot.exists());

	if (!userSnapshot.exists()) {
		const { displayName, email } = userAuth;
		const createdAt = new Date();

		try {
			await setDoc(userDocRef, {
				displayName,
				email,
				createdAt,
			});
		} catch (error) {
			console.error('Error creating the user', error.message);
		}
	}

	return userDocRef;
};
