import { createReadStream } from 'node:fs'
import type { RequestHandler } from './$types'
import stream from 'node:stream'

const FILES = {
  'wjgl-platform-2.9.4-nightly-20150209-natives-osx.jar': { size: 488316 },
  'wjgl-platform-2.9.4-nightly-20150209-natives-linux.jar': { size: 579979 },
  'jinput-platform-2.0.5-natives-osx.jar': { size: 10031 },
  'jinput-platform-2.0.5-natives-linux.jar': { size: 10932 }
}

export const GET: RequestHandler = async ({ params }) => {
  const file = params.file
  const fileStats = FILES[file as keyof typeof FILES]
  if (!fileStats) {
    return new Response(`File not found: ${file}`, { status: 404 })
  }

  const resolvedPath = new URL(`../../../../lib/patches/arm64/${file}`, import.meta.url).pathname

  const nodeStream = createReadStream(resolvedPath)
  const webStream = stream.Readable.toWeb(nodeStream)
  return new Response(webStream as ReadableStream, {
    headers: {
      'Content-Type': 'application/java-archive',
      'Content-Length': fileStats.size.toString()
    }
  })
}

