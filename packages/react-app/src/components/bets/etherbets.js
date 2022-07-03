import React from "react";
import { GameCreator } from "./gamecreator";
import { GameList } from "./gamelist";
import { ContractImporter } from "../container/contractimporter";

import { ethers } from "ethers";
import { addresses, abis } from "@project/contracts";
import { Contract } from "@ethersproject/contracts";

export class EtherBets extends React.Component{

    createGame = (game) => {
      createNewGame(this.props.provider, game);
    }

    render(){
      const minimized = this.props.minimized;
      const games = this.props.games;
      const setGames = this.props.setGames;
      return(
        <div>
          {minimized ? (<></>) : 
           games.length > 0 ?
          (<>
            <GameCreator creator={this.createGame} provider={this.props.provider}></GameCreator>
            <ContractImporter data={games} setContracts={setGames} provider={this.props.provider} title={"Import a New Lottery"}></ContractImporter>
            <GameList games={games} provider={this.props.provider}></GameList></>
          ) :
          (<div class="switchNetworks">There's nothing here. Switch to the <span class="ticker">Rinkeby</span> network!</div>)
          }
        </div>
      );    
    }
}

export async function createNewGame(provider, game){
  if(game.validInput){
    console.log('Creating new game:')
    console.log({game: game});
    const etherBetsFactory = new Contract(addresses.etherBetsFactory, abis.etherBetsFactory, provider.getSigner());
    await etherBetsFactory.newEtherBets(game.name, ethers.utils.parseEther(game.betCost), game.maxNumber, game.picks, game.timeBetweenDraws, "0x63b9d642887dd6d7e35a822382a2cbf5eb49fdfb").catch((err) => { console.log(err)});
  }
  else{
    console.log('Game input is invalid.');
    console.log({game: game});
  }   
}