import React, { useState } from 'react';
import EthereumProvider from '@walletconnect/ethereum-provider';
import Web3 from 'web3';
import {DecentrawebPort, Network } from 'dweb-nft-js'


class WalletConnectProvider {
  constructor() {
    this.web3 = null;
    this.connectedAddress = null;
  }

  async connect() {
    try {
      const provider = await EthereumProvider.init({
        projectId: 'bddf10a62a5a9b248254d1cdab51f24c',
        chains: [5],
        showQrModal: true,
        rpc: {5: 'https://goerli.infura.io/v3/d3616f53b7fc46718004a24ebae0829a'}
      });

      this.walletConnectProvider = provider;
      this.web3 = new Web3(provider);
    } catch (error) {
      console.error('Error initializing WalletConnect:', error);
    }

    if (this.web3) {
      try {
        await this.walletConnectProvider.enable();

        const accounts = await this.web3.eth.getAccounts();

        if (Array.isArray(accounts) && accounts.length > 0) {
          this.connectedAddress = accounts[0];
        } else {
          console.error('No accounts found after enabling wallet.');
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      console.error('Web3 instance is not available.');
    }
  }

  async disconnect() {
    if (this.walletConnectProvider) {
      await this.walletConnectProvider.disconnect();
      this.web3 = null;
      this.connectedAddress = null;
    }
  }

  getAddress() {
    return this.connectedAddress;
  }
}

class NormalProvider {

    constructor() {
        this.web3 = null;
        this.connectedAddress = null;
      }
    
        async connect() {
            try {
                const windowEthereum =
                ((window)["ethereum"]) || undefined
                console.log("🚀 ~ file: WalletConnectButton.js:70 ~ NormalProvider ~ connect ~ windowEthereum:", windowEthereum)
                const windowWeb3 = (window)["web3"]| undefined
                console.log("🚀 ~ file: WalletConnectButton.js:73 ~ NormalProvider ~ connect ~ windowWeb3:", windowWeb3)

                this.normalProvider = windowEthereum;
                this.web3 = new Web3(windowEthereum);

            }catch (error) {
                console.error('Error initializing normal provider:', error);
            }


            if (this.web3) {
                try {
                  await this.normalProvider.enable();
          
                  const accounts = await this.web3.eth.getAccounts();
          
                  if (Array.isArray(accounts) && accounts.length > 0) {
                    this.connectedAddress = accounts[0];
                  } else {
                    console.error('No accounts found after enabling wallet.');
                  }
                } catch (error) {
                  console.error('Error connecting wallet:', error);
                }
              } else {
                console.error('Web3 instance is not available.');
              }
        }   

        async disconnect() {
            if (this.normalProvider) {
              this.web3 = null;
              this.connectedAddress = null;
            }
          }

          getAddress() {
            return this.connectedAddress;
          }
}


const WalletConnectComponent = () => {
  const [walletProvider, setWalletProvider] = useState(null);

  const connectWallet = async () => {
    const provider = new WalletConnectProvider();
    await provider.connect();
    setWalletProvider(provider);
  };

  const normalProvider = async () => {
    console.log("🚀 ~ file: WalletConnectButton.js:101 ~ normalProvider ~ async:")
    const provider = new NormalProvider();
    await provider.connect();
    setWalletProvider(provider);
    console.log("🚀 ~ file: WalletConnectButton.js:92 ~ normalProvider ~ provider:", provider)
  }

  const disconnectWallet = async () => {
    if (walletProvider) {
      await walletProvider.disconnect();
      setWalletProvider(null);
    }
  };

  const sendEth = async () => {
    const { promisify } = require('util');
    // const provider = new WalletConnectProvider();
    const provider = new NormalProvider();
    console.log("🚀 ~ file: WalletConnectButton.js:79 ~ sendEth ~ provider:", provider)
    await provider.connect();
    const web3 = new Web3(provider);
    const setProvider = web3.eth.setProvider(provider)
    console.log("🚀 ~ file: WalletConnectButton.js:82 ~ sendEth ~ web3:", web3)

    const amount = '100000000000'; // 0.0001 ETH in Wei
    const recipientAddress = '0xEe10Dd19dd12adD399685F25D99B17e271eCd28a';

    const senderAddress = walletProvider.getAddress();

     // Define a function to promisify sendTransaction
    // const sendTransactionAsync = async (transactionConfig, web3) => {
    //     const sendTx = promisify(web3.eth.sendTransaction).bind(web3.eth);
    //     try {
    //     const transactionReceipt = await sendTx(transactionConfig);
    //     return transactionReceipt;
    //     } catch (error) {
    //     throw new Error(`Transaction failed: ${error.message}`);
    //     }
    // };

    const sendTransactionAsync = async (txData) => {
        console.log("🚀 ~ file: WalletConnectButton.js:102 ~ sendTransactionAsync ~ txData:", txData)
        try {
            const txHash = await sendRawPayloadAsync({ method: 'eth_sendTransaction', params: [txData] });
            return txHash;
        } catch (error) {
            console.error("Error in sendTransactionAsync:", error);
            throw error;
        }
    }
    
    console.log("🚀 ~ file: WalletConnectButton.js:165 ~ sendTransactionAsync ~ sendTransactionAsync:", sendTransactionAsync)

    const sendRawPayloadAsync = async (payload) => {
        console.log("🚀 ~ file: WalletConnectButton.js:113 ~ sendRawPayloadAsync ~ payload:", payload)
        const { promisify } = require('util');

        try {
            if (!payload.method) {
                throw new Error(`Must supply method in JSONRPCRequestPayload, tried: [${payload}]`);
            }
            
            const payloadWithDefaults = Object.assign({ from:senderAddress ,id: '1', params: [], jsonrpc: '2.0'}, payload);
            console.log("🚀 ~ file: WalletConnectButton.js:120 ~ sendRawPayloadAsync ~ payloadWithDefaults:", payloadWithDefaults)
            console.log("🚀 ~ file: WalletConnectButton.js:132 ~ provider.web3.eth.sendTransaction ~ provider:", provider)
            
                const response = await new Promise((resolve, reject) => {
                  // Send the payload to the provider
                  provider.web3.currentProvider.sendAsync(payload, (error, response) => {
                    if (error) {
                      reject(error);
                    } else {
                      resolve(response);
                    }
                  });
                });
                
                console.log("🚀 ~ file: WalletConnectButton.js:135 ~ sendRawPayloadAsync ~ response:", response)
                if (!response) {
                    throw new Error(`No response`);
                }
                
                const errorMessage = response.error ? response.error.message || response.error : undefined;
                if (errorMessage) {
                    throw new Error(errorMessage);
                }
                
                if (response.result === undefined) {
                    throw new Error(`JSON RPC response has no result`);
                }
    
            return response.result;
        } catch (error) {
            console.error("Error in sendRawPayloadAsync:", error);
            throw error;
        }
    }
    

  if (!senderAddress) {
    console.error('Sender address not available.');
    return;
  }

    try {
      // Prepare transaction configuration
    const transactionConfig = {
        from: senderAddress,
        to: recipientAddress,
        value: amount
      };
  
      // Send transaction
    //   const transactionReceipt = await provider.web3.eth.sendTransaction(transactionConfig)

    //   const signTransaction = await provider.web3.eth.signTransaction(transactionConfig)

    // const signature = await provider.web3.eth.sign("this is data",senderAddress)

    // const txData = {
    //     "from": "0xDaA82A39366AEE651183d9343Ca0e03D7E3d6690",
    //     "value": "40000",
    //     "gas": 50662,
    //     "to": "0x09603cB3eC7A59dF8489e82B503161Ca4A60B516"
    // }

    const txData = {
        "to": "0x09603cB3eC7A59dF8489e82B503161Ca4A60B516",
        "data": "abcd",
        "from": senderAddress,
        "value": "0",
        "gas": "50674"
    }

    const transactionReceiptAsync = await sendTransactionAsync(txData);
    console.log('transactionReceiptAsync receipt:', transactionReceiptAsync);
  
    //   console.log('🚀 ~ file : transactionReceipt sent:', transactionReceipt);
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };

  const NCRNFTTransfer = async () => {
    const web3 = walletProvider.web3; 
    console.log("🚀 ~ file: WalletConnectButton.js:204 ~ NCRNFTTransfer ~ walletProvider:", walletProvider)
    // Nikunj NFT ABI

    const contractNFTABI = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "burn",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "initialOwner",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "ERC721IncorrectOwner",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ERC721InsufficientApproval",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "approver",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidApprover",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidOperator",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidOwner",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "receiver",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidReceiver",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidSender",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ERC721NonexistentToken",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "OwnableInvalidOwner",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "OwnableUnauthorizedAccount",
            "type": "error"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "approved",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "ApprovalForAll",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_fromTokenId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_toTokenId",
                    "type": "uint256"
                }
            ],
            "name": "BatchMetadataUpdate",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_tokenId",
                    "type": "uint256"
                }
            ],
            "name": "MetadataUpdate",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "uri",
                    "type": "string"
                }
            ],
            "name": "safeMint",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "data",
                    "type": "bytes"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "setApprovalForAll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "getApproved",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "isApprovedForAll",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ownerOf",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes4",
                    "name": "interfaceId",
                    "type": "bytes4"
                }
            ],
            "name": "supportsInterface",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]

    const ncrNFTContractAddress = "0x148809D726D6AAd1014880eFb9365e98226E0474"

    const address = walletProvider.getAddress();
    const amountToApprove = 1;

    const ncrNFTContract =  new web3.eth.Contract(contractNFTABI, ncrNFTContractAddress);
    console.log("🚀 ~ file: WalletConnectButton.js:802 ~ NCRTokenTransfer ~ ncrNFTContract:", ncrNFTContract)

    // Call the 'transfer' method
    // await ncrNFTContract.methods.transferFrom(address,"0xfCAc3854AC463aA50da0ffd94d0d50bDEa7457c9",2)
    // .send({ from: address , gas: '80000'})
    // .then((result) => {
    //     console.log("🚀 ~ file: result",result);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    // Call the 'approve' method
    await ncrNFTContract.methods.approve(address, 3)
    .send({ from: address , gas: '80000'})
    .then((result) => {
        console.log("🚀 ~ file: result",result);
      })
      .catch((error) => {
        console.error(error);
      });
      console.log("🚀 ~ file: WalletConnectButton.js:823 ~ NCRNFTTransfer ~  END ___________________:")
      
  } 

  const NCRTokenTransfer = async () => {
    
    const web3 = walletProvider.web3; 
    console.log("🚀 ~ file: WalletConnectButton.js:205 ~ NCRTokenTransfer ~ walletProvider:", walletProvider)
    console.log("🚀 ~ file: WalletConnectButton.js:205 ~ NCRTokenTransfer ~ web3:", web3)

      //   Nikunj Token ABI 
      const contractABI = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "initialSupply",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "allowance",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "needed",
                    "type": "uint256"
                }
            ],
            "name": "ERC20InsufficientAllowance",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "balance",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "needed",
                    "type": "uint256"
                }
            ],
            "name": "ERC20InsufficientBalance",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "approver",
                    "type": "address"
                }
            ],
            "name": "ERC20InvalidApprover",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "receiver",
                    "type": "address"
                }
            ],
            "name": "ERC20InvalidReceiver",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                }
            ],
            "name": "ERC20InvalidSender",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                }
            ],
            "name": "ERC20InvalidSpender",
            "type": "error"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "internalType": "uint8",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]

    const ncrTokenAddress = "0x5546a227E3f2451005471C3aEDE1c9BDC5116682"

    const contract = new web3.eth.Contract(contractABI, ncrTokenAddress);
    console.log("🚀 ~ file: WalletConnectButton.js:84 ~ callContractMethod ~ contract:", contract)

    const address = walletProvider.getAddress();
    console.log("🚀 ~ file: WalletConnectButton.js:535 ~ NCRTokenTransfer ~ address:", address)

    const balanceToken = await contract.methods.balanceOf(address).call()
    console.log("🚀 ~ file: WalletConnectButton.js:539 ~ NCRTokenTransfer ~ balanceToken:", balanceToken/10**18)

    
    const amountToTransferAndApprove = web3.utils.toBN('200000000000000000'); 
    
    // Call the 'approve' method
    const sign = await contract.methods.approve(address, amountToTransferAndApprove).send({ from: address });
    console.log("🚀 ~ file: WalletConnectButton.js:1235 ~ NCRTokenTransfer ~ sign:", sign)

    console.log(`Approved ${amountToTransferAndApprove} tokens for spender: ${address}`);
    
    await contract.methods.transfer('0xf626EFc50Bb587EB496798561B959BA406EDC04a', amountToTransferAndApprove).send({ from: address }).then((result) => {
        // Process the result here
        console.log("🚀 ~ file: result",result);
      })
      .catch((error) => {
        // Handle error here
        console.error(error);
      });
  }

  const callContractMethod = async () => {
    if (walletProvider) {
      const web3 = walletProvider.web3; 

      const provider = new Web3.providers.HttpProvider('https://goerli.infura.io/v3/8fa63c06dabd4d2b8ae5d99ed5a100f8')
      console.log("🚀 ~ file: WalletConnectButton.js:91 ~ callContractMethod ~ provider:", provider)

      const paymentTokenAddress = "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359"

      const seaport = new DecentrawebPort(provider, {
        networkName: "goerli",
        apiKey: "testKeyRinkeby",
        apiBaseUrl: "https://decentraweb-testnet.decentraweb.io:8000"
      })

      console.log("🚀 ~ file: WalletConnectButton.js:104 ~ callContractMethod ~ seaport:", seaport)
      const address = walletProvider.getAddress();
      console.log("🚀 ~ file: WalletConnectButton.js:108 ~ callContractMethod ~ address:", address.toString())
      const para = { 
        accountAddress: "0xaadcb7803714af16026cb83a15d416bda7089bba" , 
        tokenAddress: "0x174db1922A6De366E253084ce7912463E57C11ae"
      }
      const getTokenBalance = await seaport.getTokenBalance(para)

      console.log("🚀 ~ file: WalletConnectButton.js:128 ~ callContractMethod ~ balance:", getTokenBalance)
      // const getTokenBalance = await seaport.getTokenBalance(walletProvider.getAddress(),'0x174db1922A6De366E253084ce7912463E57C11ae',"ERC20")
      console.log("🚀 ~ file: WalletConnectButton.js:107 ~ callContractMethod ~ para:", para)

      // Replace with your contract ABI and address
    //   const contractAbi = [
    //     {
    //         "constant": true,
    //         "inputs": [],
    //         "name": "name",
    //         "outputs": [
    //             {
    //                 "name": "",
    //                 "type": "string"
    //             }
    //         ],
    //         "payable": false,
    //         "stateMutability": "view",
    //         "type": "function"
    //     },
    //     {
    //         "constant": false,
    //         "inputs": [
    //             {
    //                 "name": "_spender",
    //                 "type": "address"
    //             },
    //             {
    //                 "name": "_value",
    //                 "type": "uint256"
    //             }
    //         ],
    //         "name": "approve",
    //         "outputs": [
    //             {
    //                 "name": "",
    //                 "type": "bool"
    //             }
    //         ],
    //         "payable": false,
    //         "stateMutability": "nonpayable",
    //         "type": "function"
    //     },
    //     {
    //         "constant": true,
    //         "inputs": [],
    //         "name": "totalSupply",
    //         "outputs": [
    //             {
    //                 "name": "",
    //                 "type": "uint256"
    //             }
    //         ],
    //         "payable": false,
    //         "stateMutability": "view",
    //         "type": "function"
    //     },
    //     {
    //         "constant": false,
    //         "inputs": [
    //             {
    //                 "name": "_from",
    //                 "type": "address"
    //             },
    //             {
    //                 "name": "_to",
    //                 "type": "address"
    //             },
    //             {
    //                 "name": "_value",
    //                 "type": "uint256"
    //             }
    //         ],
    //         "name": "transferFrom",
    //         "outputs": [
    //             {
    //                 "name": "",
    //                 "type": "bool"
    //             }
    //         ],
    //         "payable": false,
    //         "stateMutability": "nonpayable",
    //         "type": "function"
    //     },
    //     {
    //         "constant": true,
    //         "inputs": [],
    //         "name": "decimals",
    //         "outputs": [
    //             {
    //                 "name": "",
    //                 "type": "uint8"
    //             }
    //         ],
    //         "payable": false,
    //         "stateMutability": "view",
    //         "type": "function"
    //     },
    //     {
    //         "constant": true,
    //         "inputs": [
    //             {
    //                 "name": "_owner",
    //                 "type": "address"
    //             }
    //         ],
    //         "name": "balanceOf",
    //         "outputs": [
    //             {
    //                 "name": "balance",
    //                 "type": "uint256"
    //             }
    //         ],
    //         "payable": false,
    //         "stateMutability": "view",
    //         "type": "function"
    //     },
    //     {
    //         "constant": true,
    //         "inputs": [],
    //         "name": "symbol",
    //         "outputs": [
    //             {
    //                 "name": "",
    //                 "type": "string"
    //             }
    //         ],
    //         "payable": false,
    //         "stateMutability": "view",
    //         "type": "function"
    //     },
    //     {
    //         "constant": false,
    //         "inputs": [
    //             {
    //                 "name": "_to",
    //                 "type": "address"
    //             },
    //             {
    //                 "name": "_value",
    //                 "type": "uint256"
    //             }
    //         ],
    //         "name": "transfer",
    //         "outputs": [
    //             {
    //                 "name": "",
    //                 "type": "bool"
    //             }
    //         ],
    //         "payable": false,
    //         "stateMutability": "nonpayable",
    //         "type": "function"
    //     },
    //     {
    //         "constant": true,
    //         "inputs": [
    //             {
    //                 "name": "_owner",
    //                 "type": "address"
    //             },
    //             {
    //                 "name": "_spender",
    //                 "type": "address"
    //             }
    //         ],
    //         "name": "allowance",
    //         "outputs": [
    //             {
    //                 "name": "",
    //                 "type": "uint256"
    //             }
    //         ],
    //         "payable": false,
    //         "stateMutability": "view",
    //         "type": "function"
    //     },
    //     {
    //         "payable": true,
    //         "stateMutability": "payable",
    //         "type": "fallback"
    //     },
    //     {
    //         "anonymous": false,
    //         "inputs": [
    //             {
    //                 "indexed": true,
    //                 "name": "owner",
    //                 "type": "address"
    //             },
    //             {
    //                 "indexed": true,
    //                 "name": "spender",
    //                 "type": "address"
    //             },
    //             {
    //                 "indexed": false,
    //                 "name": "value",
    //                 "type": "uint256"
    //             }
    //         ],
    //         "name": "Approval",
    //         "type": "event"
    //     },
    //     {
    //         "anonymous": false,
    //         "inputs": [
    //             {
    //                 "indexed": true,
    //                 "name": "from",
    //                 "type": "address"
    //             },
    //             {
    //                 "indexed": true,
    //                 "name": "to",
    //                 "type": "address"
    //             },
    //             {
    //                 "indexed": false,
    //                 "name": "value",
    //                 "type": "uint256"
    //             }
    //         ],
    //         "name": "Transfer",
    //         "type": "event"
    //     }
    // ]    
    
    //   const contractAddress = "0x174db1922A6De366E253084ce7912463E57C11ae"; // Address of your contract

      // Create a contract instance
    //   const contract = new web3.eth.Contract(contractAbi, contractAddress);
    //   console.log("🚀 ~ file: WalletConnectButton.js:84 ~ callContractMethod ~ contract:", contract)

    //   contract.methods.balanceOf('0xDaA82A39366AEE651183d9343Ca0e03D7E3d6690').call((error, balance) => {
    //     if (error) {
    //         console.error('🚀 ~ file: Error occurred:', error);
    //     } else {
    //         console.log('🚀 ~ file:  Balance:', balance);
    //     }
    // });


    // isApprovedForAll

    const contractAddress = "0x86c05f54ac9330c5ffc6b472dbbdebf81b458027"

    const contractAbi = [
      {
          "constant": true,
          "inputs": [],
          "name": "name",
          "outputs": [
              {
                  "name": "",
                  "type": "string"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0x06fdde03"
      },
      {
          "constant": true,
          "inputs": [
              {
                  "name": "",
                  "type": "uint256"
              }
          ],
          "name": "kittyIndexToApproved",
          "outputs": [
              {
                  "name": "",
                  "type": "address"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0x481af3d3"
      },
      {
          "constant": true,
          "inputs": [
              {
                  "name": "",
                  "type": "uint256"
              }
          ],
          "name": "partIndexToApproved",
          "outputs": [
              {
                  "name": "",
                  "type": "address"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0x434f811b"
      },
      {
          "constant": true,
          "inputs": [
              {
                  "name": "",
                  "type": "address"
              },
              {
                  "name": "",
                  "type": "uint256"
              }
          ],
          "name": "allowed",
          "outputs": [
              {
                  "name": "",
                  "type": "address"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0x739f660d"
      },
      {
          "constant": true,
          "inputs": [
              {
                  "name": "_tokenId",
                  "type": "uint256"
              }
          ],
          "name": "getApproved",
          "outputs": [
              {
                  "name": "",
                  "type": "address"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0x081812fc"
      },
      {
          "constant": false,
          "inputs": [
              {
                  "name": "_to",
                  "type": "address"
              },
              {
                  "name": "_tokenId",
                  "type": "uint256"
              }
          ],
          "name": "approve",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function",
          "signature": "0x095ea7b3"
      },
      {
          "constant": true,
          "inputs": [],
          "name": "totalSupply",
          "outputs": [
              {
                  "name": "",
                  "type": "uint256"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0x18160ddd"
      },
      {
          "constant": false,
          "inputs": [
              {
                  "name": "_to",
                  "type": "address"
              },
              {
                  "name": "_tokenId",
                  "type": "uint256"
              }
          ],
          "name": "transfer",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function",
          "signature": "0xa9059cbb"
      },
      {
          "constant": false,
          "inputs": [
              {
                  "name": "_from",
                  "type": "address"
              },
              {
                  "name": "_to",
                  "type": "address"
              },
              {
                  "name": "_tokenId",
                  "type": "uint256"
              }
          ],
          "name": "transferFrom",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function",
          "signature": "0x23b872dd"
      },
      {
          "constant": true,
          "inputs": [
              {
                  "name": "_owner",
                  "type": "address"
              },
              {
                  "name": "_index",
                  "type": "uint256"
              }
          ],
          "name": "tokenOfOwnerByIndex",
          "outputs": [
              {
                  "name": "",
                  "type": "uint256"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0x2f745c59"
      },
      {
          "constant": false,
          "inputs": [
              {
                  "name": "_from",
                  "type": "address"
              },
              {
                  "name": "_to",
                  "type": "address"
              },
              {
                  "name": "_tokenId",
                  "type": "uint256"
              }
          ],
          "name": "safeTransferFrom",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function",
          "signature": "0x42842e0e"
      },
      {
          "constant": true,
          "inputs": [
              {
                  "name": "_tokenId",
                  "type": "uint256"
              }
          ],
          "name": "exists",
          "outputs": [
              {
                  "name": "",
                  "type": "bool"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0x4f558e79"
      },
      {
          "constant": true,
          "inputs": [
              {
                  "name": "_index",
                  "type": "uint256"
              }
          ],
          "name": "tokenByIndex",
          "outputs": [
              {
                  "name": "",
                  "type": "uint256"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0x4f6ccce7"
      },
      {
          "constant": true,
          "inputs": [
              {
                  "name": "_tokenId",
                  "type": "uint256"
              }
          ],
          "name": "ownerOf",
          "outputs": [
              {
                  "name": "",
                  "type": "address"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0x6352211e"
      },
      {
          "constant": true,
          "inputs": [
              {
                  "name": "_owner",
                  "type": "address"
              }
          ],
          "name": "balanceOf",
          "outputs": [
              {
                  "name": "",
                  "type": "uint256"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0x70a08231"
      },
      {
          "constant": true,
          "inputs": [],
          "name": "symbol",
          "outputs": [
              {
                  "name": "",
                  "type": "string"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0x95d89b41"
      },
      {
          "constant": false,
          "inputs": [
              {
                  "name": "_to",
                  "type": "address"
              },
              {
                  "name": "_approved",
                  "type": "bool"
              }
          ],
          "name": "setApprovalForAll",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function",
          "signature": "0xa22cb465"
      },
      {
          "constant": false,
          "inputs": [
              {
                  "name": "_from",
                  "type": "address"
              },
              {
                  "name": "_to",
                  "type": "address"
              },
              {
                  "name": "_tokenId",
                  "type": "uint256"
              },
              {
                  "name": "_data",
                  "type": "bytes"
              }
          ],
          "name": "safeTransferFrom",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function",
          "signature": "0xb88d4fde"
      },
      {
          "constant": true,
          "inputs": [
              {
                  "name": "_tokenId",
                  "type": "uint256"
              }
          ],
          "name": "tokenURI",
          "outputs": [
              {
                  "name": "",
                  "type": "string"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0xc87b56dd"
      },
      {
          "constant": true,
          "inputs": [
              {
                  "name": "_owner",
                  "type": "address"
              },
              {
                  "name": "_operator",
                  "type": "address"
              }
          ],
          "name": "isApprovedForAll",
          "outputs": [
              {
                  "name": "",
                  "type": "bool"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0xe985e9c5"
      },
      {
          "inputs": [
              {
                  "name": "_name",
                  "type": "string"
              },
              {
                  "name": "_symbol",
                  "type": "string"
              }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "constructor"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": true,
                  "name": "_from",
                  "type": "address"
              },
              {
                  "indexed": true,
                  "name": "_to",
                  "type": "address"
              },
              {
                  "indexed": false,
                  "name": "_tokenId",
                  "type": "uint256"
              }
          ],
          "name": "Transfer",
          "type": "event",
          "signature": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": true,
                  "name": "_owner",
                  "type": "address"
              },
              {
                  "indexed": true,
                  "name": "_approved",
                  "type": "address"
              },
              {
                  "indexed": false,
                  "name": "_tokenId",
                  "type": "uint256"
              }
          ],
          "name": "Approval",
          "type": "event",
          "signature": "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": true,
                  "name": "_owner",
                  "type": "address"
              },
              {
                  "indexed": true,
                  "name": "_operator",
                  "type": "address"
              },
              {
                  "indexed": false,
                  "name": "_approved",
                  "type": "bool"
              }
          ],
          "name": "ApprovalForAll",
          "type": "event",
          "signature": "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31"
      }
  ]

    const contract = new web3.eth.Contract(contractAbi, contractAddress);
    console.log("🚀 ~ file: WalletConnectButton.js:840 ~ callContractMethod ~ contract:", contract)

    contract.methods.isApprovedForAll('0xf626EFc50Bb587EB496798561B959BA406EDC04a', '0x14f583cb573c19374480d7490a31ddadb84758fb').call()
  .then((result) => {
    // Process the result here
    console.log("🚀 ~ file: result",result);
  })
  .catch((error) => {
    // Handle error here
    console.error(error);
  });




  // call method

  // console.log("🚀 ~ file: WalletConnectButton.js:8598 ~ callContractMethod ~ web3.eth:", web3.eth)
  // const contract = web3.eth.call({from: '0xf626EFc50Bb587EB496798561B959BA406EDC04a',to: '0x86C05f54ac9330C5ffc6b472dbBdEbF81b458027',data: true})
  // console.log("🚀 ~ file: WalletConnectButton.js:858 ~ callContractMethod ~ contract:", contract)




      // try {
      //   const balance = await contract.methods.ownerOf('6901242514652535666831570776755301285830456839113072815438659426630026969574').call();
      //   console.log('Balance of Address:', balance);
      // } catch (error) {
      //   console.log("🚀 ~ file: WalletConnectButton.js:767 ~ callContractMethod ~ error:", error)  
      // }
    }
  };

  return (
    <div>
      {walletProvider ? (
        <div>
          <p>Connected Address: {walletProvider.getAddress()}</p>
          <button onClick={callContractMethod}>Call Contract Method</button>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
          <button onClick={sendEth}>Send 0.0001 ETH</button>
          <button onClick={NCRTokenTransfer}>NCRTokenTransfer</button>
          <button onClick={NCRNFTTransfer}>NCRNFTTransfer</button>
        </div>
      ) : (
        <>
        <button onClick={connectWallet}>Connect Wallet</button>
        <button onClick={normalProvider}>Normal Wallet Provider</button>
        </>
      )}
    </div>
  );
};

export default WalletConnectComponent;