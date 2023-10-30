export async function sha256(string: string) {
  const utf8 = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function encryptPayload(publicKey: string, payload: string): Promise<string> {
  // Convert the payload to a Uint8Array
  const encoder = new TextEncoder();
  const payloadBytes = encoder.encode(payload);

  // Convert the public key string to an ArrayBuffer
  const publicKeyBuffer = encoder.encode(publicKey).buffer;

  // Import the public key
  const importedKey = await window.crypto.subtle.importKey(
    'spki',
    publicKeyBuffer,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    ['encrypt']
  );

  // Encrypt the payload with the public key
  const ciphertext = await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, importedKey, payloadBytes);

  // Convert the ciphertext to a base64-encoded string for transmission
  const ciphertextBase64 = window.btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
  return ciphertextBase64;
}
