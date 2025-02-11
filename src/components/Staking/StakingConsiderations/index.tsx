import { Box, Flex, List, ListItem, useToken, VStack } from "@chakra-ui/react"

import type { StakingPage } from "@/lib/types"

import ButtonDropdown from "@/components/ButtonDropdown"
import {
  CautionProductGlyphIcon,
  GreenCheckProductGlyphIcon,
  WarningProductGlyphIcon,
} from "@/components/icons/staking"
import OldHeading from "@/components/OldHeading"
import Text from "@/components/OldText"
import Translation from "@/components/Translation"

import { trackCustomEvent } from "@/lib/utils/matomo"

import { useStakingConsiderations } from "@/hooks/useStakingConsiderations"

const IndicatorGroup = ({
  label,
  styleObj,
  indicatorType,
}: {
  label: string
  styleObj: object
  indicatorType?: "valid" | "caution"
}) => {
  const IndicatorIcon = ({ style }) => {
    if (indicatorType === "valid") {
      return <GreenCheckProductGlyphIcon style={style} />
    }

    if (indicatorType === "caution") {
      return <CautionProductGlyphIcon style={style} />
    }

    return <WarningProductGlyphIcon style={style} />
  }
  return (
    <VStack
      spacing={2}
      flex={1}
      width={{ base: "fit-content", sm: "max-content" }}
    >
      <IndicatorIcon style={styleObj} />
      <Text
        fontSize="xs"
        textAlign="center"
        width={{ base: "fit-content", sm: "max-content" }}
      >
        <Translation id={label} />
      </Text>
    </VStack>
  )
}

export interface IProps {
  page: StakingPage
}

const StakingConsiderations: React.FC<IProps> = ({ page }) => {
  // TODO: Replace with direct token implementation after UI migration is completed
  const mdBp = useToken("breakpoints", "md")

  const {
    StyledSvg,
    caution,
    description,
    dropdownLinks,
    handleSelection,
    indicatorSvgStyle,
    title,
    valid,
    warning,
    pageData,
    activeIndex,
  } = useStakingConsiderations({ page })

  return (
    <Flex flexDir={{ base: "column", md: "row" }} gap={8}>
      <ButtonDropdown list={dropdownLinks} hideFrom={mdBp} />
      {/* TODO: Improve a11y */}
      <Box flex={1} hideBelow={mdBp}>
        {!!pageData && (
          <List m={0}>
            {/* TODO: Make mobile responsive */}
            {pageData.map(({ title, matomo }, idx) => (
              <ListItem
                key={idx}
                onClick={(e) => {
                  handleSelection(idx)
                  trackCustomEvent(matomo)
                }}
                py={1}
                px={2}
                cursor="pointer"
                h={8}
                position="relative"
                {...(idx === activeIndex
                  ? {
                      bg: "primary.base",
                      color: "background.base",
                      _after: {
                        content: `''`,
                        position: "absolute",
                        height: 0,
                        width: 0,
                        top: 0,
                        left: "100%",
                        border: "1rem solid transparent",
                        borderLeftColor: "primary.base",
                      },
                    }
                  : { color: "primary.base" })}
              >
                {title}
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Flex
        alignItems="center"
        flexDir="column"
        bg="offBackground"
        flex={2}
        minH="410px"
        p={6}
      >
        <StyledSvg />
        <OldHeading
          as="h3"
          fontWeight={700}
          fontSize="27px"
          lineHeight={1.4}
          mt={10}
        >
          {title}
        </OldHeading>
        <Text>{description}</Text>
        <Flex gap={8} justifyContent="center" mt="auto">
          {!!valid && (
            <IndicatorGroup
              label={valid}
              styleObj={indicatorSvgStyle}
              indicatorType="valid"
            />
          )}
          {!!caution && (
            <IndicatorGroup
              label={caution}
              styleObj={indicatorSvgStyle}
              indicatorType="caution"
            />
          )}
          {!!warning && (
            <IndicatorGroup label={warning} styleObj={indicatorSvgStyle} />
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default StakingConsiderations
