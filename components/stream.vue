<template>
    <div v-if="status === 'CLOSED'">
      <button @click="onOpen">Open {{ streamName }}</button>
    </div>
    <div v-if="status === 'OPEN'">
      <button @click="onClose">Close {{ streamName }}</button>
    </div>
    <div v-if="status === 'OPEN'">
        <div>
            <button @click="sendMessage('sendTest')">Receive data</button>
        </div>
        <div>  
            <button @click="sendMessage('startInterval')">Receive data on interval</button>
            <button @click="sendMessage('stopInterval')">Stop receiving data on interval</button>
        </div>
    </div>
    status: {{ status }}
    data: {{ data }}
    <slot />
  </template>
  <script setup lang="ts">
  import { useWebSocket } from '@vueuse/core'

  const { streamName } = defineProps<{
    streamName: string
  }>()
  
  const { status, data, send, open, close } = useWebSocket(`ws://localhost:3001/api/streams/${streamName}`, {
    immediate: false
  })
  
  function sendMessage(type : string) {
    const streamConfig = {
        cookies: [
          {
            value: 'lchfdjkmndcahcdjbi.0.1743347088155.Z0FBQUFBQm42VjJRekxwSUxLVjhHeElaUjhscWR4Y202OUxsSF9NNFJiQlA1VFFsdTE5RnBoSGhDMTNELS1NZHhwaFZCTjVUeE9HblFLcEp5Rmt2UDh3VGkyeHl2dEF6STdkS2I1WmNDLVMzeUtmZmIwWG8tN1ltZ29wUFdvUUhsRzQ0MlZ2MmlsS3A',
            name: 'session_tracker',
            path: '/',
            domain: '.reddit.com'
          },
          {
            value: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IlNIQTI1NjpzS3dsMnlsV0VtMjVmcXhwTU40cWY4MXE2OWFFdWFyMnpLMUdhVGxjdWNZIiwidHlwIjoiSldUIn0.eyJzdWIiOiJsb2lkIiwiZXhwIjoxNzQzNDMwMjA1LjUwOTQwNywiaWF0IjoxNzQzMzQzODA1LjUwOTQwNywianRpIjoicG50YWF2SEhtQzREU2dJdXN4MGNkVDh5dXE1cUJ3IiwiY2lkIjoiMFItV0FNaHVvby1NeVEiLCJsaWQiOiJ0Ml8xbTl1cXowdzBhIiwibGNhIjoxNzQzMzQzODA1NTA4LCJzY3AiOiJlSnhra2RHT3REQUloZC1GYTVfZ2Y1VV9tMDF0Y1lhc0xRYW9rM243RFZvY2s3MDdjRDRwSFA5REtvcUZEQ1pYZ3FuQUJGZ1RyVERCUnVUOW5MbTNnMmlOZTh0WXNabkNCRm13RkRya21MR3NpUVFtZUpJYXl4c21vSUxOeUZ5dXRHTk5MVDBRSnFoY01yZUZIcGMyb2JrYmk1NmRHRlc1ckR5b3NWZmwwdGpHRkxZbnhqY2JxdzJwdUM2bk1rbkxRdmtzWHZUak45VzM5dm16X1NhMEo4T0txdW1CM2hsSkNHNHNmcGltM2Q5VGs1NnRDeGExOTNxUTJ1ZDYzSzU5MWl3ME83ZWY2X2xySXhtWFkyaC1KdnQzMXktaEE0ODhMelBxQUVhczRVY1pkbVFkX2xVSFVMbWdKR01KNHRNSTVNcmwyMzhKdG12VHY4YnRFejk4TS1LbU5feldETlJ6Q2VMUXBfSDFHd0FBX184UTFlVFIiLCJmbG8iOjF9.Lc8QXO1jtHjZQSSf9BhHS9NZmnWTntIkXwsoC2iC9RR1j6kvKgSu0b3mkh1qjAUwHttDykZGgLkvTo9U2DcLQ3g-p3xP3RFJKwoyhavqb22HINkMASWDfAuXV9zbxQw1ItBdqLPBSlYvZ1Hi3R-Do7eIG8hRSaAL30QUi05w1E0-8OLDjF8Mk55KciWFWI8E9ntNNcY_7-WkHGGAMm0mjWVl1Yoz4EbiM2eNQj-yWZo9MIfgien-_mSUk1q6ZulfJ56GNcXn6U6QkYaia5NUsAxCiXfNP573JhE_36qJk-pTpr4MCnIbG2DT-wMdzHmm7DQJVbt2gxZuOMP-1TvCLQ',
            name: 'token_v2',
            path: '/',
            domain: '.reddit.com'
          }
        ],
        streamName,
        url: 'https://www.reddit.com/login',
        loginData: {
            userName: 'vanheindetotverre',
            password: '10*Matthias'
        }
    }

    send(JSON.stringify({ type, message: `Client receiving a message`, streamConfig }));
  }
  
  function onClose() {
    close();
  }
  
  function onOpen() {
    open();
  }
  
  </script>