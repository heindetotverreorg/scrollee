import type { Peer, Message } from 'crossws';
import { fetchScrapingResult } from '../scraper'

const connections : Record<string, any> = {}
const intervalIds : Record<string, any> = {}

export default defineWebSocketHandler({
  open(peer: Peer) {
    peer.send(JSON.stringify({ message: 'Opening the socket' }));

    peer.subscribe(peer.toString());
  },
  async message(peer: Peer, message: Message) {
    const data = JSON.parse(message.toString()); 

    const { streamConfig } = data

    let interval = 0

    if (data.type === 'sendTest') {
        const response = await fetchScrapingResult(streamConfig)
        peer.send(`${JSON.stringify(response)}`);
    }

    if (data.type === 'startInterval') {
        const response = await fetchScrapingResult(streamConfig)
        peer.send(`${JSON.stringify(response)}`);
        
        intervalIds[peer.toString()] = setInterval(async () => {
            interval++
            try {
                const response = await fetchScrapingResult(streamConfig)
                peer.send(`${JSON.stringify(response)}`);
            } catch(e) {
                console.log(e)
                peer.send(`Interval fetch (${interval}): ${peer.toString()}: Error: ${e} + ${interval}`);
            }
        }, 10000);
    }

    if (data.type === 'stopInterval') {
        clearInterval(intervalIds[peer.toString()])
        interval = 0
    }
  },
  close(peer: Peer) {
    peer.send(JSON.stringify({ type: 'goodbye', message: 'Closing the socket' }));

    peer.unsubscribe(peer.toString());
  }
})