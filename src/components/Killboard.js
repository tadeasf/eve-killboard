import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Link,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Select,
  Flex,
  Spinner,
} from "@chakra-ui/react";

const Killboard = () => {
  const [kills, setKills] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [sortField, setSortField] = useState("killmailTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedCharacterId, setSelectedCharacterId] = useState("1772807647");
  const [isLoading, setIsLoading] = useState(true);
  const [displayMode, setDisplayMode] = useState("kills");

  const characters = [
    { id: "1772807647", name: "Tadeas CZ" },
    { id: "2114774296", name: "Cengar Creire-Geng" },
    { id: "2116810440", name: "Deathly Hallows2" },
    { id: "2119522407", name: "7oXx" },
    { id: "1296770674", name: "Emnar Thidius" },
    { id: "94370897", name: "Richard Valdyr" },
    { id: "813634421", name: "SanZo Fengi" },
    { id: "135683356", name: "Zeerover" },
    { id: "1902051600", name: "ZeusCommander" },
    { id: "93985921", name: "Vilzuh" },
    { id: "1107376792", name: "snipereagle1" },
    { id: "1787233431", name: "Ice Maniac" },
    { id: "885978821", name: "Bruch Wayne" },
    { id: "1702746983", name: "cegg" },
    { id: "211748991", name: "doombreed52" },
    { id: "2116613377", name: "HelloMeow" },
    { id: "1122768769", name: "Holo Mez" },
    { id: "95859739", name: "Jimmy Oramara" },
    { id: "91412054", name: "K Sully" },
    { id: "91322151", name: "Nokin Niam" },
    { id: "95618389", name: "Phoenix Snow" },
    { id: "1528387696", name: "RawNec" },
    { id: "418281780", name: "Seth Quado" },
    { id: "1181492764", name: "SgtSlacker" },
    { id: "2117414873", name: "Tec8n0" },
    { id: "2120058366", name: "TheRealFatback" },
    { id: "2114249907", name: "Tion Galler" },
    { id: "92663124", name: "Sville Sveltos" },
    { id: "2115781306", name: "Aretha LouiseFrank" },
    { id: "2113791254", name: "Cleanthes" },
    { id: "2112599464", name: "Mad Dawg Yaken" },
    { id: "1451471232", name: "mr bowjangles" },
    { id: "2116105023", name: "Drithi Moonshae" },
    { id: "2120186660", name: "ozzy993" },
    { id: "134063007", name: "Yamcha7" },
    { id: "93426904", name: "John Cravius" },
    { id: "91613448", name: "Private Panacan" },
    { id: "1135028350", name: "Arkady Drayson" },
    { id: "93466458", name: "Malcolm Bobodiablo" },
    { id: "91290222", name: "tainted demon" },
    { id: "345875676", name: "Caleb Drakka" },
  ];

  // Color functions
  const iskColor = (isk) => {
    if (isk <= 10000000) return "green.900";
    else if (isk > 10000000 && isk <= 100000000) return "green.500";
    else if (isk > 100000000 && isk <= 500000000) return "green.300";
    else if (isk > 500000000) return "green.100";
    return "green.900";
  };

  const pointsColor = (points) => {
    if (points <= 5) return "blue.700";
    else if (points > 5 && points <= 10) return "blue.500";
    else if (points > 10 && points <= 50) return "blue.300";
    else if (points > 50) return "blue.100";
    return "blue.700";
  };

  const securityStatusColor = (securityStatus) => {
    if (securityStatus < 0) return "red.600";
    else if (securityStatus >= 0 && securityStatus <= 0.1) return "red.500";
    else if (securityStatus > 0.1 && securityStatus <= 0.3) return "orange.500";
    else if (securityStatus > 0.3 && securityStatus <= 0.5) return "orange.400";
    else if (securityStatus > 0.5 && securityStatus <= 0.7) return "yellow.400";
    else if (securityStatus > 0.7) return "green.500";
    return "green.400";
  };

  const fetchKillmailDetails = useCallback(
    async (kill) => {
      const { killmail_id, zkb } = kill;
      const killmailUrl = `https://esi.evetech.net/latest/killmails/${killmail_id}/${zkb.hash}/`;

      try {
        const killmailResponse = await axios.get(killmailUrl);
        const killData = killmailResponse.data;

        const killmailTime = new Date(killData.killmail_time);
        const formattedTime = killmailTime.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        let attackerShipName = "Unknown Ship";
        if (displayMode === "kills") {
          // Find the attacker's ship name if the display mode is "kills"
          const attacker = killData.attackers.find(
            (attacker) =>
              attacker.character_id === parseInt(selectedCharacterId)
          );
          if (attacker && attacker.ship_type_id) {
            const shipTypeUrl = `https://esi.evetech.net/latest/universe/types/${attacker.ship_type_id}/`;
            const shipResponse = await axios.get(shipTypeUrl);
            attackerShipName = shipResponse.data.name;
          }
        }

        const victimShipTypeUrl = `https://esi.evetech.net/latest/universe/types/${killData.victim.ship_type_id}/`;
        const victimShipResponse = await axios.get(victimShipTypeUrl);
        const victimShipName = victimShipResponse.data.name;

        const systemUrl = `https://esi.evetech.net/latest/universe/systems/${killData.solar_system_id}/`;
        const systemResponse = await axios.get(systemUrl);

        return {
          ...kill,
          killmailTime: formattedTime,
          attackerShipName:
            displayMode === "kills" ? attackerShipName : undefined, // Include this only for kills
          victimShipName,
          systemName: `${systemResponse.data.name} (${
            Math.round(systemResponse.data.security_status * 10) / 10
          })`,
          securityStatus:
            Math.round(systemResponse.data.security_status * 10) / 10,
          damageTaken: killData.victim.damage_taken,
          totalValue: zkb.totalValue,
          points: zkb.points,
          zkillUrl: `https://zkillboard.com/kill/${killmail_id}/`,
        };
      } catch (error) {
        console.error("Error fetching killmail details:", error);
        return kill;
      }
    },
    [selectedCharacterId, displayMode]
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const url = `https://zkillboard.com/api/${displayMode}/characterID/${selectedCharacterId}/`;
      const response = await axios.get(url);
      const enrichedKillsOrLosses = await Promise.all(
        response.data.map(fetchKillmailDetails)
      );
      setKills(enrichedKillsOrLosses);
      setIsLoading(false);
    };

    fetchData();
  }, [
    displayCount,
    sortField,
    sortDirection,
    displayMode,
    selectedCharacterId,
    fetchKillmailDetails,
  ]);

  const sortedKills = useMemo(() => {
    return [...kills]
      .sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortField === "killmailTime") {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        if (sortDirection === "desc") {
          return bValue - aValue;
        } else {
          return aValue - bValue;
        }
      })
      .slice(0, displayCount);
  }, [kills, sortField, sortDirection, displayCount]);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  return (
    <Box width="80%" margin="auto" mt="5">
      <Flex justifyContent="space-between" mb="4">
        <Heading as="h3" size="md">
          Character
        </Heading>
        <Heading as="h3" size="md">
          Display Count
        </Heading>
        <Heading as="h3" size="md">
          Kills/Losses
        </Heading>
      </Flex>
      <Flex justifyContent="space-between" mb="4">
        <Select
          onChange={(e) => setSelectedCharacterId(e.target.value)}
          defaultValue={selectedCharacterId}
          title="Character"
        >
          {characters
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((character) => (
              <option key={character.id} value={character.id}>
                {character.name}
              </option>
            ))}
        </Select>

        <Select
          onChange={(e) => setDisplayCount(parseInt(e.target.value, 10))}
          defaultValue={displayCount}
          title="Display Count"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
        </Select>
        <Select
          onChange={(e) => setDisplayMode(e.target.value)}
          defaultValue={displayMode}
          title="Display Mode"
        >
          <option value="kills">Kills</option>
          <option value="losses">Losses</option>
        </Select>
      </Flex>
      {isLoading ? (
        <Flex justify="center" align="center" height="200px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              {[
                "Time (DD/MM/YYYY HH:MM:SS)",
                "Victim Ship",
                displayMode === "kills" && "Attacker Ship",
                "Total Value",
                "Points",
                "Damage Taken",
                "System (Security Status)",
                "URL",
              ]
                .filter(Boolean)
                .map((header) => (
                  <Th
                    key={header}
                    onClick={() =>
                      handleSort(
                        header.replace(/\s+/g, "").replace(/[\(\)]/g, "") // eslint-disable-line
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {header}
                  </Th>
                ))}
            </Tr>
          </Thead>
          <Tbody>
            {sortedKills.map((kill, index) => (
              <Tr key={index}>
                <Td>{kill.killmailTime}</Td>
                <Td>{kill.victimShipName}</Td>
                {displayMode === "kills" && <Td>{kill.attackerShipName}</Td>}
                <Td>
                  <Box color={iskColor(kill.totalValue)}>
                    {(kill.totalValue?.toLocaleString() ?? "0") + " ISK"}
                  </Box>
                </Td>
                <Td>
                  <Box color={pointsColor(kill.points)}>{kill.points}</Box>
                </Td>
                <Td>{kill.damageTaken}</Td>
                <Td>
                  <Box color={securityStatusColor(kill.securityStatus)}>
                    {kill.systemName}
                  </Box>
                </Td>
                <Td>
                  <Link href={kill.zkillUrl} isExternal>
                    View on zKillboard
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default Killboard;
