import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';


// Simple encryption for web storage
class WebEncryption {
  private static readonly SECRET_KEY = 'ai-assistant-secret-key-2024';
  
  static encrypt(text: string): string {
    try {
      // Simple XOR encryption (for demo - use proper crypto in production)
      let encrypted = '';
      for (let i = 0; i < text.length; i++) {
        encrypted += String.fromCharCode(
          text.charCodeAt(i) ^ this.SECRET_KEY.charCodeAt(i % this.SECRET_KEY.length)
        );
      }
      return btoa(encrypted); // Base64 encode
    } catch (error) {
      console.error('Encryption failed:', error);
      return text; // Return original if encryption fails
    }
  }
  
  static decrypt(encryptedText: string): string {
    try {
      const decoded = atob(encryptedText); // Base64 decode
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        decrypted += String.fromCharCode(
          decoded.charCodeAt(i) ^ this.SECRET_KEY.charCodeAt(i % this.SECRET_KEY.length)
        );
      }
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedText; // Return original if decryption fails
    }
  }
}

// Web-compatible encrypted storage service
class WebStorage {
  static async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        // Encrypt sensitive data before storing
        const encryptedValue = WebEncryption.encrypt(value);
        window.localStorage.setItem(key, encryptedValue);
      }
    } catch (error) {
      console.error(`❌ Failed to store ${key} in localStorage:`, error);
      throw error;
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const encryptedValue = window.localStorage.getItem(key);
        if (encryptedValue) {
          // Decrypt data after retrieving
          return WebEncryption.decrypt(encryptedValue);
        }
        return null;
      }
      return null;
    } catch (error) {
      console.error(`❌ Failed to retrieve ${key} from localStorage:`, error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`❌ Failed to remove ${key} from localStorage:`, error);
      throw error;
    }
  }
}

// Key sanitization for iOS SecureStore compatibility
class KeySanitizer {
  /**
   * Sanitize key for iOS SecureStore compatibility
   * iOS SecureStore only allows alphanumeric characters, ".", "-", and "_"
   */
  static sanitizeKey(key: string): string {
    // Replace colons and other invalid characters with underscores
    const sanitizedKey = key.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    
    // Log key transformation for debugging
    if (key !== sanitizedKey) {
      // console.log(`🔧 Key sanitized: "${key}" -> "${sanitizedKey}"`);
    }
    
    return sanitizedKey;
  }
}

// Secure storage service using Expo SecureStore (native) or localStorage (web)
export class SecureStorageService {
  /**
   * Store a value securely
   */
  static async setItem(key: string, value: string): Promise<void> {
    try {
      // Sanitize key for consistency across all platforms
      const sanitizedKey = KeySanitizer.sanitizeKey(key);
      
      if (Platform.OS === 'web') {
        await WebStorage.setItem(sanitizedKey, value);
      } else {
        await SecureStore.setItemAsync(sanitizedKey, value);
      }
    } catch (error) {
      console.error(`❌ Failed to store ${key}:`, error);
      throw error;
    }
  }

  /**
   * Retrieve a value securely
   */
  static async getItem(key: string): Promise<string | null> {
    try {
      // Sanitize key for consistency across all platforms
      const sanitizedKey = KeySanitizer.sanitizeKey(key);
      
      if (Platform.OS === 'web') {
        return await WebStorage.getItem(sanitizedKey);
      } else {
        const value = await SecureStore.getItemAsync(sanitizedKey);
        return value;
      }
    } catch (error) {
      console.error(`❌ Failed to retrieve ${key}:`, error);
      return null;
    }
  }

  /**
   * Delete a value securely
   */
  static async removeItem(key: string): Promise<void> {
    try {
      // Sanitize key for consistency across all platforms
      const sanitizedKey = KeySanitizer.sanitizeKey(key);
      
      if (Platform.OS === 'web') {
        await WebStorage.removeItem(sanitizedKey);
      } else {
        await SecureStore.deleteItemAsync(sanitizedKey);
      }
    } catch (error) {
      console.error(`❌ Failed to remove ${key}:`, error);
      throw error;
    }
  }
}