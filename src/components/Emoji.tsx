import { BaseProps,Twemoji } from "react-emoji-render"
import { Box, BoxProps } from "@chakra-ui/react"

import { IS_DEV } from "@/lib/utils/env"

export interface IProps extends Omit<BoxProps, "children">, BaseProps {}

const Emoji = (props: IProps) => {
  return (
    <Box
      as={Twemoji}
      // The emoji lib is switching the protocol based on the existence of the
      // `location` object. That condition in DEV causes hydration mismatches.
      // https://github.com/tommoor/react-emoji-render/blob/master/src/index.js#L8
      // Hence, here we are defining how we want it to handle the protocol to
      // avoid differences in SSR
      options={{ protocol: IS_DEV ? "http" : "https" }}
      svg
      display="inline-block"
      lineHeight="none"
      sx={{
        "& > img": {
          margin: "0 !important",
          display: "initial",
        },
      }}
      {...props}
    />
  )
}

export default Emoji
