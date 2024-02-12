import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Spinner,
} from "@chakra-ui/react";

const LastWeekKills = () => {
  const [killData, setKillData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklySummary = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://killboard.jevrej.cz/api/weekly-summary/"
        );
        setKillData(response.data);
      } catch (error) {
        console.error("Failed to fetch weekly summary", error);
        // Optionally, handle errors, such as setting an error state to display to the user
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklySummary();
  }, []);

  if (isLoading) {
    return (
      <Box textAlign="center" mt="5">
        <Spinner />
        <Text>Loading kill data...</Text>
      </Box>
    );
  }

  return (
    <Box width="80%" margin="auto" mt="5">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Character Name</Th>
            <Th isNumeric>Number of Kills</Th>
            <Th isNumeric>Total Kill Value (ISK)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {killData.map(({ characterName, killCount, totalValue }) => (
            <Tr key={characterName}>
              <Td>{characterName}</Td>
              <Td isNumeric>{killCount}</Td>
              <Td isNumeric>{`${totalValue.toLocaleString()} ISK`}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default LastWeekKills;
