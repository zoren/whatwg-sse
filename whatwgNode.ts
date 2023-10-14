import { createServerAdapter } from '@whatwg-node/server'
 import { requestToResponse } from './serverFn'

export default createServerAdapter(requestToResponse)