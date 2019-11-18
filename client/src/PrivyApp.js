import React, { Component, Fragment } from 'react';

import { withPrivyClient } from './privy-client-react';

import App from './App';

class PrivyApp extends Component {

    render() {
        const { isConnected } = this.props;
        return (
            <Fragment>
                {
                    !!isConnected &&
                    <App />
                }
            </Fragment>
        );
    }
}

export default withPrivyClient(PrivyApp);
