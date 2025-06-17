const http = require('http');
const fs = require('fs');
const path = 'data.json';

const server = http.createServer((req, res) => {
    // Ajoute ces lignes pour autoriser CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Répondre aux requêtes OPTIONS (pré-vol CORS)
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

            // Lire le fichier JSON existant
            fs.readFile(filename, 'utf8', (err, data) => {
                let jsonData = {};
                if (!err && data) {
                    try {
                        jsonData = JSON.parse(data);
                    } catch (e) {
                        // fichier corrompu, on écrase
                        jsonData = {};
                    }
                }
                // Mettre à jour les données JSON avec les nouvelles valeurs
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
