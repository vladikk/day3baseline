import { Pool } from 'pg';

export const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'postgres',
    password: process.env.DB_PWD || 'TopS3cret',
    port: parseInt(process.env.DB_PORT || '5432')
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
