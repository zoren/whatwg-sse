import { createServer } from 'node:http'
import myServerAdapter from './whatwgNode'

// You can create your Node server instance by using our adapter
const nodeServer = createServer(myServerAdapter)
// Then start listening on some port
nodeServer.listen(4000)
