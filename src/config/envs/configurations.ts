export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  db: {
    type: process.env.DB_TYPE,
    synchronize: false,
    logging: true,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    extra: {
      connectionLimit: 10,
    },
    autoLoadEntities: true,
  },
});
