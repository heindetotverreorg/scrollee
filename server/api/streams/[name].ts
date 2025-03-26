import type { Peer, Message } from 'crossws';

export default defineWebSocketHandler({
  open(peer: Peer) {
    console.log('Open', peer.toString());

    peer.send(JSON.stringify({ type: 'welcome', message: 'Opened the socket test!' }));

    peer.publish(peer.toString(), `${peer.toString()} has joined the socket test!`);

    peer.subscribe(peer.toString());
  },
  message(peer: Peer, message: Message) {
    const data = JSON.parse(message.toString()); 

    if (data.type === 'sendTest') {
      peer.send(`Regular fetch: ${peer.toString()}: ${data.message}`);
    }

    if (data.type === 'intervalTest') {
        let interval = 0
        setInterval(() => {
            interval++
            peer.send(`Interval fetch (${interval}): ${peer.toString()}: ${data.message} + ${interval}`);
        }, 2000);
      }
  },
  close(peer: Peer) {
    console.log('Close', peer.toString());

    peer.send(JSON.stringify({ type: 'goodbye', message: 'Closed to the socket test!' }));

    peer.publish(peer.toString(), `${peer.toString()} has left the socket test!`);

    peer.unsubscribe(peer.toString());
  }
})