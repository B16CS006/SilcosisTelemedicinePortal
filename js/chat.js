var element = function(id){ return document.getElementById(id) }

// var status = element('chatStatus')
// var statusDefault = status.textContent
// var setStatus = function(s){
//     status.textContent = s
//     if(s !== statusDefault){
//         var delay = setTimeout(() => {
//             setStatus(statusDefault)
//         }, 4000);
//     }
// }

var messagesDiv = element('messages')

var appendMessage = function(data){
    console.log(data)
    var messageDiv = document.createElement('div')
    messageDiv.textContent = data.message
    if(data.who === 'myMessage'){
        messageDiv.setAttribute('class', 'card myMessage message')
    }else if(data.who === 'otherMessage'){
        messageDiv.setAttribute('class', 'card otherMessage message')
    }else if(data.who === '_connection_'){
        messageDiv.setAttribute('class', 'card connection message')
    }else{
        messageDiv.setAttribute('class', 'card unknownMessage message')
    }

    messagesDiv.appendChild(messageDiv)
    messagesDiv.scrollTop = messagesDiv.scrollHeight
}

let peer
var Peer = require('simple-peer')

navigator.mediaDevices.getUserMedia({video: true, audio: true})
.then(stream => {
    const video = document.querySelector('video')
    video.srcObject = stream // to user can see himself
    video.play()

    peer = new Peer({
        initiator: location.hash === '#init',
        trickle: false,
        stream: stream
    })
    
    peer.on('stream', function(stream){
        let video = document.createElement('video')
        document.querySelector('#otherVideo').appendChild(video)
        video.srcObject = stream
        video.class  = 'embed-responsive-item' 
        video.play()
    })
    startComunication(peer)
}).catch(err => {
    // document.write(err)
    peer = new Peer({
        initiator: location.hash === '#init',
        trickle: false
    })
    startComunication(peer)
})

var startComunication = function(peer){
    console.log('startCommunication')
    var messageInput = element('writeMessage')
    
    element('chatConnectButton').addEventListener('click', () => {
        var otherChatID = JSON.parse(element('otherChatID').value)
        peer.signal(JSON.stringify(otherChatID))
    })

    peer.on('signal', function(data){
        console.log('signal: ' + JSON.stringify(data))
        element('myChatID').value = JSON.stringify(data)
    })
    
    peer.on('data', function(message){
        console.log('received: ' + message)
        appendMessage({message:message, who:'otherMessage'})
    })

    peer.on('connect', () => {
        console.log('connected')
        
        element('sendMessage').addEventListener('click', () => {
            sendMessage()
        })
    
        messageInput.addEventListener('keydown', (event) => {
            if(event.which == 13 && event.shiftKey == false){
                sendMessage()
            }
        })
        appendMessage({message:'Connected', who:'_connection_'})
    })

    var sendMessage = function(){
        let message = messageInput.value.trim()
        if(message !== '' && message !== null && message !== undefined){
            messageInput.value = ''
            peer.send(message)
            appendMessage({message:message, who:'myMessage'})
        }else{
            messageInput.value = ''
        }
    }
 }