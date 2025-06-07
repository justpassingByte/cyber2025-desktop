import { app, dialog } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import xamppService from './services/xampp';

// Import the installer module using require since it's a CommonJS module
const xamppInstaller = require('../../installer/installer');

export class SetupManager {
  private static instance: SetupManager;
  private firstRunFilePath: string;
  private isFirstRun: boolean = false;

  private constructor() {
    // Initialize first run check file path
    this.firstRunFilePath = path.join(app.getPath('userData'), 'first-run.json');
    this.isFirstRun = !fs.existsSync(this.firstRunFilePath);
  }

  public static getInstance(): SetupManager {
    if (!SetupManager.instance) {
      SetupManager.instance = new SetupManager();
    }
    return SetupManager.instance;
  }

  /**
   * Check if this is the first time the app is running
   */
  public isFirstRunCheck(): boolean {
    return this.isFirstRun;
  }

  /**
   * Mark the first run as complete
   */
  private markFirstRunComplete(): void {
    const data = {
      firstRunComplete: true,
      timestamp: new Date().toISOString(),
      appVersion: app.getVersion()
    };

    fs.writeFileSync(this.firstRunFilePath, JSON.stringify(data, null, 2));
    this.isFirstRun = false;
  }

  /**
   * Perform initial setup tasks
   */
  public async performFirstRunSetup(): Promise<boolean> {
    // Nếu đã setup hoặc đã có XAMPP thì bỏ qua popup
    if (!this.isFirstRun || xamppInstaller.isXamppInstalled()) {
      this.markFirstRunComplete();
      return true;
    }

    try {
      console.log('Performing first-run setup...');

      // Show welcome message
      await dialog.showMessageBox({
        type: 'info',
        title: 'Welcome to Cybercafe Management System',
        message: 'We will set up your system for first use. This includes installing XAMPP for database functionality.',
        buttons: ['Continue']
      });

      // Install XAMPP if needed
      if (!xamppInstaller.isXamppInstalled()) {
        const installConfirm = await dialog.showMessageBox({
          type: 'question',
          title: 'XAMPP Installation Required',
          message: 'This application requires XAMPP to run the database. Would you like to download and install it now?',
          buttons: ['Yes', 'No'],
          defaultId: 0,
          cancelId: 1
        });

        if (installConfirm.response === 0) {
          const installSuccess = await xamppInstaller.runInstaller();
          
          if (!installSuccess) {
            await dialog.showMessageBox({
              type: 'error',
              title: 'Installation Failed',
              message: 'Failed to install XAMPP. Please install it manually and restart the application.',
              buttons: ['OK']
            });
            
            return false;
          }
        } else {
          await dialog.showMessageBox({
            type: 'warning',
            title: 'Installation Skipped',
            message: 'XAMPP installation was skipped. Some features may not work correctly without it.',
            buttons: ['OK']
          });
          
          return false;
        }
      }

      // Initialize database
      try {
        // First start MySQL service
        await xamppService.startMySql();
        
        // Then create the database if it doesn't exist
        const dbInitialized = await xamppService.initializeDatabase();
        
        if (!dbInitialized) {
          throw new Error('Failed to initialize database');
        }
      } catch (error) {
        await dialog.showMessageBox({
          type: 'error',
          title: 'Database Initialization Failed',
          message: `Failed to initialize the database: ${error instanceof Error ? error.message : 'Unknown error'}`,
          buttons: ['OK']
        });
        
        return false;
      }

      // Setup is complete
      this.markFirstRunComplete();
      
      await dialog.showMessageBox({
        type: 'info',
        title: 'Setup Complete',
        message: 'Setup has completed successfully. The application will now start.',
        buttons: ['OK']
      });
      
      return true;
    } catch (error) {
      console.error('Error during setup:', error);
      
      await dialog.showMessageBox({
        type: 'error',
        title: 'Setup Failed',
        message: `An error occurred during setup: ${error instanceof Error ? error.message : 'Unknown error'}`,
        buttons: ['OK']
      });
      
      return false;
    }
  }
}

export default SetupManager.getInstance(); 