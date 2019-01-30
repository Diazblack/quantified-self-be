// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/quantified_self',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true

  },

  production: {
    client: 'pg',
    connection: 'postgres://txncrwljhgvhww:425c16ca117ebe554e7f1b4d120a0846345633dfe088c06de0aff2715e12cfaf@ec2-107-20-185-27.compute-1.amazonaws.com:5432/dcl8nil3b9sla3',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    ssl: true
  }
};
