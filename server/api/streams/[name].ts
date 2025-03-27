import type { Peer, Message } from 'crossws';

const connections : Record<string, any> = {}
const intervalIds : Record<string, any> = {}

export default defineWebSocketHandler({
  open(peer: Peer) {
    console.log('Open', peer.toString());

    peer.send(JSON.stringify({ message: 'Opening the socket' }));

    peer.subscribe(peer.toString());
  },
  message(peer: Peer, message: Message) {
    const data = JSON.parse(message.toString()); 

    let interval = 0

    if (data.type === 'sendTest') {
      peer.send(`Regular fetch: ${peer.toString()}: ${data.message}`);
    }

    if (data.type === 'startInterval') {
        intervalIds[peer.toString()] = setInterval(() => {
            interval++
            peer.send(`Interval fetch (${interval}): ${peer.toString()}: ${data.message} + ${interval}`);
        }, 2000);
    }

    if (data.type === 'stopInterval') {
        clearInterval(intervalIds[peer.toString()])
        interval = 0
    }
  },
  close(peer: Peer) {
    console.log('Close', peer.toString());

    peer.send(JSON.stringify({ type: 'goodbye', message: 'Closing the socket' }));

    peer.unsubscribe(peer.toString());
  }
})