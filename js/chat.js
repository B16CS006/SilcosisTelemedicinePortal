var Peer = require('simple-peer')

var disconnectCall = element('disconnect')
var checkReply = element('checkReply')
var messagesDiv = element('messages')

checkReply.addEventListener('click', () => {
    checkReply.disabled = true;
    getReply()
})

disconnectCall.addEventListener('click', () => {
    connectionDisconnect()
})

// Add a message to chat
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

// Add Stream to otherVideo
function addOtherUserStream(stream){
    let otherVideo = document.createElement('video')
    document.querySelector('#otherVideo').appendChild(otherVideo)
    if ('srcObject' in otherVideo) {
        otherVideo.srcObject = stream
    } else {
        otherVideo.src = window.URL.createObjectURL(stream)
    }
    // otherVideo.class  = 'embed-responsive-item' 
    otherVideo.play()
}

// Add a entry to database for a call
function createCall(data){
    loadDoc('POST', '/calls/initCall', data, true, (request) => {
        console.log(request.responseText)
        if(!request.error){
            // Initiator now need to check, if other user accept his call, by clicking check reply button
            // Make Disconnect & Check Reply button working
            checkReply.disabled = false
            disconnectCall.disabled = false
            checkReply.style.display = 'inline'
            disconnectCall.style.display = 'inline'
        }else{
            console.log('error', request)
        }
    })
}

// Add a entry to database for a reply
function replyToCall(data){
    loadDoc('POST', '/calls/replyCall', data, true, (request) => {
        console.log(request.responseText)
        if(!request.responseText.error){
            // Wait until initiator accept you offer and appearing a button
            disconnectCall.disabled = false
            disconnectCall.innerHTML = 'Waiting... Click to End Call'
            disconnectCall.style.display = 'inline'
        }
    })
}

// Fetch Replies From The database and send the signal
function getReply(){
    loadDoc('POST', '/calls/getReply', {otherID: otherEmailId}, true, (request) => {
        responseText = JSON.parse(request.responseText)

        if(responseText.error){
            console.log('error', responseText)
            checkReply.disabled = false
            checkReply.style.display = 'inline'
        }else if(responseText.code){
            console.log(responseText.message)
            if(responseText.code === '' && responseText === undefined && responseText === null){
                console.code('Code is not there.')
            }else{
                peer.signal(responseText.code) // Signal that I am connected, i.e. onConnect function called
                checkReply.display = true
                checkReply.style.display = 'none'
            }
        }else{
            console.log('Unknown error in getReply.')
            checkReply.disabled = false
            checkReply.style.display = 'inline'
        }
    })
}

// Delete entries from database and then redirect user to dashbaord page
function connectionDisconnect(){
    loadDoc('POST', '/calls/disconnect', {otherID: otherEmailId}, true, (request) => {
        console.log(request.responseText)
        window.location.replace("/dashboard")
    })
}

// Setting Peering settings 
var startComunication = function(peer){
    // console.log('startCommunication')
    var messageInput = element('writeMessage')

    // Signal the other peer that code is received
    if(location.hash !== '#init'){
        if(code){
            // console.log(code)
            peer.signal(code)
        }else{
            console.error('Unable to find find code, it should be there for communcation');
        }
    }

    /* 
        When a signal is received
        If Initiator then call createCall function
        else call replyToCall function

        For Initiator this function is automatically call once the tab is opened
        while for other user is is call when the this send a signal
    */
    peer.on('signal', function(data){
        let newData = { otherID: otherEmailId, code: JSON.stringify(data) }

        // According to inititor either create a call or reply to a call
        if(location.hash === '#init'){
            console.log('initiating call to ' + otherEmailId)
            createCall(newData)
        }else{
            console.log('connecting to ' + otherEmailId)
            replyToCall(newData)
        }
    })
    
    // Show message when user receive a message
    peer.on('data', function(message){
        console.log('received: ' + message)
        appendMessage({message:message, who:'otherMessage'})
    })

    peer.on('connect', () => {
        console.log('connected')

        // make disconnect button working
        disconnectCall.innerHTML = 'Disconnect' // since we change it to waiting in non-initiator tab
        disconnectCall.disabled = false
        disconnectCall.style.display = 'inline'
        
        // fetchForms()


        // Send Message When user click on send button or hit enter without shift
        element('sendMessage').addEventListener('click', () => {
            sendMessage()
        })
        messageInput.addEventListener('keydown', (event) => {
            if(event.which == 13 && event.shiftKey == false){
                sendMessage()
            }
        })

        // Add a connection message in chat message as it is inside onConnect it is added in both user chat
        appendMessage({message:'Connected', who:'_connection_'})
    })

    peer.on('close', () => {
        connectionDisconnect()
    })

    peer.on('error', (err) => {
        console.log(err)
        // connectionDisconnect()
    })

    // Send message to other peer and added message to own message
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

/*
    Accessing Camera and Audio permisstion from user
    If Permission Granted Make a Video Chat + Text Chat unable
    else Make only Text chat unable
*/
navigator.mediaDevices.getUserMedia({video: true, audio: true})
.then(stream => {
    const video = document.querySelector('video')
    if ('srcObject' in video) {
        video.srcObject = stream
    } else {
        video.src = window.URL.createObjectURL(stream)
    }
    video.play()

    peer = new Peer({
        initiator: location.hash === '#init',
        trickle: false,
        stream: stream
    })

    // Show video of other user as soon as we received the stream of the other user
    peer.on('stream', function(otherStream){
        addOtherUserStream(otherStream)
    })
    startComunication(peer)
    
}).catch(err => {
    peer = new Peer({
        initiator: location.hash === '#init',
        trickle: false
    })
    startComunication(peer)
})