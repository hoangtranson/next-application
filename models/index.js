const knex = require('knex')({
    client: 'sql',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'admin',
        database: 'template1',
        charset: 'utf8'
    }
});

const bookshelf = require('bookshelf')(knex);

export const User = bookshelf.model('User', {
    tableName: 'users',
    todos() {
        return this.hasMany(Todos)
    }
});

const Todos = bookshelf.model('Post', {
    tableName: 'todos',
    hasTimestamps: true,
    hasTimestamps: ['created_at', 'updated_at']
});