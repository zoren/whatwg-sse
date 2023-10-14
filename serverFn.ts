import fs from 'fs'
import type { IncomingMessage } from 'node:http'
import type { Readable } from 'node:stream'
import cookie from 'cookie'
import path from 'path'

//https://stackoverflow.com/a/49428486
// function streamToString (stream) {
//   const chunks = []
//   return new Promise((resolve, reject) => {
//     stream.on('data', chunk => chunks.push(Buffer.from(chunk)))
//     stream.on('error', err => reject(err))
//     stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
//   })
// }
// https://stackoverflow.com/a/63361543
async function readableToString (readable: Readable): Promise<string> {
  // lets have a ReadableStream as a stream variable
  const buffers: Buffer[] = []
  for await (const chunk of readable) {
    buffers.push(Buffer.from(chunk))
  }
  return Buffer.concat(buffers).toString('utf-8')
}

function parseCookie (cookieStr: string) {
  const cookieParserOptions = { decode: str => str }
  return cookie.parse(cookieStr, cookieParserOptions) as Record<string, string>
}

const listeners = new Set<Response>()

function streaming (request: Request) {
  const lastEventIdStr = request.headers.get('last-event-id')
  const ns = lastEventIdStr === null ? ['1', '1'] : lastEventIdStr.split(' ')
  if (ns.length !== 2) throw new Error('bad last-event-id')
  let [n, m] = ns.map(BigInt)

  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  let count = 0
  const interval = setInterval(async () => {
    const sum = n + m
    n = m
    m = sum
    const id = n.toString() + ' ' + m.toString()

    try {
      await writer.ready
      await writer.write(
        `id: ${id}\nevent: message\ndata: hello world ${n} ${m}\n\n`
      )
      if (count === 10) {
        console.log('closing')
        await writer.close()
        clearInterval(interval)
        return
      }
    } catch (e) {
      console.log('error writing ' + id)
      clearInterval(interval)
      return
    }
    if (count === 20) {
      clearInterval(interval)
    }
    count++
  }, 300)
  return new Response(readable, {
    status: 200,
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive'
    }
  })
}

function index ({ method, url }: Request) {
  const js = fs.readFileSync('doc.js', 'utf8')
  const html = `
  <script>
${js}
  </script>
  Hi ${method} ${url} ${new Date().toISOString()}
  `

  return new Response(html, {
    status: 200,
    headers: { 'content-type': 'text/html' }
  })
}

export async function requestToResponse (request: Request) {
  const { method, bodyUsed, body, headers, mode } = request
  const url = new URL(request.url)
  const { pathname, searchParams } = url

  const cookieStr = headers.get('cookie') ?? ''
  //   request.mode
  if (body !== null) {
    const msg: IncomingMessage = body as unknown as IncomingMessage
    msg.headers.accept
    // console.log({ msg })
    const strBody = await readableToString(msg)
    const searchBody = new URLSearchParams(strBody)
    console.log({ cookieStr, searchBody, cookie: parseCookie(cookieStr) })
  }

  switch (pathname) {
    case '/': return index(request)
    case '/streaming': return streaming(request)
  }
  return new Response('not found', { status: 404 })
}
