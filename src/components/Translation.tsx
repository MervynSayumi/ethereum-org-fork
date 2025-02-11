import htmr from "htmr"
import { useRouter } from "next/router"
import { useTranslation } from "next-i18next"

import InlineLink from "./Link"
import { getRequiredNamespacesForPath } from "@/lib/utils/translations"

interface Props {
  id: string
  options?: any
}

// Custom components mapping to be used by `htmr` when parsing the translation
// text
const transform = {
  a: InlineLink,
}

// Renders the translation string for the given translation key `id`. It
// fallback to English if it doesn't find the given key in the current language
const Translation = ({ id, options }: Props) => {
  const { asPath } = useRouter()
  const requiredNamespaces = getRequiredNamespacesForPath(asPath)

  const { t } = useTranslation(requiredNamespaces)
  const translatedText = t(id, options)

  // Use `htmr` to parse html content in the translation text
  // @ts-ignore
  return <>{htmr(translatedText, { transform })}</>
}

export default Translation
