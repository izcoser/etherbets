//import BigNumber from 'bignumber.js';
//import { ethers } from 'ethers';
import { useQuery } from "@apollo/react-hooks";

//import { getDefaultProvider } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";

//import { Body, Button, Header, Image, Link} from "./components";
import { Button } from "./components";
import logo from "./ethereumLogo.png";
import useWeb3Modal from "./hooks/useWeb3Modal";

import GET_TRANSFERS from "./graphql/subgraph";

import { addresses, abis } from "@project/contracts";
import { Contract } from "@ethersproject/contracts";
import { combination } from "./components/bets/utils";
import rinkebyPricePairs from "./components/predictions/rinkebyPriceProxies.js";


import './App.css';
import { EtherContainer } from "./components/container/container";

async function fetchPrediction(provider, address){
  const contract = new Contract(address, abis.prediction, provider);
  const details = await contract.getDetails();
  const accounts = await provider.listAccounts();
  const accountAddress = accounts[0];
  const prediction = {
    aggregator: details[0],
    total: [Number(details[1][0]).toString(), Number(details[1][1]).toString()],
    fetchedPrice: Number(details[2]).toString(),
    targetPrice: Number(details[3]).toString(),
    targetTime: Number(details[4]).toString(),
    deadline: Number(details[5]).toString(),
    obtainedPrice: details[6],
    claimablePrize: await contract.claimablePrize(accountAddress),
    userBet: [Number(details[8][0]).toString(), Number(details[8][1]).toString()],
    address: address,
    ticker: rinkebyPricePairs[details[0]][1],
  }

  return prediction;
}

let factoryContract;
let userCreatedGames = []
const defaultGames = [addresses.simple, addresses.megaSena, addresses.lotoFacil, addresses.megaMillions]

async function fetchGame(provider, address){
  const contract = new Contract(address, abis.etherBets, provider);
  const details = await contract.getDetails();
  const game = {
    name: details[0],
    betCost: details[1].toString(),
    maxNumber: details[2],
    picks: details[3],
    timeBetweenDraws: Number(details[4].toString()),
    lastDrawTime: Number(details[5].toString()),
    paused: details[6],
    draw: Number(details[7].toString()),
    prize: Number(details[8].toString()),
    winningNumbers: details[9],
    randomNumber: details[10],
    randomNumberFetched: details[11],
    address: address,
    
  }
  game.odds = combination(game.maxNumber, game.picks);
  return game;
}

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  const [account, setAccount] = useState("");
  const [rendered, setRendered] = useState("");

  useEffect(() => {
    async function fetchAccount() {
      try {
        if (!provider) {
          return;
        }

        // Load the user's accounts.
        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);

        // Resolve the ENS name for the first account.
        const name = await provider.lookupAddress(accounts[0]);

        // Render either the ENS name or the shortened account address.
        if (name) {
          setRendered(name);
        } else {
          setRendered(account.substring(0, 6) + "..." + account.substring(36));
        }
      } catch (err) {
        setAccount("");
        setRendered("");
        console.error(err);
      }
    }
    fetchAccount();
  }, [account, provider, setAccount, setRendered]);

  return (
    <button
      className="walletButton"
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </button>
  );
}

function App() {
  const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [games, gamesSet] = React.useState("");
  const [predictions, predictionsSet] = React.useState("");

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, error, data]);

  React.useEffect(() => {
    async function fetchData(){
      if(!provider){
        console.log('No provider.')
        return;
      }

      else{
        const network = await provider.getNetwork();
        
        if(network.chainId !== 4){
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: '0x4'}],
          })
        }

        console.log('Provider loaded.');
  
        factoryContract = new Contract(addresses.etherBetsFactory, abis.etherBetsFactory, provider);
        factoryContract.on("NewLottery", (address, evt) => {
          console.log({
              address: address,
              evt: evt
            });
          
          userCreatedGames.push(address);
          listenToBetEvents(address, provider);
          fetchDefaultGames();
        });
  
        for(let a of defaultGames){
            listenToBetEvents(a, provider);
        }

        fetchDefaultPredictions();
        fetchDefaultGames();
      }
    
    function listenToBetEvents(a, provider){
      const c = new Contract(a, abis.etherBets, provider);
        c.on("BetPlaced", (sender, numbers, draw, evt) => {
          console.log('Bet placed at ' + a);
          console.log({
            sender: sender,
            numbers: numbers.toString(),
            draw: Number(draw.toString()),
          });
          fetchDefaultGames();
        });

        c.on("RandomnessRequested", (draw, evt) => {
          console.log('Randomness requested at %s for draw %s', a, Number(draw.toString()));
          console.log({
            draw: Number(draw.toString()),
          });
          fetchDefaultGames();
        });

        c.on("RandomnessFulfilled", (randomness, draw, evt) => {
          console.log('Randomness fulfilled at %s for draw %s', a, Number(draw.toString()));
          console.log({
            draw: Number(draw.toString()),
          });
          fetchDefaultGames();
        });

        c.on("NumbersDrawn", (numbers, draw, evt) => {
          console.log('Numbers %s drawn at %s for draw %s', numbers, a, draw);
          console.log({
            numbers: numbers.toString(),
            draw: Number(draw.toString()),
          });
          fetchDefaultGames();
        });
      }
    }

    async function fetchDefaultGames(){
      console.log("Fetching games...");
      let fetchedGames = [];
      for(const g of defaultGames.concat(userCreatedGames)){
        const a = await fetchGame(provider, g);
        fetchedGames.push(a);
      }
      gamesSet(fetchedGames);
    }

    async function fetchDefaultPredictions(){
      console.log("Fetching example prediction...");
      let fetchedPredictions = [];
      const p = await fetchPrediction(provider, addresses.predictionExample);
      const p2 = await fetchPrediction(provider, addresses.predictionExample2);
      const p3 = await fetchPrediction(provider, addresses.predictionExample3);
      fetchedPredictions.push(p);
      fetchedPredictions.push(p2);
      fetchedPredictions.push(p3);
      predictionsSet(fetchedPredictions);
    }

    fetchData();
  }, [provider]);

  return (
    <div className="App">
      <header className="App-header">
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal}/>
        <img src={logo} className="App-logo" alt="logo" />
        <EtherContainer provider={provider} games={games} predictions={predictions}></EtherContainer>
      </header>
      <div id="background-radial-gradient">
      </div>
    </div>
  );
}

export default App;
