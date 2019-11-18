import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import PrivyClient from './privy-client';

export const withPrivyClient = WrappedComponent => {
    class WithPrivyClient extends Component {
        constructor(props) {
            super(props);
            this.state = {
                isConnected: PrivyClient.connected,
            };
        }
        componentDidMount() {
            PrivyClient.addListener('connect', this.handleConnect);
            PrivyClient.addListener('disconnect', this.handleDisconnect);
            this.setState({isConnected: PrivyClient.connected});
        }
        componentWillUnmount() {
            PrivyClient.removeListener('connect', this.handleConnect);
            PrivyClient.removeListener('disconnect', this.handleDisconnect);
        }

        handleConnect = () => this.setState({isConnected: true});
        handleDisconnect = () => this.setState({isConnected: false});

        render() {
            const { isConnected } = this.state;
            return (
                <WrappedComponent {...this.props} isConnected={isConnected} />
            );
        }
    }
    hoistNonReactStatic(WithPrivyClient, WrappedComponent);
    WithPrivyClient.displayName = `withPrivyClient(${getDisplayName(WrappedComponent)})`;
    return WithPrivyClient;
};

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
