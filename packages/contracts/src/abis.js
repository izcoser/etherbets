import erc20Abi from "./abis/erc20.json";
import ownableAbi from "./abis/ownable.json";
import etherBetsFactoryAbi from "./abis/etherBetsFactoryAbi.json";
import etherBetsAbi from "./abis/etherBetsAbi.json";
import predictionAbi from "./abis/predictionAbi.json";
import predictionFactoryAbi from "./abis/predictionFactoryAbi.json";
import rundownConsumerAbi from "./abis/rundownConsumerAbi.json";
import sportsDataConsumerAbi from "./abis/sportsDataConsumerAbi.json";
import sportsBetAbi from "./abis/sportsBetAbi.json";

const abis = {
  erc20: erc20Abi,
  ownable: ownableAbi,
  etherBetsFactory: etherBetsFactoryAbi,
  etherBets: etherBetsAbi,
  prediction: predictionAbi,
  predictionFactory: predictionFactoryAbi,
  rundownConsumer: rundownConsumerAbi,
  sportsDataConsumer: sportsDataConsumerAbi,
  sportsBet: sportsBetAbi,
};

export default abis;
