import { useState, useEffect, useCallback } from "react";
import { Box, Button, Container, Grid, GridItem } from "@chakra-ui/react";

const numRows = 50;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const Index = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  const runSimulation = useCallback(() => {
    if (!running) return;

    setGrid((g) => {
      return g.map((row, i) =>
        row.map((cell, k) => {
          let neighbors = 0;
          operations.forEach(([x, y]) => {
            const newI = i + x;
            const newK = k + y;
            if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
              neighbors += g[newI][newK];
            }
          });

          if (neighbors < 2 || neighbors > 3) {
            return 0;
          } else if (cell === 0 && neighbors === 3) {
            return 1;
          }
          return cell;
        }),
      );
    });

    setTimeout(runSimulation, 100);
  }, [running]);

  useEffect(() => {
    if (running) {
      runSimulation();
    }
  }, [running, runSimulation]);

  return (
    <Container maxW="container.xl" centerContent>
      Game of life
      <Box w="100%" p={4}>
        <Button
          onClick={() => {
            setRunning(!running);
          }}
          mb={4}
        >
          {running ? "Stop" : "Start"}
        </Button>
        <Button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
            }
            setGrid(rows);
          }}
          ml={4}
        >
          Random
        </Button>
        <Button
          onClick={() => {
            setGrid(generateEmptyGrid());
          }}
          ml={4}
        >
          Clear
        </Button>
      </Box>
      <Grid templateColumns={`repeat(${numCols}, 20px)`}>
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <GridItem
              w="20px"
              h="20px"
              bg={grid[i][k] ? "teal.500" : "white"}
              border="1px"
              borderColor="gray.200"
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = JSON.parse(JSON.stringify(grid));
                newGrid[i][k] = grid[i][k] ? 0 : 1;
                setGrid(newGrid);
              }}
            />
          )),
        )}
      </Grid>
    </Container>
  );
};

export default Index;
