import { ipcMain } from 'electron';
import path from 'path';
import fs from 'fs/promises';
import { app } from 'electron';

export function setupImageHandlers() {
  ipcMain.handle('save-food-image', async (_event, base64Image: string) => {
    try {
      const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 image format');
      }

      const imageBuffer = Buffer.from(matches[2], 'base64');
      const imageExtension = matches[1].split('/')[1] || 'png';
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${imageExtension}`;
      
      // Define the path where the image will be saved on the server (consistent path)
      // Corrected: Path should be relative to the server's root `dist` folder
      const imageDir = path.join(__dirname, '..', '..', 'public', 'assets', 'food_images');
      const imagePath = path.join(imageDir, filename);

      // Ensure the directory exists
      await fs.mkdir(imageDir, { recursive: true });

      await fs.writeFile(imagePath, imageBuffer);
      console.log(`[ImageHandler] Image saved to ABSOLUTE PATH: ${imagePath}`); // More verbose log

      // Return the full HTTP URL that can be used by the client over LAN
      // IMPORTANT: Set the SERVER_LAN_IP environment variable on your server machine
      // (e.g., in a .env file or before starting the app).
      // Ensure port 3001 is open in your server's firewall.
      const serverIp = process.env.SERVER_LAN_IP || 'localhost'; // Fallback to localhost for development
      const imageUrl = `http://${serverIp}:3001/assets/food_images/${filename}`;
      return imageUrl;
    } catch (error) {
      console.error('Error saving food image:', error);
      throw new Error('Failed to save image');
    }
  });
} 