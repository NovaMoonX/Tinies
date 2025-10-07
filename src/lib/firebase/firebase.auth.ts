import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase.config';

export async function logIn(email: string, password: string) {
  let result: UserCredential | null = null,
    error = null;
  try {
    result = await signInWithEmailAndPassword(auth, email, password);

    if (!result.user.emailVerified) {
      error = new FirebaseError(
        'auth/email-not-verified',
        'Email not verified',
      );
    }
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function signUp(email: string, password: string) {
  let result: UserCredential | null = null,
    error = null;

  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(result?.user);
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function signOut() {
  let result = null,
    error = null;

  try {
    result = await firebaseSignOut(auth);
  } catch (e) {
    error = e as FirebaseError;
  }

  return { result, error };
}

export async function authWithGoogle() {
  let result = null,
    error = null;
  try {
    result = await signInWithPopup(auth, googleProvider);

    if (!result.user.emailVerified) {
      document.location = '/verify-email';
    }
  } catch (e) {
    error = e as FirebaseError;
    console.error('error auth with Google', error);
  }

  return { result, error };
}
