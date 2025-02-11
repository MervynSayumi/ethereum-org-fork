import { ReactNode, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "next-i18next"
import { MdExpandMore } from "react-icons/md"


import { BaseLink, LinkProps } from "@/components/Link"
import { Box, HStack, Icon } from "@chakra-ui/react"

import docLinks from "../data/developer-docs-links.yaml"
import { DeveloperDocsLink } from "@/lib/interfaces"

export const dropdownIconContainerVariant = {
  open: {
    rotate: 0,
    y: 3,
    transition: {
      duration: 0.4,
    },
  },
  closed: { rotate: -90, y: 0 },
}

const innerLinksVariants = {
  open: {
    opacity: 1,
    display: "block",
  },
  closed: {
    opacity: 0,
    display: "none",
  },
}

const LinkContainer: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <HStack
      w="full"
      justify="space-between"
      py={2}
      pr={4}
      pl={8}
      _hover={{ bgColor: "ednBackground" }}
    >
      {children}
    </HStack>
  )
}

const SideNavLink = ({ children, ...props }: LinkProps) => {
  return (
    <BaseLink
      w="full"
      textDecoration="none"
      color="text"
      fontWeight="normal"
      _hover={{ textDecoration: "none", color: "primary.base" }}
      _active={{ color: "primary.base" }}
      {...props}
    >
      {children}
    </BaseLink>
  )
}

export interface IPropsNavLink {
  item: DeveloperDocsLink
  path: string
}

const NavLink: React.FC<IPropsNavLink> = ({ item, path }) => {
  const { t } = useTranslation("page-developers-docs")
  const isLinkInPath = path.includes(item.to) || path.includes(item.path)
  const [isOpen, setIsOpen] = useState<boolean>(isLinkInPath)

  useEffect(() => {
    // Only set on items that contain a link
    // Otherwise items w/ `path` would re-open every path change
    if (item.to) {
      const shouldOpen = path.includes(item.to) || path.includes(item.path)
      setIsOpen(shouldOpen)
    }
  }, [path, item.path, item.to])

  if (item.items) {
    return (
      <Box>
        <LinkContainer>
          {item.to && (
            <SideNavLink to={item.to} isPartiallyActive={false}>
              {t(item.id)}
            </SideNavLink>
          )}
          {!item.to && (
            <Box w="full" cursor="pointer" onClick={() => setIsOpen(!isOpen)}>
              {t(item.id)}
            </Box>
          )}
          <Box
            as={motion.div}
            onClick={() => setIsOpen(!isOpen)}
            variants={dropdownIconContainerVariant}
            animate={isOpen ? "open" : "closed"}
            cursor="pointer"
          >
            <Icon as={MdExpandMore} boxSize={6} color="secondary" />
          </Box>
        </LinkContainer>
        <Box
          as={motion.div}
          fontSize="sm"
          lineHeight="tall"
          fontWeight="normal"
          ml={4}
          key={item.id}
          animate={isOpen ? "open" : "closed"}
          variants={innerLinksVariants}
          initial="closed"
        >
          {item.items.map((childItem, idx) => (
            <NavLink item={childItem} path={path} key={idx} />
          ))}
        </Box>
      </Box>
    )
  }
  return (
    <Box>
      <LinkContainer>
        <SideNavLink to={item.to} isPartiallyActive={false}>
          {t(item.id)}
        </SideNavLink>
      </LinkContainer>
    </Box>
  )
}

export interface SideNavProps {
  path: string
}

// TODO set tree state based on if current path is a child
// of the given parent. Currently all `path` items default to open
// and they only collapse when clicked on.
// e.g. solution: https://github.com/hasura/gatsby-gitbook-starter/blob/5c165af40e48fc55eb06b45b95c84eb64b17ed32/src/components/sidebar/tree.js
const SideNav = ({ path }: SideNavProps) => {
  const { t } = useTranslation("page-developers-docs")

  return (
    <Box
      as="nav"
      position="sticky"
      top="7.25rem"
      pt={8}
      pb={16}
      h="calc(100vh - 80px)" // TODO take footer into account for height?
      w="calc((100% - 1448px) / 2 + 298px)"
      minW="298px"
      overflowY="auto"
      transition="transform 0.2s ease"
      bgColor="background.base"
      boxShadow="1px 0px 0px rgba(0, 0, 0, 0.1)"
      borderRight="1px solid"
      borderRightColor="border"
      display={{ base: "none", lg: "block" }}
      aria-label={t("common:nav-developers-docs")}
    >
      {docLinks.map((item, idx) => (
        <NavLink item={item} path={path} key={idx} />
      ))}
    </Box>
  )
}

export default SideNav
