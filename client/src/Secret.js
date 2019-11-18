import React, { Component } from 'react';

class Secret extends Component {

    render() {
        const { secret } = this.props;
        return (
            <p>Secret: {secret}</p>
        );
    }
}

export default Secret;
