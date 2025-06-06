const { app, dialog } = require('electron');
const { execSync, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { createWriteStream } = require('fs');

class XamppInstaller {
  constructor() {
    this.xamppUrl = {
      win32: 'https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/8.2.12/xampp-windows-x64-8.2.12-0-VS16-installer.exe',
      darwin: 'https://sourceforge.net/projects/xampp/files/XAMPP%20Mac%20OS%20X/8.2.12/xampp-osx-8.2.12-0-installer.dmg',
      linux: 'https://sourceforge.net/projects/xampp/files/XAMPP%20Linux/8.2.12/xampp-linux-x64-8.2.12-0-installer.run'
    };
    
    this.downloadPath = path.join(app.getPath('temp'), 'xampp-installer');
    this.installerFileName = this.getInstallerFileName();
    this.fullInstallerPath = path.join(this.downloadPath, this.installerFileName);
  }
  
  getInstallerFileName() {
    switch (process.platform) {
      case 'win32': return 'xampp-installer.exe';
      case 'darwin': return 'xampp-installer.dmg';
      default: return 'xampp-installer.run';
    }
  }
  
  getXamppDownloadUrl() {
    return this.xamppUrl[process.platform] || this.xamppUrl['linux'];
  }
  
  async ensureDirectoryExists() {
    if (!fs.existsSync(this.downloadPath)) {
      fs.mkdirSync(this.downloadPath, { recursive: true });
    }
  }
  
  async downloadXampp() {
    const url = this.getXamppDownloadUrl();
    
    console.log(`Downloading XAMPP from ${url}`);
    
    return new Promise((resolve, reject) => {
      this.ensureDirectoryExists();
      
      const file = createWriteStream(this.fullInstallerPath);
      https.get(url, (response) => {
        const totalSize = parseInt(response.headers['content-length'], 10);
        let downloadedSize = 0;
        
        response.on('data', (chunk) => {
          downloadedSize += chunk.length;
          const percentage = Math.round((downloadedSize / totalSize) * 100);
          console.log(`Downloaded: ${percentage}%`);
        });
        
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log('Download completed');
          
          // Make the installer executable on Linux
          if (process.platform === 'linux') {
            fs.chmodSync(this.fullInstallerPath, '755');
          }
          
          resolve(this.fullInstallerPath);
        });
      }).on('error', (err) => {
        fs.unlinkSync(this.fullInstallerPath);
        console.error('Error downloading XAMPP:', err);
        reject(err);
      });
    });
  }
  
  async installXampp() {
    console.log('Installing XAMPP...');
    
    return new Promise((resolve, reject) => {
      try {
        let installProcess;
        
        switch (process.platform) {
          case 'win32':
            // Silent installation for Windows
            installProcess = exec(`"${this.fullInstallerPath}" --unattendedmodeui minimal --mode unattended`);
            break;
            
          case 'darwin':
            // For macOS, we open the DMG and then the user needs to install manually
            installProcess = exec(`open "${this.fullInstallerPath}"`);
            dialog.showMessageBox({
              type: 'info',
              title: 'XAMPP Installation',
              message: 'Please follow the instructions in the XAMPP installer that has opened.',
              buttons: ['OK']
            });
            break;
            
          default: // Linux
            installProcess = exec(`"${this.fullInstallerPath}" --unattendedmodeui minimal --mode unattended`);
            break;
        }
        
        installProcess.stdout.on('data', (data) => {
          console.log(`XAMPP installer output: ${data}`);
        });
        
        installProcess.stderr.on('data', (data) => {
          console.error(`XAMPP installer error: ${data}`);
        });
        
        installProcess.on('close', (code) => {
          if (code === 0) {
            console.log('XAMPP installed successfully');
            resolve(true);
          } else {
            console.error(`XAMPP installation failed with code ${code}`);
            reject(new Error(`XAMPP installation failed with code ${code}`));
          }
        });
        
      } catch (error) {
        console.error('Error installing XAMPP:', error);
        reject(error);
      }
    });
  }
  
  isXamppInstalled() {
    try {
      switch (process.platform) {
        case 'win32':
          return fs.existsSync('C:\\xampp\\mysql\\bin\\mysqld.exe');
          
        case 'darwin':
          return fs.existsSync('/Applications/XAMPP/xamppfiles/bin/mysql');
          
        default: // Linux
          return fs.existsSync('/opt/lampp/bin/mysql');
      }
    } catch (error) {
      console.error('Error checking if XAMPP is installed:', error);
      return false;
    }
  }
  
  async runInstaller() {
    try {
      if (this.isXamppInstalled()) {
        console.log('XAMPP is already installed');
        return true;
      }
      
      const installerPath = await this.downloadXampp();
      const installed = await this.installXampp();
      
      if (installed) {
        // Cleanup the installer file after successful installation
        fs.unlinkSync(installerPath);
      }
      
      return installed;
    } catch (error) {
      console.error('Error running XAMPP installer:', error);
      return false;
    }
  }
}

module.exports = new XamppInstaller(); 