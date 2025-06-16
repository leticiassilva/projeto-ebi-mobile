declare module 'expo-sqlite' {
  export interface SQLTransaction {
    executeSql: (
      sqlStatement: string, 
      args?: any[], 
      success?: (transaction: SQLTransaction, resultSet: SQLResultSet) => void, 
      error?: (transaction: SQLTransaction, error: Error) => void
    ) => void;
  }

  export interface SQLResultSet {
    insertId?: number;
    rowsAffected: number;
    rows: {
      length: number;
      item: (index: number) => any;
    };
  }

  export interface SQLiteDatabase {
    transaction: (
      callback: (transaction: SQLTransaction) => void, 
      error?: (error: Error) => void, 
      success?: () => void
    ) => void;
  }

  export function openDatabase(name: string): SQLiteDatabase;

  export function openDatabaseAsync(DB_NAME: string) {
    throw new Error('Function not implemented.');
  }
} 