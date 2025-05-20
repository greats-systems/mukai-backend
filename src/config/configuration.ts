// src/config/configuration.ts
export default () => ({    DB_REST_URL: process.env.ENV =='local'?process.env.LOCAL_DB_REST_URL:process.env.PROD_DB_REST_URL,
});

