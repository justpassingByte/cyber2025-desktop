import { exec, spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { app } from 'electron';

class XamppService {
  private static instance: XamppService;
  private xamppPath: string;
  private isStarted: boolean = false;
  private mysqlProcess: any = null;

  private constructor() {
    // Default XAMPP paths based on OS
    if (process.platform === 'win32') {
      this.xamppPath = 'C:\\xampp';
    } else if (process.platform === 'darwin') {
      this.xamppPath = '/Applications/XAMPP';
    } else {
      this.xamppPath = '/opt/lampp';
    }
    
    console.log('XAMPP path:', this.xamppPath);
  }

  public static getInstance(): XamppService {
    if (!XamppService.instance) {
      XamppService.instance = new XamppService();
    }
    return XamppService.instance;
  }

  public setXamppPath(path: string): void {
    this.xamppPath = path;
    console.log('XAMPP path updated to:', path);
  }

  public async startMySql(): Promise<boolean> {
    if (this.isStarted) {
      console.log('MySQL is already running');
      return true;
    }

    try {
      console.log('Starting MySQL from XAMPP...');
      
      if (process.platform === 'win32') {
        // Windows: use the executable
        const mysqlPath = path.join(this.xamppPath, 'mysql/bin/mysqld.exe');
        
        if (!fs.existsSync(mysqlPath)) {
          throw new Error(`MySQL executable not found at ${mysqlPath}`);
        }
        
        this.mysqlProcess = spawn(mysqlPath, ['--defaults-file=' + path.join(this.xamppPath, 'mysql/bin/my.ini')], {
          detached: false
        });
      } else {
        // macOS and Linux
        const xamppControlPath = process.platform === 'darwin' 
          ? path.join(this.xamppPath, 'xamppfiles/xampp')
          : path.join(this.xamppPath, 'lampp');
          
        if (!fs.existsSync(xamppControlPath)) {
          throw new Error(`XAMPP control script not found at ${xamppControlPath}`);
        }
        
        this.mysqlProcess = spawn(xamppControlPath, ['startmysql']);
      }

      // Log MySQL process output
      if (this.mysqlProcess && this.mysqlProcess.stdout) {
        this.mysqlProcess.stdout.on('data', (data: Buffer) => {
          console.log(`MySQL stdout: ${data}`);
        });
      }
      
      if (this.mysqlProcess && this.mysqlProcess.stderr) {
        this.mysqlProcess.stderr.on('data', (data: Buffer) => {
          console.error(`MySQL stderr: ${data}`);
        });
      }

      // Check if MySQL is actually running
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for MySQL to start
      const isRunning = await this.checkMySqlStatus();
      
      if (isRunning) {
        console.log('MySQL started successfully');
        this.isStarted = true;
        return true;
      } else {
        console.error('MySQL failed to start');
        return false;
      }
    } catch (error) {
      console.error('Error starting MySQL:', error);
      return false;
    }
  }

  public async stopMySql(): Promise<boolean> {
    if (!this.isStarted) {
      console.log('MySQL is not running');
      return true;
    }

    try {
      console.log('Stopping MySQL...');
      
      if (process.platform === 'win32') {
        const mysqlAdminPath = path.join(this.xamppPath, 'mysql/bin/mysqladmin.exe');
        
        if (!fs.existsSync(mysqlAdminPath)) {
          throw new Error(`MySQL admin executable not found at ${mysqlAdminPath}`);
        }
        
        exec(`"${mysqlAdminPath}" -u root shutdown`);
      } else {
        const xamppControlPath = process.platform === 'darwin' 
          ? path.join(this.xamppPath, 'xamppfiles/xampp')
          : path.join(this.xamppPath, 'lampp');
          
        exec(`${xamppControlPath} stopmysql`);
      }
      
      if (this.mysqlProcess) {
        this.mysqlProcess.kill();
        this.mysqlProcess = null;
      }
      
      this.isStarted = false;
      console.log('MySQL stopped successfully');
      return true;
    } catch (error) {
      console.error('Error stopping MySQL:', error);
      return false;
    }
  }

  private async checkMySqlStatus(): Promise<boolean> {
    return new Promise((resolve) => {
      const checkCommand = process.platform === 'win32'
        ? `"${path.join(this.xamppPath, 'mysql/bin/mysqladmin.exe')}" -u root ping`
        : 'mysqladmin -u root ping';
      
      exec(checkCommand, (error) => {
        if (error) {
          console.error('MySQL check failed:', error);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
  
  public async initializeDatabase(): Promise<boolean> {
    try {
      console.log('Initializing cybercafe database...');
      
      const mysqlPath = process.platform === 'win32'
        ? path.join(this.xamppPath, 'mysql/bin/mysql.exe')
        : 'mysql';
      
      // Create database if not exists
      const createDbCommand = `"${mysqlPath}" -u root -e "CREATE DATABASE IF NOT EXISTS cybercafe;"`;
      
      return new Promise((resolve) => {
        exec(createDbCommand, (error) => {
          if (error) {
            console.error('Error creating database:', error);
            resolve(false);
          } else {
            console.log('Database initialized successfully');
            resolve(true);
          }
        });
      });
    } catch (error) {
      console.error('Database initialization error:', error);
      return false;
    }
  }
}

export default XamppService.getInstance(); 