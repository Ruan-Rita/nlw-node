import { Connection, createConnection, getConnectionOptions } from 'typeorm';


// createConnections();
export default async (): Promise<Connection> => {
    const defaultOptions = await getConnectionOptions();

    Object.assign(defaultOptions,{
        database: process.env.NODE_ENV === "test" ? 
        "./src/database/database.test.sqlite" 
        : defaultOptions.database
    })

    return createConnection();
}