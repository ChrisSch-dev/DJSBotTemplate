module.exports = {
    owners: ['592663451978039298'],
    database: {
        postgresql: {
            host: "DB_IP",
            port: "DB_PORT",
            password: "DB_PW",
            database: ENTER_DB_NAME,
            idle_in_transaction_session_timeout: 30000,
            user: "DB_USER"
        },
        redis: {
            host: "DB_IP",
            port: DB_PORT,
            db: ENTER_DB_NUM,
            password: "DB_PW"
        }
    },
    colors: {
        default: 0x5865F2,
        main: 0x292B2F,
        failed: 0xD53B3E,
        green: 0x3FF076,
    },
}