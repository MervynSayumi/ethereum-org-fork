import fs from "fs"
import { extname, join } from "path"

import matter from "gray-matter"

import type { Frontmatter } from "@/lib/types"
import type { MdPageContent } from "@/lib/interfaces"

import { getFallbackEnglishPath, removeEnglishPrefix } from "@/lib/utils/i18n"

import { CONTENT_DIR, DEFAULT_LOCALE, LOCALES_CODES } from "@/lib/constants"

const CURRENT_CONTENT_DIR = join(process.cwd(), CONTENT_DIR)

const getPostSlugs = (dir: string, files: string[] = []) => {
  const contentDir = join(CURRENT_CONTENT_DIR, dir)

  // Get an array of all files and directories in the passed directory using `fs.readdirSync`
  const fileList = fs.readdirSync(contentDir)

  // Create the full path of the file/directory by concatenating the passed directory and file/directory name
  for (const file of fileList) {
    const name = join(contentDir, file)

    // Check if the current file/directory is a directory using fs.statSync
    if (fs.statSync(name).isDirectory()) {
      // If it is a directory, recursively call the `getPostSlugs` function with the
      // directory path and the files array
      const nestedDir = join(dir, file)

      getPostSlugs(nestedDir, files)
    } else {
      const fileExtension = extname(name)

      if (fileExtension === ".md") {
        if (process.env.ALLOWED_PAGES) {
          const temporalAllowedPages = process.env.ALLOWED_PAGES.split(",")
          // If it is a .md file (allowed content page), push the path to the files array
          for (const page of temporalAllowedPages) {
            const fullPagePath = join(CURRENT_CONTENT_DIR, page)

            if (name.includes(fullPagePath)) {
              files.push(
                fullPagePath
                  .replace(CURRENT_CONTENT_DIR, "")
                  .replace("/index.md", "")
                  // For replacing forward slashes generated in windows file paths
                  .replace(/\\/g, "/")
              )
            }
          }
        } else {
          files.push(
            name
              .replace(CURRENT_CONTENT_DIR, "")
              .replace("/index.md", "")
              // For replacing forward slashes generated in windows file paths
              .replace(/\\/g, "/")
          )
        }
      }
    }
  }

  return files
}

export const getContentBySlug = (slug: string) => {
  // If content is in english, remove en/ prefix so filepath can be read correctly
  let realSlug = removeEnglishPrefix(slug)

  for (const code of LOCALES_CODES) {
    // Adds `translations/` prefix for translated content so file path can be read correctly
    if (code !== DEFAULT_LOCALE && slug.split("/").includes(code)) {
      realSlug = join("translations", slug, "index.md")
    }
  }

  let fullPath = join(CURRENT_CONTENT_DIR, realSlug)
  let contentNotTranslated = false

  // If content is not translated, use english content fallback
  if (!fs.existsSync(fullPath)) {
    fullPath = getFallbackEnglishPath(fullPath)
    contentNotTranslated = true
  }

  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)
  const frontmatter = data as Frontmatter
  const items: Omit<MdPageContent, "tocItems"> = {
    slug,
    content,
    frontmatter,
    contentNotTranslated,
  }

  return items
}

export const getContent = (dir: string) => {
  const slugs = getPostSlugs(dir)
  const content = slugs.map(getContentBySlug)

  return content
}
