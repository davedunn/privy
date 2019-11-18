# Privy (pre-release)

A private channel between your server and client code.

## The Idea

Node.js allows full-stack developers to use the same basic JavaScript programming language on the client and the server.

Babel makes it possible for us to use precisely the latest JavaScript syntax across all client platforms and also the server.

Privy takes that a step further and allows you to securely commingle server code and client code.

## The Benefits

You can think of Privy as an API but I think of it more as syntactical sugar that allows you to seamlessly pass variables and asynchronous callbacks in a way that is very fluid for the programmer.

Privy uses JSON and WebSockets to communicate in a way that is lightweight and realtime.

## How it Works

Privy consists of three primary components: privy-server, privy-client and privy-babel-plugin.

### privy-server

The privy-server component is a WebSocket event listener that works with any Node.js HTTP or HTTPS server, such as an Express application. It can run standalone or alongside your REST or Graph API.

### privy-client

The privy-client component is a persistent WebSocket singleton that implements both the request-response and the publish-subscribe messaging patterns. It is exposed as an async Javascript function.

### privy-babel-plugin

The privy-babel-plugin component identifies and separates your server code from the client code during your build process. It requires very minimal syntax to implement.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
Give examples
```

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Privy is currently in pre-release. We do not currently recommend using it in production.

## Built With

### Required technologies

* [Babel](https://babeljs.io) - Used to separate the server code from client code during your build process
* [Node.js](https://maven.apache.org/) - Server-side code execution
* [ws](https://www.npmjs.com/package/ws) - Server-side WebSocket library

### Optional technologies

* [Express](https://expressjs.com) - Server-side web framework used for demo
* [React](https://reactjs.org) - Client-side UI library used for demo

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/davedunn/privy/tags).

## Authors

* **Dave Dunn** - *Initial work* - [davedunn](https://github.com/davedunn)

See also the list of [contributors](https://github.com/davedunn/privy/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
