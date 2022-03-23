import React from "react";
import { Game } from "./game";

export class GameList extends React.Component{
    render(){
      const games = this.props.games || [];
      
      return (
        <div>
          {games.map((game, i) => <Game value={game} provider={this.props.provider} key={game.name}/>)}
        </div>
      );
    }  
}