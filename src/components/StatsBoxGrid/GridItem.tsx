import React from "react"
import { kebabCase } from "lodash"
import { MdInfoOutline } from "react-icons/md"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Box, Flex, Icon, Text,VStack } from "@chakra-ui/react"

import { Direction } from "../../types"
import InlineLink from "../Link"
import OldText from "../OldText"
import StatErrorMessage from "../StatErrorMessage"
import StatLoadingMessage from "../StatLoadingMessage"
import Tooltip from "../Tooltip"
import Translation from "../Translation"

import { Metric, ranges } from "./useStatsBoxGrid"

const tooltipContent = (metric: Metric) => (
  <div>
    <Translation id="data-provided-by" />{" "}
    <InlineLink to={metric.apiUrl}>{metric.apiProvider}</InlineLink>
  </div>
)

interface IGridItemProps {
  metric: Metric
  dir?: Direction
}

export const GridItem: React.FC<IGridItemProps> = ({ metric, dir }) => {
  const { title, description, state, buttonContainer, range } = metric
  const isLoading = !state.value
  const value = state.hasError ? (
    <StatErrorMessage />
  ) : isLoading ? (
    <StatLoadingMessage />
  ) : (
    <VStack>
      <Box>
        {state.value}{" "}
        <Tooltip content={tooltipContent(metric)}>
          <Icon
            as={MdInfoOutline}
            boxSize={6}
            fill="text"
            mr={2}
            _hover={{ fill: "primary.base" }}
            _active={{ fill: "primary.base" }}
            _focus={{ fill: "primary.base" }}
          ></Icon>
        </Tooltip>
      </Box>
    </VStack>
  )

  // Returns either 90 or 30-day data range depending on `range` selection
  const filteredData = (data: Array<{ timestamp: number }>) => {
    if (!data) return
    if (range === ranges[1]) return [...data]
    return data.filter(({ timestamp }) => {
      const millisecondRange = 1000 * 60 * 60 * 24 * 30
      const now = new Date().getTime()
      return timestamp >= now - millisecondRange
    })
  }

  const minValue = state.data.reduce(
    (prev, { value }) => (prev < value ? prev : value),
    1e42
  )

  const maxValue = state.data.reduce(
    (prev, { value }) => (prev > value ? prev : value),
    0
  )

  const chart: React.ReactNode = (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={filteredData(state.data)}
        margin={{ left: -5, right: -5 }}
      >
        <defs>
          <linearGradient
            id={`colorUv-${kebabCase(title)}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor="#8884d8" stopOpacity={1} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient
            id={`colorPv-${kebabCase(title)}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          fillOpacity={0.3}
          fill={`url(#colorUv-${kebabCase(title)})`}
          connectNulls
        />
        <YAxis type="number" domain={[minValue, maxValue]} width={0} />
        <XAxis dataKey="timestamp" axisLine={false} tick={false} />
      </AreaChart>
    </ResponsiveContainer>
  )

  return (
    <Flex
      position="relative"
      color="text"
      height={80}
      flexDirection="column"
      justifyContent="space-between"
      alignItems="flex-start"
      borderX={{
        base: "0px solid #000000",
        lg: "1px solid",
      }}
      borderY="1px solid"
      marginTop={{
        base: "-1px",
        lg: "0",
      }}
      padding={{ base: "2rem 1rem 1rem", lg: "1.5rem" }}
    >
      <Box>
        <Text
          fontSize="xl"
          mb={2}
          color="text"
          textTransform="uppercase"
          fontFamily="monospace"
        >
          {title}
        </Text>
        <OldText>{description}</OldText>
      </Box>
      {!state.hasError && !isLoading && (
        <>
          <Box
            position="absolute"
            left={0}
            bottom={0}
            width="100%"
            height="65%"
          >
            {chart}
          </Box>
          {dir === "rtl" ? (
            <Box
              position="absolute"
              bottom="20px"
              fontFamily="monospace"
              left="20px"
            >
              {buttonContainer}
            </Box>
          ) : (
            <Box
              position="absolute"
              bottom="20px"
              fontFamily="monospace"
              right="20px"
            >
              {buttonContainer}
            </Box>
          )}
        </>
      )}
      <Box
        position="absolute"
        bottom="8%"
        fontSize={{ base: "max(8.8vw, 48px)", lg: "min(4.4vw, 4rem)" }}
        fontWeight={600}
        marginTop={0}
        marginBottom={4}
        color="text"
        flexWrap="wrap"
        textOverflow="ellipsis"
        lineHeight="1.6rem"
      >
        {value}
      </Box>
    </Flex>
  )
}
