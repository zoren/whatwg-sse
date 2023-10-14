const eventSource = new EventSource('/streaming')

function consoleLogListener (event) {
  console.log('eventsource', event.type, event, this)
}

for (const type of ['open', 'message', 'error']) {
  eventSource.addEventListener(type, consoleLogListener)
}
