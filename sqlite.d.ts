export function DEBUG(isDebug: boolean): void;
export function openDatabase(params: DatabaseParams): Promise<SQLiteDatabase>;
export function deleteDatabase(params: DatabaseParams): Promise<void>;
export type Location = "default" | "Library" | "Documents" | "Shared";
export interface DatabaseOptionalParams {
    createFromLocation?: number | string | undefined;
    // Database encryption pass phrase
    key?: string | undefined;
    readOnly?: boolean | undefined;
}

export type DatabaseParams = DatabaseParamsIOS | DatabaseParamsAndroid;

export interface DatabaseParamsIOS extends DatabaseOptionalParams {
    name: string;
    /**
     * Affects iOS database file location
     * 'default': Library/LocalDatabase subdirectory - NOT visible to iTunes and NOT backed up by iCloud
     * 'Library': Library subdirectory - backed up by iCloud, NOT visible to iTunes
     * 'Documents': Documents subdirectory - visible to iTunes and backed up by iCloud
     */
    location: Location;
}

export interface DatabaseParamsAndroid extends DatabaseOptionalParams {
    name: string;
}

export interface ResultSet {
    insertId: number;
    rowsAffected: number;
    rows: ResultSetRowList;
}

export interface ResultSetRowList {
    length: number;
    raw(): any[];
    item(index: number): any;
}

export enum SQLErrors {
    UNKNOWN_ERR = 0,
    DATABASE_ERR = 1,
    VERSION_ERR = 2,
    TOO_LARGE_ERR = 3,
    QUOTA_ERR = 4,
    SYNTAX_ERR = 5,
    CONSTRAINT_ERR = 6,
    TIMEOUT_ERR = 7,
}

export interface SQLError {
    code: number;
    message: string;
}

export type StatementCallback = (transaction: Transaction, resultSet: ResultSet) => void;
export type StatementErrorCallback = (transaction: Transaction, error: SQLError) => void;
export interface Transaction {
    executeSql(sqlStatement: string, arguments?: any[]): Promise<[Transaction, ResultSet]>;
}

export type TransactionCallback = (transaction: Transaction) => void;
export type TransactionErrorCallback = (error: SQLError) => void;

export interface SQLiteDatabase {
    dbname: string;

    transaction(scope: (tx: Transaction) => void): Promise<Transaction>;
    readTransaction(scope: (tx: Transaction) => void): Promise<Transaction>;
    close(): Promise<void>;
    executeSql(statement: string, params?: any[]): Promise<[ResultSet]>;
    
    attach(nameToAttach: string, alias: string): Promise<void>;

    detach(alias: string): Promise<void>;
}
