import React from "react";
import { PredictionList } from "./predictionlist";
import { PredictionCreator } from "./predictioncreator";
import { ContractImporter } from "../container/contractimporter";

import { addresses, abis } from "@project/contracts";
import { Contract } from "@ethersproject/contracts";

export class EtherPredictions extends React.Component{
    createPrediction = (prediction) => {
      createNewPrediction(this.props.provider, prediction);
    }

    render(){
      const minimized = this.props.minimized;
      const predictions = this.props.predictions;
      const setPredictions = this.props.setPredictions;
      return(
        <div>
          {minimized ? (<></>) :
           predictions.length > 0 ?
          (<>
            <PredictionCreator creator={this.createPrediction} provider={this.props.provider}></PredictionCreator>
            <ContractImporter data={predictions} setContracts={setPredictions} provider={this.props.provider} title={"Import a New Price Bet"}></ContractImporter>
            <PredictionList predictions={predictions} provider={this.props.provider}></PredictionList>
          </>) :
          (<div className="switchNetworks">There's nothing here. Switch to the <span className="ticker">Rinkeby</span> network!</div>)
          }
        </div>
      );
    }
}

export async function createNewPrediction(provider, prediction){
  console.log('Creating new prediction:')
  console.log({prediction: prediction});
  const predictionFactory = new Contract(addresses.predictionFactory, abis.predictionFactory, provider.getSigner());
  await predictionFactory.newEtherPrediction(prediction.aggregator, prediction.targetPrice, prediction.targetTime, prediction.deadline).catch((err) => { console.log(err)});
}