import { ListProps } from "@chakra-ui/react"

import type { SourceHeadingItem, ToCItem } from "@/lib/types"

// RegEx patterns
const customIdRegEx = /^.+(\s*\{#([^\}]+?)\}\s*)$/
const unicodeEmojiRegEx = /\\u{[0-9A-F]+}/gi
const unicodeIntlRegEx = /(\\u[0-9A-F]{2,4}|\\x[0-9A-F]{2})/g
const compiledSourceHeadingRegEx =
  /mdx\("h([2-4])",\w+?\(.+?\{id:"([^"]+)"\}\)((,("([^"]+)"|mdx\([^\)]+\)))+)\)/g
const mdxShallowFncRegEx = /mdx\("?(\w+)"?,\{[^\}]+\}(,\"([^\"]+)\")?\)/g
const stringRegEx = /"([^"]+)"/g
const csvCommaRegEx =
  /(?<=mdx\("?(\w+)"?,\{[^\}]+\}(,\"([^\"]+)\")?\)|"([^"]+)"),(?=mdx\("?(\w+)"?,\{[^\}]+\}(,\"([^\"]+)\")?\)|"([^"]+)")/g

/**
 * Creates a slug from a string (Hello world => hello-world)
 * @param s Any string
 * @returns Lowercased string with spaces replaced with hyphens (kebab-casing)
 */
const slugify = (s: string): string =>
  encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, "-"))

/**
 * Parse a heading ID from a Markdown heading string. If the heading contains a custom ID,
 * it will be used as the ID, otherwise the heading will be slugified
 * @param heading Heading string without leading #s that may contain a {#custom-id}
 * @returns Heading ID string
 */
export const parseHeadingId = (heading: string): string => {
  const match = customIdRegEx.exec(heading)
  return match ? match[2].toLowerCase() : slugify(heading)
}

/**
 * Parse out the title to be displayed in the Table of Contents
 * @param title Heading string without leading #s that may contain Emoji's or a {#custom-id}
 * @returns Title string with custom ID and Emoji's removed
 */
export const parseToCTitle = (title: string): string => {
  const match = customIdRegEx.exec(title)
  const trimmedTitle = match ? title.replace(match[1], "").trim() : title
  const sanitizedTitle = trimmedTitle
    .replaceAll(unicodeEmojiRegEx, (match) =>
      String.fromCodePoint(parseInt(match.slice(3, -1), 16))
    )
    .replaceAll(unicodeIntlRegEx, (match) =>
      String.fromCharCode(parseInt(match.slice(2), 16))
    )
  return sanitizedTitle
}

/**
 * Common props used used for the outermost list element in the mobile and desktop renders
 */
export const outerListProps: ListProps = {
  borderStart: "1px solid",
  borderStartColor: "dropdownBorder",
  borderTop: 0,
  fontSize: "sm",
  lineHeight: 1.6,
  fontWeight: 400,
  m: 0,
  mt: 2,
  mb: 2,
  ps: 4,
  pe: 1,
  pt: 0,
  sx: {
    // TODO: Flip to object syntax with `lg` token after completion of Chakra migration
    "@media (max-width: 1024px)": {
      borderStart: 0,
      borderTop: "1px",
      borderTopColor: "primary300",
      ps: 0,
      pt: 4,
    },
  },
}

/**
 * Refactor title and URL from `SourceHeadingItem` object. The contained `id`'s are obtained
 * from the compiled DOM source and do not need further alteration.
 * @param heading SourceHeadingItem object with label and id strings
 * @returns Object of type `Item` containing `title` and `url` properties parsed from heading
 */
const parseSourceToToCItem = ({ label, id }: SourceHeadingItem): ToCItem => ({
  title: parseToCTitle(label),
  url: "#" + id,
})

/**
 * Recursive function used to generate nested array of `Items`, nesting according to heading depth
 * @param headings Array of `SourceHeadingItem` objects: { depth: number, id: string, label: string }
 * @param h Heading level being parsed (2 for h2, 3 for h3, 4 for h4), starting with 2
 * @returns Array of `Item` objects parsed from the headings
 */
const addHeadingsAsItems = (
  headings: Array<SourceHeadingItem>,
  h = 2
): Array<ToCItem> => {
  const items: Array<ToCItem> = []
  const depths: number[] = headings.map(({ depth }) => depth)
  depths.forEach((depth, i): void => {
    if (depth !== h) return
    const headingItem = parseSourceToToCItem(headings[i])
    if (depths[i + 1] > h) {
      const start = i + 1
      const rest = depths.slice(start)
      const stepOutIndex = rest.indexOf(h)
      const end = stepOutIndex < 0 ? headings.length : start + stepOutIndex
      const subHeadings = headings.slice(start, end)
      headingItem.items = addHeadingsAsItems(subHeadings, h + 1)
    }
    items.push(headingItem)
  })
  return items
}

/**
 * Takes in a match result for a single heading, and parses out the depth, id, and label
 * The label is sanitized to simplify any components (ie, `strong`, `code`, `Emoji`, etc)
 * to their string argument. For example, `strong` tags will reduce to child text, and Emoji's
 * have no string argument and are skipped. Parts are joined to form the heading label.
 * @param headingMatch RegExpMatchArray for a single heading match
 * @returns `SourceHeadingItem` object: { depth: number, id: string, label: string }
 */
const processHeadingMatch = (
  headingMatch: RegExpMatchArray
): SourceHeadingItem => {
  const [_, depth, id, rest] = headingMatch
  const label = rest
    .slice(1) // Remove leading comma from match
    .replaceAll(csvCommaRegEx, "") // Remove top-level commas (skip those between quotes)
    .replaceAll(mdxShallowFncRegEx, (...match) => match[3] ?? "") // Reduce mdx() functions to its string argument if available
    .replaceAll(stringRegEx, (...match) => match[1] ?? "") // Remove quotes from string arguments
  return { depth: +depth, id, label }
}

/**
 * Generates a Table of Contents from a compiled page source string, after markdown has been parsed into DOM elements
 * Parses all h2/3/4 elements into an array of `SourceHeadingItem` objects using regex matching
 * Note: each file should only have one h1, and it is not included in the ToC
 * Removes component functions such as Emoji components) and joins rest to form heading label
 * Calls `addHeadingAsItem` with array of `SourceHeadingItem` objects to generate list of `Item` objects
 * @param content Compiled page source from mdx compiler (string)
 * @returns List of `Item` objects parsed from the compiled source, nested according to heading depth
 */

export const generateTableOfContents = (
  compiledSource: string
): Array<ToCItem> => {
  const matchAll = compiledSource.matchAll(compiledSourceHeadingRegEx)
  const matches = Array.from(matchAll).slice(0)
  const headings: Array<SourceHeadingItem> = matches.map(processHeadingMatch)
  return addHeadingsAsItems(headings)
}
