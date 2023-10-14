function actionParseCookie (
  str: string,
  reportBinding: (index: number, eqIndex: number, endIndex: number) => boolean,
  done: () => void
) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string')
  }

  let index = 0
  while (index < str.length) {
    let eqIdx = str.indexOf('=', index)

    // no more cookie pairs
    if (eqIdx === -1) {
      break
    }

    let endIdx = str.indexOf(';', index)

    if (endIdx === -1) {
      endIdx = str.length
    } else if (endIdx < eqIdx) {
      // backtrack on prior semicolon
      index = str.lastIndexOf(';', eqIdx - 1) + 1
      continue
    }

    // const key = str.slice(index, eqIdx).trim()

    // let val = str.slice(eqIdx + 1, endIdx).trim()

    // // quoted values... todo check for end quote too??
    // if (val.charCodeAt(0) === 0x22) {
    //   val = val.slice(1, -1)
    // }

    const cont = reportBinding(index, eqIdx, endIdx)
    if (!cont) {
      break
    }

    index = endIdx + 1
  }
  done()
}
