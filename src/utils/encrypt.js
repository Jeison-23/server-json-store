export const encrypt = (message, key) => {
  let encryptedMessage = '';
  for (let i = 0; i < message.length; i++) {
    const char = message[i];
    const charCode = char.charCodeAt(0);
    let encryptedCharCode;
    
    if (charCode >= 65 && charCode <= 90) { // Mayúsculas (A-Z)
      encryptedCharCode = ((charCode - 65 + key) % 26) + 65;
    } else if (charCode >= 97 && charCode <= 122) { // Minúsculas (a-z)
      encryptedCharCode = ((charCode - 97 + key) % 26) + 97;
    } else if (charCode >= 48 && charCode <= 57) { // Números (0-9)
      encryptedCharCode = ((charCode - 48 + key) % 10) + 48;
    } else {
      encryptedCharCode = charCode; // Caracteres que no son letras ni números
    }
    
    encryptedMessage += String.fromCharCode(encryptedCharCode);
  }
  
  return encryptedMessage;
}

export const decrypt = (encryptedMessage, key) => {
  let decryptedMessage = '';
  for (let i = 0; i < encryptedMessage.length; i++) {
    const char = encryptedMessage[i];
    const charCode = char.charCodeAt(0);
    let decryptedCharCode;
    
    if (charCode >= 65 && charCode <= 90) { // Mayúsculas (A-Z)
      decryptedCharCode = ((charCode - 65 - key + 26) % 26) + 65;
    } else if (charCode >= 97 && charCode <= 122) { // Minúsculas (a-z)
      decryptedCharCode = ((charCode - 97 - key + 26) % 26) + 97;
    } else if (charCode >= 48 && charCode <= 57) { // Números (0-9)
      decryptedCharCode = ((charCode - 48 - key + 10) % 10) + 48;
    } else {
      decryptedCharCode = charCode; // Caracteres que no son letras ni números
    }
    
    decryptedMessage += String.fromCharCode(decryptedCharCode);
  }
  
  return decryptedMessage;
}

// Ejemplo de uso
// const message = 'asd12345'
// const key = 3;

// const encryptedMessage = encrypt(message, key)
// const decryptedMessage = decrypt(encryptedMessage, key)
