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

module.exports = function models(bookshelf) {

    const User = bookshelf.model('User', {
        tableName: 'users'
    });

    return {
        User
    };
}(bookshelf);
