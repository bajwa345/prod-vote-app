exports.dbConfig = {
    server: 'voogle.database.windows.net',
    database: "dbvoogle",
    user: "usman",
    password: "Zxcv@1234",
    port: 1433,
    requestTimeout: 300000,
    connectionTimeout: 300000,
    driver: "tedious",
    //stream: false,
    //options: { encrypt: false, enableArithAbort: false, instanceName: 'SQLEXPRESS' },
    options: { encrypt: true, packetSize: 28368, enableArithAbort: false },
    pool: { max: 600, min: 0, idleTimeoutMills: 20000 },
  };

  /*exports.dbConfig = {
    server: 'SQL5105.site4now.net',
    database: "db_a8877c_dbvoogle",
    user: "db_a8877c_dbvoogle_admin",
    password: "Zxcv1234@",
    port: 1433,
    requestTimeout: 300000,
    connectionTimeout: 300000,
    //driver: "tedious",
    //stream: false,
    //options: { encrypt: false, enableArithAbort: false, instanceName: 'SQLEXPRESS' },
    options: { encrypt: false, enableArithAbort: false },
    pool: { max: 100, min: 0, idleTimeoutMills: 300000 },
  };*/

/*exports.dbConfig = {
    server: 'localhost',
    database: "db-voogle",
    user: "sa",
    password: "123456",
    port: 1433,
    requestTimeout: 300000,
    connectionTimeout: 300000,
    driver: "tedious",
    //stream: false,
    options: { encrypt: false, enableArithAbort: false, instanceName: 'SQLEXPRESS' },
    pool: { max: 100, min: 0, idleTimeoutMills: 300000 },
  };*/
