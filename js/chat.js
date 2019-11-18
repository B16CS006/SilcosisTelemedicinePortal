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

var appendMessage = function(message, whom){
    var messageDiv = document.createElement('div')
    messageDiv.setAttribute('class', 'card-block');
    messageDiv.textContent = message
    messageDiv.style.margin = "4px 4px 0px 4px"
    messageDiv.style.padding = "5px 10px 5px 10px"
    messageDiv.style.display = 'block'
    if(whom === 'myMessage'){
        messageDiv.style.backgroundColor = '#b3ffb3'
        // messageDiv.style.color = 'blue'
        messageDiv.style.cssFloat = 'right'
    }else{
        messageDiv.style.backgroundColor = '#b3c6ff'
        // messageDiv.style.color = 'green'
        messageDiv.style.cssFloat = 'left'
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
    
    peer.on('signal', function(data){
        console.log('signal: ' + JSON.stringify(data))
        element('myChatID').value = JSON.stringify(data)
    })
    
    peer.on('data', function(data){
        console.log('received: ' + data)
        appendMessage(data, 'otherMessage')
    })

    element('chatConnectButton').addEventListener('click', () => {
        var otherChatID = JSON.parse(element('otherChatID').value)
        peer.signal(JSON.stringify(otherChatID))
    })
    
    element('sendMessage').addEventListener('click', () => {
        sendMessage()
    })

    messageInput.addEventListener('keydown', (event) => {
        if(event.which == 13 && event.shiftKey == false){
            sendMessage()
        }
    })

    var sendMessage = function(){
        console.log('new function');
        
        let message = messageInput.value
        if(message !== '' && message !== null && message !== undefined){
            messageInput.value = ''
            peer.send(message)
            appendMessage(message, 'myMessage')
        }
        console.log('Send: ' + message)
    }
 }