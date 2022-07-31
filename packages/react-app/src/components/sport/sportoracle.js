import React from "react";

export class SportOracle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            minimized: true,
            betAmount: '',
        }
    }

    render() {
        const games = this.props.data || [];
        return (
            <div className="oracle">
                <div className="upcomingGames">Upcoming games:</div>
                {
                    games.sort((a, b) => a.startTime - b.startTime).map((g) =>
                    (<div className="oracleGameContainer">
                        <div className="oracleGame">{g['homeTeam']} vs {g['awayTeam']} on {new Date(g['startTime'] * 1000).toLocaleDateString("en-US") + ' ' + new Date(g['startTime'] * 1000).toLocaleTimeString("en-US")}</div>
                        <input type="button" className="button-40" value="Create Bet" onClick={() => this.props.creator(g)} />
                    </div>
                    ))
                }
            </div>
        )
    }
}
