const dbClient = require('./config');

const query = async (queryText, param) => {
    return new Promise((resolve, reject) => {
        dbClient.query(queryText, param)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            })
    })
}

module.exports =  query;