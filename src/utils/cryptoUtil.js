const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET;

async function getKey() {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(SECRET_KEY);


  const hash = await crypto.subtle.digest("SHA-256", keyData);

  return crypto.subtle.importKey(
    "raw",
    hash,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptPayload(text) {
  const key = await getKey();

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encoded = new TextEncoder().encode(text);

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  const encryptedArray = new Uint8Array(encryptedBuffer);


  const tag = encryptedArray.slice(encryptedArray.length - 16);
  const encrypted = encryptedArray.slice(0, encryptedArray.length - 16);


  const combined = new Uint8Array(
    iv.length + tag.length + encrypted.length
  );

  combined.set(iv, 0);
  combined.set(tag, iv.length);
  combined.set(encrypted, iv.length + tag.length);

  return btoa(String.fromCharCode(...combined));
}

export async function decryptPayload(base64Data) {
  const key = await getKey();

  const buffer = Uint8Array.from(
    atob(base64Data),
    (c) => c.charCodeAt(0)
  );

  const iv = buffer.slice(0, 12);
  const tag = buffer.slice(12, 28);
  const encrypted = buffer.slice(28);

  // WebCrypto expects encrypted + tag
  const encryptedWithTag = new Uint8Array(
    encrypted.length + tag.length
  );

  encryptedWithTag.set(encrypted, 0);
  encryptedWithTag.set(tag, encrypted.length);

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedWithTag
  );

  return new TextDecoder().decode(decryptedBuffer);
}
