const oddsReducer = (state, action) => {
  switch (action.type) {
    case "SET_INITIAL_ODDS":
      return { ...state, odds: action.payload, latestOdds: action.payload };
    case "UPDATE_ODDS":
      return { ...state, odds: state.latestOdds, latestOdds: action.payload };
    case "UPDATE_ODDS_STATUS":
      const newOddsStatus = {}; // Logic to update oddsStatus based on odds and latestOdds comparison
      // Assume action.payload contains the updated latestOdds
      const { latestOdds, odds } = state;
      action.payload.forEach((oddsGroup, groupIndex) => {
        oddsGroup.detail.forEach((match, matchIndex) => {
          match.forEach((team, teamIndex) => {
            const key = `${groupIndex}-${matchIndex}-${teamIndex}`;
            const oldValue = odds[groupIndex]?.detail[matchIndex][teamIndex]?.value;
            const newValue = latestOdds[groupIndex]?.detail[matchIndex][teamIndex]?.value;
            if (newValue > oldValue) {
              newOddsStatus[key] = "green";
            } else if (newValue < oldValue) {
              newOddsStatus[key] = "red";
            } else {
              newOddsStatus[key] = "none";
            }
          });
        });
      });
      return { ...state, oddsStatus: newOddsStatus };
    default:
      return state;
  }
};

export default oddsReducer;
