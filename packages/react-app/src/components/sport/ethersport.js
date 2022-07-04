import React from "react";
import { SportList } from "./sportlist";
import { SportOracle } from "./sportoracle";
import { SportCreator } from "./sportcreator";
import { ContractImporter } from "../container/contractimporter";

import { addresses, abis } from "@project/contracts";
import { Contract } from "@ethersproject/contracts";

export class EtherSport extends React.Component {
  render() {
    const minimized = this.props.minimized;
    const sports = this.props.sports;
    const setSports = this.props.setSports;
    const oracleGames = this.props.oracleGames;
    return (
      <div>
        {minimized ? (<></>) :
          sports.length > 0 ?
            (<>
              <div className="sportOracles">
                <SportOracle data={oracleGames}></SportOracle>
              </div>
              <ContractImporter data={sports} setContracts={setSports} provider={this.props.provider} title={"Import a New Sport Bet"}></ContractImporter>
              <SportList sports={sports} provider={this.props.provider}></SportList>
            </>) :
            (<div className="switchNetworks">There's nothing here. Switch to the <span className="ticker">Kovan</span> network!</div>)
        }
      </div>
    );
  }
}
/*
export async function createNewPrediction(provider, prediction){
  console.log('Creating new prediction:')
  console.log({prediction: prediction});
  const predictionFactory = new Contract(addresses.predictionFactory, abis.predictionFactory, provider.getSigner());
  await predictionFactory.newEtherPrediction(prediction.aggregator, prediction.targetPrice, prediction.targetTime, prediction.deadline).catch((err) => { console.log(err)});
}*/