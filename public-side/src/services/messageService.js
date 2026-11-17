import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Submit a customer message or inquiry to Firestore.
 * Collection: "messages"
 *
 * @param {Object} params
 * @param {string} params.name - Full name of the customer
 * @param {string} params.email - Contact email
 * @param {string} [params.phone] - Contact phone number (optional)
 * @param {string} params.message - Note or inquiry message
 * @returns {Promise<Object>} Created message reference with ID
 */
export async function sendMessage({ name, email, phone = '', message }) {
  const cleanName = (name || '').trim();
  const cleanEmail = (email || '').trim();
  const cleanPhone = (phone || '').trim();
  const cleanMessage = (message || '').trim();

  // Basic client validation to guarantee compliance with Firestore security rules
  if (!cleanName || cleanName.length > 100) {
    throw new Error('Name must be between 1 and 100 characters.');
  }

  if (!cleanEmail || cleanEmail.length > 200) {
    throw new Error('Email must be valid and less than 200 characters.');
  }

  if (cleanPhone.length > 20) {
    throw new Error('Phone number must be at most 20 characters.');
  }

  if (!cleanMessage || cleanMessage.length > 2000) {
    throw new Error('Message must be between 1 and 2000 characters.');
  }

  // Exact keys required by Firestore rules:
  // ['name','email','phone','message','status','createdAt','source']
  const payload = {
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    message: cleanMessage,
    status: 'new',
    source: 'website',
    createdAt: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, 'messages'), payload);
    return {
      id: docRef.id,
      ...payload
    };
  } catch (error) {
    console.error('Firestore sendMessage error:', error);
    throw error;
  }
}
