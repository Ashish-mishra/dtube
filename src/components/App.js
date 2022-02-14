import React, { Component } from 'react';
import ideaNet from '../abis/ideaNet.json'
import Navbar from './Navbar'
import Main from './Main'
import Footer from './Footer'
import Web3 from 'web3';
import './App.css';

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = ideaNet.networks[networkId]
    console.log('Network Id is ' + networkId)

    if(networkData) {
      const dtube = new web3.eth.Contract(ideaNet.abi, networkData.address)
      this.setState({ dtube })
      const ideasCount = await dtube.methods.ideaCount().call()
      this.setState({ ideasCount })
      // Load ideas, sort by newest
      for (var i=ideasCount; i>=1; i--) {
        const idea = await dtube.methods.ideas(i).call()
        this.setState({
          ideas: [...this.state.ideas, idea]
        })
      }
      //Set latest idea with title to view as default 
      const latest = await dtube.methods.ideas(ideasCount).call()
      this.setState({
        currentHash: latest.hash,
        currentTitle: latest.title
      })
      this.setState({ loading: false})
    } else {
      window.alert('ideaNet contract not deployed to detected network.')
    }
  }

  captureFile = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }


  uploadIdea = title => {
    console.log("Submitting file to IPFS...")
    //adding file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('IPFS result', result)
      if(error) {
        console.error(error)
        return
      }

      this.setState({ loading: true })
      this.state.dtube.methods.uploadIdea(result[0].hash, title).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  changeIdea = (hash, title) => {
    this.setState({'currentHash': hash});
    this.setState({'currentTitle': title});
  }

  constructor(props) {
    super(props)
    this.state = {
      buffer: null,
      account: '',
      dtube: null,
      ideas: [],
      loading: true,
      currentHash: null,
      currentTitle: null
    }

    this.uploadIdea = this.uploadIdea.bind(this)
    this.captureFile = this.captureFile.bind(this)
    this.changeIdea = this.changeIdea.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              ideas={this.state.ideas}
              uploadIdea={this.uploadIdea}
              captureFile={this.captureFile}
              changeIdea={this.changeIdea}
              currentHash={this.state.currentHash}
              currentTitle={this.state.currentTitle}
            />
        }
        <Footer />
      </div>
    );
  }
}

export default App;