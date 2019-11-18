import { EventEmitter } from 'events';

const ReadyState = {
    CONNECTING: 0, // Socket has been created. The connection is not yet open.
    OPEN: 1,       // The connection is open and ready to communicate.
    CLOSING: 2,    // The connection is in the process of closing.
    CLOSED: 3,     // The connection is closed or couldn't be opened.
};

class MyClient extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(1000);
        this.timerId = null;
        this.ws = null;
        this.connected = null;
        this.sequence = 0;
        this.connect();
    }

    connect = () => {
        const { location: { protocol, host, hostname, port } } = window;
        let url = null;
        if (parseInt(port) === 3000) {
            url = "ws://"+hostname+":8080";
        } else {
            url = (protocol === 'https:' ? 'wss:' : 'ws:')+'//'+host;
        }
        this.ws = new WebSocket(url);
        this.ws.onopen = (event) => {
            console.log('privy client connected');
            document.body.classList.remove("loading");
            this.connected = true;
            if (this.timerId) {
                clearInterval(this.timerId);
                this.timerId = null;
            }
            this.emit('connect');
        };
        this.ws.onclose = (event) => {
            console.log('privy client disconnected');

            document.body.classList.add("loading");

            this.connected = false;
            this.sequence = 0;
            if (!this.timerId) {
                this.ws = null;
                this.timerId = setInterval(() => {
                    this.connect();
                }, 5000);
            }
            this.emit('disconnect');
        };
        this.ws.onmessage = ({ data: json }) => {
            console.log("privy message received", json);
            let data = null;
            try {
                data = JSON.parse(json);
            } catch (e) {
                throw new Error(json);
            }
            const { type } = data;
            if (type === 'privy') {
                const { requestId, responseData } = data;
                const listenerCount = this.listenerCount(requestId);
                if (listenerCount === 0) {
                    return;
                }
                this.emit(requestId, responseData);
            }
        };
    };

    runServerSideAsync = async (x) => {
        if (typeof x === 'string') {
            const requestId = this.sequence++;
            const [ moduleName, exportName ] = x.split(':');
            const text = await new Promise((resolve, reject) => {
                const goodNews = (eventData) => {
                    this.removeListener(requestId, goodNews);
                    this.removeListener('disconnect', badNews);
                    resolve(eventData);
                };
                const badNews = () => {
                    this.removeListener(requestId, goodNews);
                    this.removeListener('disconnect', badNews);
                    reject(new Error("WebSocket disconnected"));
                };
                const doit = () => {
                    this.addListener(requestId, goodNews);
                    this.addListener('disconnect', badNews);
                    const json = JSON.stringify({
                        type: 'privy',
                        requestId,
                        moduleName,
                        exportName,
                    });
                    this.ws.send(json);
                    console.log("privy message sent", json);
                };
                try {
                    if (this.ws.readyState === ReadyState.OPEN) {
                        doit();
                    } else {
                        const queueit = () => {
                            this.removeListener('connect', queueit);
                            doit();
                        };
                        this.addListener('connect', queueit);
                    }
                } catch (e) {
                    reject(e);
                }
            });
            return text;
        } else {
            throw new Error("FAIL");
        }
    };

};

const myClient = new MyClient(); // ES6 singleton pattern (1 of 2)
export const initServerSide = () => {};
export const runServerSideAsync = myClient.runServerSideAsync;
export default myClient; // ES6 singleton pattern (2 of 2)
