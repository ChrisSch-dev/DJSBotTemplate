const Tables = require('./Schemas');
const pg = require('pg');
const Client = require('./Client')

module.exports = class Database {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client;
        this.manager = new pg.Client(this.client.config.database.postgresql);

        this.manager.on('end', () => {
            this.client.logger.log('PostgreSQL - WARN', 'Disconnected from PostgreSQL Database!')
        })

        this.manager.on('error', (err) => {
            this.client.logger.error(err.stack)
        });
    }
    async connect() {
        this.client.logger.log('PostgreSQL', 'Connecting to PostgreSQL Database')
        await this.manager.connect(err => {
            if (err) {
                this.client.logger.log('PostgreSQL', 'Failed to establish a connection to PostgreSQL Database')
                this.client.logger.error(err.stack)
                return
            };
            this.client.logger.log('PostgreSQL', 'Successfully connected to PostgreSQL Database')
        })

        await Promise.all([
            Tables.map(({ name, values }) => { return this.manager.query(`CREATE TABLE IF NOT EXISTS ${name}(${values.join(', ')})`) }),
        ]).catch(this.client.logger.error)
    }
    async query(query = '', values = []) {
        const result = await this.manager.query(query, values).catch(err => {
            console.log(query);
            this.client.logger.error(err.stack)
        })

        if (!result) return null;

        return result;
    }
}