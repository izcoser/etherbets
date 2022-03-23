import React from "react";
import { PredictionList } from "./predictionlist";
import { ethers } from "ethers";
import { addresses, abis } from "@project/contracts";
import { Contract } from "@ethersproject/contracts";

export class EtherPredictions extends React.Component{
    /*createGame = (game) => {
      createNewGame(this.props.provider, game);
    }*/

    render(){
      const predictions = this.props.predictions;
      return(
        <div>   
          <PredictionList predictions={predictions} provider={this.props.provider}></PredictionList>
        </div>
      );
    }
}
/*
export async function createNewGame(provider, game){
    console.log('Creating new game:')
    console.log({game: game});
    const etherBetsFactory = new Contract(addresses.etherBetsFactory, abis.etherBetsFactory, provider.getSigner());
    await etherBetsFactory.newEtherBets(game.name, ethers.utils.parseEther(game.betCost), game.maxNumber, game.picks, game.timeBetweenDraws, "0x63b9d642887dd6d7e35a822382a2cbf5eb49fdfb");
}*/