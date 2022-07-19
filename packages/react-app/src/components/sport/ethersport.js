import React from "react";
import { SportList } from "./sportlist";
import { SportOracle } from "./sportoracle";
import { SportCreator } from "./sportcreator";
import { ContractImporter } from "../container/contractimporter";

import { addresses, abis } from "@project/contracts";
import { Contract } from "@ethersproject/contracts";

export class EtherSport extends React.Component {
  createSportBet = (sport) => {
    createNewSportBet(this.props.provider, sport);
  }

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
                <SportOracle data={oracleGames} creator={this.createSportBet}></SportOracle>
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

export async function createNewSportBet(provider, sport){
  console.log('Creating new sport bet:')
  console.log({sport: sport});
  const sportsFactory = new Contract(addresses.sportsFactory, abis.sportsFactory, provider.getSigner());
  const linkToken = "0xa36085F69e2889c224210F603D836748e7dC0088";
  const oracle = "0xfF07C97631Ff3bAb5e5e5660Cdf47AdEd8D4d4Fd";
  await sportsFactory.newEtherSports(linkToken, oracle, sport.startTime, sport.gameIdSD, sport.gameIdRD, sport.homeTeam, sport.awayTeam).catch((err) => { console.log(err)});
}