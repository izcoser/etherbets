import { addresses, abis } from "@project/contracts";
import { Contract } from "@ethersproject/contracts";
import rinkebyPricePairs from "../components/predictions/rinkebyPriceProxies.js";
import abbrToName from "../components/sport/abbrToName";
import { combination } from "../components/bets/utils";

async function fetchOracleData(provider, address, oracle) {
    let contract;
    let gamesParsed;
    if (oracle === 0) {
        contract = new Contract(address, abis.sportsDataConsumer, provider);
        const games = await contract.getAllGamesCreatedLastId().catch((err) => { console.log(err) });
        gamesParsed = games.map((g) => {
            return Object({
                gameIdSD: Number(g['gameId']),
                startTime: Number(g['startTime']),
                homeTeam: abbrToName[g['homeTeam'].slice(-3).replace('\u0000', '')],
                awayTeam: abbrToName[g['awayTeam'].slice(-3).replace('\u0000', '')],
            })});
    }
    else if (oracle === 1) {
        contract = new Contract(address, abis.rundownConsumer, provider);
        const games = await contract.getAllGamesCreatedLastId().catch((err) => { console.log(err) });
        gamesParsed = games.map((g) => {
            return Object({
                gameIdRD: g['gameId'],
                startTime: Number(g['startTime']),
                homeTeam: g['homeTeam'],
                awayTeam: g['awayTeam'],
            })});
    }

    console.log(gamesParsed);
    return gamesParsed;
}

function joinOracleData(sdGames, rdGames){
    const intersection = [];
    for(let g of sdGames){
        for(let w of rdGames){
            if(w.homeTeam === g.homeTeam && w.awayTeam === g.awayTeam && w.startTime === g.startTime){
                g['gameIdRD'] = w['gameIdRD'];
                intersection.push(g);
                break;
            }
        }
    }
    return intersection; 
}

async function fetchSport(provider, address) {
    const contract = new Contract(address, abis.sportsBet, provider);
    const accounts = await provider.listAccounts();
    const accountAddress = accounts[0];
    const details = await contract.getDetails(accountAddress);
    const sport = {
        total: [Number(details[0][0]).toString(), Number(details[0][1]).toString()],
        userBet: [Number(details[1][0]).toString(), Number(details[1][1]).toString()],
        claimablePrize: Number(details[2]).toString(),
        fetchedSD: details[3],
        fetchedRD: details[4],
        homeTeam: details[5],
        awayTeam: details[6],
        homeScore: Number(details[7]).toString(),
        awayScore: Number(details[8]).toString(),
        gameDate: Number(details[9]),
        /*
        gameIdSD: ignored for now,
        gameIdRD: ignored for now,
        */
        resultAggregated: details[12],
        resultConsensus: details[13],
        homeWinner: details[14],
        address: address,
    }
    return sport;
}

