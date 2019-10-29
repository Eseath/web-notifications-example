const fs = require('fs');

exports.index = (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(fs.readFileSync('./public/index.html', { encoding: 'utf-8' }));
};
