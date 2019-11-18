import React, { Component } from 'react';

import { initServerSide, runServerSideAsync } from './privy-client';
import Secret from './Secret';

/* eslint-disable no-unused-vars */
initServerSide(() => {
    import secret from '../secret';
    console.log ("secret", secret);
});
/* eslint-enable no-unused-vars */

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            processVersion: "Please wait...",
            secret: "Shhh...",
        };
    }
    async componentDidMount() {
        console.log("I am RUNNING on the CLIENT.");
        /* eslint-disable no-unused-vars */
        await runServerSideAsync(async () => console.log("I am RUNNING on the SERVER."));
        const processVersion = await runServerSideAsync(async () => process.version);
        const secret = await runServerSideAsync(async () => secret);
        /* eslint-enable no-unused-vars */
        this.setState({processVersion, secret});
    }

    render() {
        const { processVersion, secret } = this.state;
        return (
            <div className="App">
                <header className="App-header">
                    <p>Node version: {processVersion}</p>
                    <Secret secret={secret} />
                </header>
            </div>
        );
    }
}

export default App;
