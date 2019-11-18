const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));
app.get('/ping', (req, res) => res.send("pong"));

const server = http.Server(app);
const wss = new WebSocket.Server({server});
wss.addListener('connection', async (ws) => {
    console.log('privy client connected');
    ws.on('disconnect', function() {
        console.log('privy client disconnected');
    });
    ws.on('message', async (json) => {
        console.log("privy message received", json);
        let data = null;
        try {
            data = JSON.parse(json);
        } catch (e) {
            console.trace(e, json);
            ws.terminate();
        }
        const { type } = data;
        if (type === 'privy') {
            const { requestId, moduleName, exportName } = data;
            try {
                const module = require(path.join(__dirname, 'privy', moduleName));
                const exportAsync = module[exportName];
                const responseData = await exportAsync();
                if (requestId != null) {
                    const json = JSON.stringify({type: 'privy', requestId, responseData});
                    ws.send(json);
                    console.log("privy message sent", json);
                }
            } catch (e) {
                console.trace(e, data);
                ws.terminate();
            }
        }
    });
});
server.listen(process.env.PORT || 8080);