async function fetchPrediction(provider, address) {
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

async function fetchGame(provider, address) {
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

function listenToBetEvents(a, provider, gameAddresses, gamesSet) {
    const c = new Contract(a, abis.etherBets, provider);
    c.on("BetPlaced", (sender, numbers, draw, evt) => {
        console.log('Bet placed at ' + a);
        console.log({
            sender: sender,
            numbers: numbers.toString(),
            draw: Number(draw.toString()),
        });
        fetchGames(provider, gameAddresses, gamesSet);
    });

    c.on("RandomnessRequested", (draw, evt) => {
        console.log('Randomness requested at %s for draw %s', a, Number(draw.toString()));
        console.log({
            draw: Number(draw.toString()),
        });
        fetchGames(provider, gameAddresses, gamesSet);
    });

    c.on("RandomnessFulfilled", (randomness, draw, evt) => {
        console.log('Randomness fulfilled at %s for draw %s', a, Number(draw.toString()));
        console.log({
            draw: Number(draw.toString()),
        });
        fetchGames(provider, gameAddresses, gamesSet);
    });

    c.on("NumbersDrawn", (numbers, draw, evt) => {
        console.log('Numbers %s drawn at %s for draw %s', numbers, a, draw);
        console.log({
            numbers: numbers.toString(),
            draw: Number(draw.toString()),
        });
        fetchGames(provider, gameAddresses, gamesSet);
    });
}

function listenToSportBetEvents(address, provider, sportAddresses, sportsSet){
    const c = new Contract(address, abis.sportsBet, provider);
    console.log('listening to events on ' + address)
    c.on("BetPlaced", (sender, amount, homeTeam, evt) => {
        console.log('Bet placed at ' + address);
        console.log({
            sender: sender,
            amount: amount.toString(),
            homeTeam: homeTeam,
        });
        fetchSports(provider, sportAddresses, sportsSet);
    });

    c.on("ResultsAggregated", (consensus, homeScore, awayScore) => {
        console.log('Consensus reached at ' + address);
        console.log({
            consensus: consensus, 
            homeScore: homeScore,
            awayScore: awayScore,
        });
        fetchSports(provider, sportAddresses, sportsSet);
    });
}

function listenToPredEvents(address, provider, predAddresses, predictionsSet){
    const c = new Contract(address, abis.prediction, provider);
    console.log('listening to events on ' + address)
    c.on("BetPlaced", (sender, amount, higher, evt) => {
        console.log('Bet placed at ' + address);
        console.log({
            sender: sender,
            amount: amount.toString(),
            higher: higher,
        });
        fetchPredictions(provider, predAddresses, predictionsSet);
    });

    c.on("PriceObtained", (price, timestamp) => {
        console.log('Consensus reached at ' + address);
        console.log({
            price: price, 
            timestamp: timestamp.toString(),
        });
        fetchPredictions(provider, predAddresses, predictionsSet);
    });
}

async function fetchGames(provider, gameAddresses, gamesSet) {
    console.log("Fetching games...");
    let fetchedGames = [];
    for (const a of gameAddresses) {
        const g = await fetchGame(provider, a);
        fetchedGames.push(g);
    }
    gamesSet(fetchedGames);
}

async function fetchPredictions(provider, predAddresses, predictionsSet) {
    console.log("Fetching example prediction...");
    let fetchedPredictions = [];
    for (const a of predAddresses) {
        const p = await fetchPrediction(provider, a);
        fetchedPredictions.push(p);
    }
    predictionsSet(fetchedPredictions);
}

async function fetchSports(provider, sportAddresses, sportsSet) {
    console.log("Fetching sports...");
    let fetchedSports = [];
    for (const a of sportAddresses) {
        const s = await fetchSport(provider, a);
        fetchedSports.push(s);
    }
    sportsSet(fetchedSports);
}

// Fetch Lottery and Prediction contract data from Rinkeby.
async function fetchRinkebyData(provider, gameAddresses, gamesSet, gameAddressesSet, predAddresses, predictionsSet, predAddressesSet) {
    const factoryContract = new Contract(addresses.etherBetsFactory, abis.etherBetsFactory, provider);
    factoryContract.on("NewLottery", (address, evt) => {
        console.log({
            address: address,
            evt: evt
        });

        gameAddressesSet(gameAddresses.concat(address));
        listenToBetEvents(address, provider, gameAddresses, gamesSet);
        fetchGames(provider, gameAddresses, gamesSet);
    });

    const predFactoryContract = new Contract(addresses.predictionFactory, abis.predictionFactory, provider);
    predFactoryContract.on("NewPrediction", (address, evt) => {
        console.log({
            address: address,
            evt: evt
        });

        predAddressesSet(predAddresses.concat(address));
        listenToPredEvents(address, provider, predAddresses, predictionsSet);
        fetchPredictions(provider, predAddresses, predictionsSet);
    });

    for (let a of gameAddresses) {
        listenToBetEvents(a, provider, gameAddresses, gamesSet);
    }

    for (let a of predAddresses) {
        listenToPredEvents(a, provider, predAddresses, predictionsSet);
    }

    fetchPredictions(provider, predAddresses, predictionsSet);
    fetchGames(provider, gameAddresses, gamesSet);
}

// Fetch Sports contract data from Kovan.
async function fetchKovanData(provider, sportAddresses, sportsSet, oracleSet, sportAddressesSet) {
    const factoryContract = new Contract(addresses.sportsFactory, abis.sportsFactory, provider);
    factoryContract.on("NewSports", (address, evt) => {
        console.log({
            address: address,
            evt: evt
        });

        sportAddressesSet(sportAddresses.concat(address));
        listenToSportBetEvents(address, provider, sportAddresses, sportsSet);
        fetchSports(provider, sportAddresses, sportsSet);
    });

    for (let a of sportAddresses) {
        listenToSportBetEvents(a, provider, sportAddresses, sportsSet);
    }

    fetchSports(provider, sportAddresses, sportsSet);
    console.log("setting sd and rd games");
    const sd = await fetchOracleData(provider, addresses.sportsDataConsumer, 0) 
    const rd = await fetchOracleData(provider, addresses.runDownConsumer, 1);
    const intersection = joinOracleData(sd, rd);
    oracleSet(intersection);
}

async function fetchData(provider, gameAddresses, gamesSet, gameAddressesSet, predAddresses, predictionsSet, sportAddresses, sportsSet, oracleSet, sportAddressesSet, predAddressesSet) {
    if (!provider) {
        console.log('No provider.')
        return;
    }
    else {
        const network = await provider.getNetwork();
        if (network.chainId !== 4 && network.chainId !== 42) { // prompt switch to Rinkeby.
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x4' }],
            })
        }

        console.log('Provider loaded.');

        if (network.chainId === 4) {
            fetchRinkebyData(provider, gameAddresses, gamesSet, gameAddressesSet, predAddresses, predictionsSet, predAddressesSet);
        }
        else if (network.chainId === 42) {
            fetchKovanData(provider, sportAddresses, sportsSet, oracleSet, sportAddressesSet);
        }
    }
}

export { fetchData, fetchOracleData };