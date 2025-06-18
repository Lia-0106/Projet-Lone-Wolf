const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    // autorise requêtes externes
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/update') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            const newData = JSON.parse(body);
            const filename = newData.filename || 'data.json';
            delete newData.filename;

            // Lire fichier JSON
            fs.readFile(filename, 'utf8', (err, data) => {
                let jsonData = {};
                if (!err && data) {
                    try {
                        jsonData = JSON.parse(data);
                    } catch (e) {
                        jsonData = {};
                    }
                }
                // Maj données JSON
                jsonData = { ...jsonData, ...newData };

                // Écrire le fichier JSON modifié
                fs.writeFile(filename, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({error: 'Failed to write file'}));
                        return;
                    }
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({success: true}));
                });
            });
        });
    } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Not found'}));
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
