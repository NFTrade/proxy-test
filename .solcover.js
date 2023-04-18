module.exports = {
    client: require('ganache-cli'),
    providerOptions: {
        host: "localhost",
        port: 8545,
        network_id: "5",
        fork: "https://rpc.ankr.com/eth_goerli",
    }
};