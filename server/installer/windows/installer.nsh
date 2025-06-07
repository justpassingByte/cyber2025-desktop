!macro customInit
  ; Add custom initialization code here
  DetailPrint "Welcome to the Cybercafe Management System installer..."
  DetailPrint "This installer will set up the application and required dependencies."
!macroend

!macro customInstall
  ; Custom installation steps
  DetailPrint "Checking for XAMPP installation..."
  
  ; Check if XAMPP is installed
  IfFileExists "C:\xampp\mysql\bin\mysqld.exe" XamppInstalled XamppNotInstalled
  
  XamppNotInstalled:
    DetailPrint "XAMPP not found. The application will prompt to install it on first run."
    MessageBox MB_YESNO "This application requires XAMPP for database functionality.$\n$\nWould you like to download and install XAMPP now?" IDYES DownloadXampp IDNO SkipXampp
    
    DownloadXampp:
      DetailPrint "Downloading XAMPP installer..."
      inetc::get /CAPTION "Downloading XAMPP" "https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/8.2.12/xampp-windows-x64-8.2.12-0-VS16-installer.exe" "$TEMP\xampp-installer.exe" /END
      Pop $0
      StrCmp $0 "OK" +3
        MessageBox MB_OK "Failed to download XAMPP: $0"
        Goto SkipXampp
      
      DetailPrint "Running XAMPP installer..."
      ExecWait '"$TEMP\xampp-installer.exe" --unattendedmodeui minimal --mode unattended' $0
      DetailPrint "XAMPP installer returned: $0"
      Delete "$TEMP\xampp-installer.exe"
      
    SkipXampp:
      DetailPrint "Continuing with installation..."
  
  XamppInstalled:
    DetailPrint "XAMPP is already installed."
    
  ; Create MySQL database if XAMPP is installed
  IfFileExists "C:\xampp\mysql\bin\mysqld.exe" +1 FinishCustomInstall
  DetailPrint "Checking if MySQL is running..."
  nsExec::ExecToStack '"C:\xampp\mysql\bin\mysqladmin.exe" -u root ping'
  Pop $0  ; Return value
  Pop $1  ; Output
  
  StrCmp $0 "0" MySQLRunning MySQLNotRunning
  
  MySQLNotRunning:
    DetailPrint "Starting MySQL..."
    nsExec::ExecToStack '"C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini"'
    Sleep 5000  ; Wait for MySQL to start
    
  MySQLRunning:
    DetailPrint "Creating database..."
    nsExec::ExecToStack '"C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS cybercafe;"'
    Pop $0  ; Return value
    Pop $1  ; Output
    DetailPrint "Database creation result: $0"
    
  FinishCustomInstall:
    DetailPrint "Custom installation completed."
!macroend

!macro customUnInstall
  ; Custom uninstallation steps (we don't remove XAMPP as it may be used by other applications)
  MessageBox MB_YESNO "Would you like to keep the MySQL database? $\nThis will preserve your data for future reinstallations." IDYES KeepDatabase IDNO RemoveDatabase
  
  RemoveDatabase:
    IfFileExists "C:\xampp\mysql\bin\mysql.exe" +1 KeepDatabase
    DetailPrint "Removing database..."
    nsExec::ExecToStack '"C:\xampp\mysql\bin\mysql.exe" -u root -e "DROP DATABASE IF EXISTS cybercafe;"'
    Pop $0  ; Return value
    DetailPrint "Database removal result: $0"
  
  KeepDatabase:
    DetailPrint "Custom uninstallation completed."
!macroend 