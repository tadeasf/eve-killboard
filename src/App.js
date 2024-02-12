import React from "react";
import Killboard from "./components/Killboard";
import LastWeekKills from "./components/LastWeekKills";
import { Heading } from "@chakra-ui/react";

function App() {
  return (
    <div className="App">
      <Heading as="h2" size="xl" textAlign="center" mb="5" mt="5">
        Rán Squad - Killboard
      </Heading>
      <Killboard />
      <Heading as="h2" size="l" textAlign="center" mb="5" mt="5">
        Kills in current week (starts Monday)
      </Heading>
      <LastWeekKills />
    </div>
  );
}

export default App;
