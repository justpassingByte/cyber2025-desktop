import { DataSource, Repository, EntityTarget, ObjectLiteral } from 'typeorm';
import 'reflect-metadata';
import { Customer, Transaction, Session, Computer, Branch, Staff, Inventory, MenuCategory, FoodDrink, Combo, ComboDetail } from '../models';
import { Log } from '../models/log';
import { SystemLog } from '../models/SystemLog';
import { CustomerLog } from '../models/CustomerLog';

class DatabaseService {
  private dataSource: DataSource | null = null;
  private static instance: DatabaseService;
  private isConnected: boolean = false;

  private constructor() {
    console.log('Database service initialized');
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async connect(): Promise<void> {
    try {
      // console.log('Connecting to database...');

      // Create DataSource with MySQL
      this.dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'cybercafe',
        entities: [
          Customer, Transaction, Session, Computer, Branch, Staff, Inventory, Log,
          MenuCategory, FoodDrink, Combo, ComboDetail, SystemLog, CustomerLog
        ],
        synchronize: true,
        logging: ['error'], // Tắt log query, chỉ log lỗi
      });

      await this.dataSource.initialize();
      this.isConnected = true;
      // console.log('Connected to MySQL database successfully');

      // Test connection by getting a repository
      const testRepo = this.dataSource.getRepository(Customer);
      const count = await testRepo.count();
      // console.log(`Repository test successful (${count} customers found)`);
    } catch (error) {
      console.error('MySQL connection error:', error);
      this.isConnected = false;
      throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public getRepository<T extends ObjectLiteral>(entity: EntityTarget<T>): Repository<T> {
    if (!this.isConnected || !this.dataSource) {
      throw new Error('Database connection not established');
    }
    return this.dataSource.getRepository(entity);
  }

  /**
   * Truy cập trực tiếp DataSource để thực hiện các raw query
   * @returns DataSource instance
   */
  public getConnection(): DataSource {
    if (!this.isConnected || !this.dataSource) {
      throw new Error('Database connection not established');
    }
    return this.dataSource;
  }

  public async disconnect(): Promise<void> {
    if (this.dataSource && this.isConnected) {
      await this.dataSource.destroy();
      this.isConnected = false;
      console.log('Disconnected from MySQL database');
    }
  }

  public isConnectedToDatabase(): boolean {
    return this.isConnected;
  }
}

export default DatabaseService.getInstance(); 