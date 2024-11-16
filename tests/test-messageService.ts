import { messageService } from '../src/services/messageService';

describe('messageService', () => {
  describe('encryptMessage', () => {
    it('should encrypt a message and return the encrypted data with a key', async () => {
      // Mock input
      const message = "Hello, World!";
      
      // Act
      const result = await messageService.encryptMessage(message);
      
      // Assert
      // Check that 'result' contains both `encrypted` and `key`
      expect(result).toHaveProperty('encrypted');
      expect(result).toHaveProperty('key');

      // Validate `encrypted` structure: "IV:EncryptedData"
      const [iv, encryptedData] = result.encrypted.split(':');
      expect(iv).toHaveLength(24); // IV is 96 bits = 12 bytes = 24 hex chars
      expect(encryptedData).toBeDefined();
      expect(encryptedData.length).toBeGreaterThan(0);

      // Validate `key` length: 32 bytes = 64 hex chars
      expect(result.key).toHaveLength(64);
    });
  });
});
