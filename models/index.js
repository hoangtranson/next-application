const knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'admin',
        database: 'nextapp',
        charset: 'utf8'
    }
});

const bookshelf = require('bookshelf')(knex);

export const User = bookshelf.model('User', {
    tableName: 'users'
});

const Todos = bookshelf.model('Post', {
    tableName: 'todos',
    hasTimestamps: true,
    hasTimestamps: ['created_at', 'updated_at']
});