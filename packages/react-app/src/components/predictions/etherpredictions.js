import React from "react";
import { PredictionList } from "./predictionlist";
import { PredictionCreator } from "./predictioncreator";

import { addresses, abis } from "@project/contracts";
import { Contract } from "@ethersproject/contracts";

export class EtherPredictions extends React.Component{
    createPrediction = (prediction) => {
      createNewPrediction(this.props.provider, prediction);
    }

    render(){
      const minimized = this.props.minimized;
      const predictions = this.props.predictions;
      return(
        <div>
          {minimized ? (<></>) :
          (<>
            <PredictionCreator creator={this.createPrediction} provider={this.props.provider}></PredictionCreator>
            <PredictionList predictions={predictions} provider={this.props.provider}></PredictionList>
          </>)
          }
        </div>
      );
    }
}

export async function createNewPrediction(provider, prediction){
  console.log('Creating new prediction:')
  console.log({prediction: prediction});
  const predictionFactory = new Contract(addresses.predictionFactory, abis.predictionFactory, provider.getSigner());
  await predictionFactory.newEtherPrediction(prediction.aggregator, prediction.targetPrice, prediction.targetTime, prediction.deadline);
}