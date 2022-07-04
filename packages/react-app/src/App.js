//import BigNumber from 'bignumber.js';
//import { ethers } from 'ethers';
import { useQuery } from "@apollo/react-hooks";

//import { getDefaultProvider } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";

//import { Body, Button, Header, Image, Link} from "./components";
//import { Button } from "./components";
import logo from "./ethereumLogo.png";
import useWeb3Modal from "./hooks/useWeb3Modal";
import {fetchData, fetchOracleData} from "./fetch/fetchData";

import GET_TRANSFERS from "./graphql/subgraph";

import { addresses } from "@project/contracts";

import './App.css';
import { EtherContainer } from "./components/container/container";

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
                //const name = await provider.lookupAddress(accounts[0]); Kovan doesn't support ENS, commenting out for now.
                setRendered(account.substring(0, 6) + "..." + account.substring(36));

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
    const [games, gamesSet] = React.useState([]);
    const [gameAddresses, gameAddressesSet] = React.useState([addresses.simple, addresses.megaSena, addresses.lotoFacil, addresses.megaMillions]);
    const [predictions, predictionsSet] = React.useState([]);
    const [predAddresses, predAddressesSet] = React.useState([addresses.predictionExample, addresses.predictionExample2, addresses.predictionExample3]);
    const [sports, sportsSet] = React.useState([]);
    const [sportAddresses, sportAddressesSet] = React.useState([addresses.sportExample]);
    const [oracleGames, oracleSet] = React.useState([]);

    React.useEffect(() => {
        if (!loading && !error && data && data.transfers) {
            console.log({ transfers: data.transfers });
        }
    }, [loading, error, data]);

    React.useEffect(() => {
        fetchData(provider, gameAddresses, gamesSet, gameAddressesSet, predAddresses, predictionsSet, sportAddresses, sportsSet, oracleSet);
    }, [provider, gameAddresses, predAddresses, sportAddresses]);

    React.useEffect(() => {
        window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
                <EtherContainer provider={provider}
                    games={games} setGames={gameAddressesSet}
                    predictions={predictions} setPredictions={predAddressesSet}
                    sports={sports} setSports={sportAddressesSet}
                    logo={logo}
                    oracleGames={oracleGames}></EtherContainer>
            </header>
            <div id="background-radial-gradient">
            </div>
        </div>
    );
}

export default App;
