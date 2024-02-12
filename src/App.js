import React from "react";
import Killboard from "./components/Killboard";
import LastWeekKills from "./components/LastWeekKills";

function App() {
  return (
    <div className="App">
      <Killboard />
      <LastWeekKills />
    </div>
  );
}

export default App;
