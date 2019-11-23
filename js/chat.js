var element = function(id){ return document.getElementById(id) }
var checkReply = element('checkReply')
var disconnectCall = element('disconnect')
var formNumberInput = element('formNumber')

let otherEmailId, code, patientDetails, patientDetail

if(location.hash === '#init'){
    otherEmailId = prompt("Please enter email address of user you want to communicate", "test1@gmail.com").trim();
    if(!otherEmailId){
        element('videoChat').innerHTML = 'Please Enter a Valid Email of other User'
        throw 'Invalid Email'
    }
}else{
    urlParams = new URLSearchParams(window.location.search)
    console.log('urlParms', urlParams)
    if(!urlParams.has('code')){
        element('videoChat').innerHTML = 'Code not found'
        throw 'Code not found'
    }
    if(!urlParams.has('otherID')){
        element('videoChat').innerHTML = 'user ID for other user not found.'
        throw 'otherID not found'
    }
    code = urlParams.get('code')
    otherEmailId = urlParams.get('otherID')
}

function loadDoc(method, url, data, isasync, callback){
    let xmlHttpReq
    if (window.XMLHttpRequest) { xmlHttpReq = new XMLHttpRequest(); } // code for modern browsers
    else { xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP"); } // code for old IE browsers

    xmlHttpReq.onreadystatechange = function() {
        if (this.readyState === 4) {
          callback(this);
        }
     };

    xmlHttpReq.open(method, url, isasync);
    xmlHttpReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttpReq.send('data=' + JSON.stringify(data));
}

function createCall(data){
    loadDoc('POST', '/calls/initCall', data, true, (request) => {
        console.log(request.responseText)
        if(!request.error){
            checkReply.disabled = false
            checkReply.style.display = 'inline'
            disconnectCall.disabled = false
            disconnectCall.style.display = 'inline'
            checkReply.addEventListener('click', () => {
                checkReply.disabled = true;
                loadDoc('POST', '/calls/getReply', {otherID: otherEmailId}, true, (request) => {
                    getReply(JSON.parse(request.responseText))
                })
            })
        }else{
            console.log('error', request)
        }
    })
}

function replyToCall(data){
    // console.log('Replying to the call...')
    loadDoc('POST', '/calls/replyCall', data, true, (request) => {
        console.log(request.responseText)
        if(!request.responseText.error){
            disconnectCall.disabled = true
            disconnectCall.innerHTML = 'Waiting...'
            disconnectCall.style.display = 'inline'
        }
    })
}

function connectionDisconnect(){
    console.log('Disconnecting...')
    loadDoc('POST', '/calls/disconnect', {otherID: otherEmailId}, true, (request) => {
        console.log(request.responseText)
        window.location.replace("/dashboard")
    })
}

disconnectCall.addEventListener('click', () => {
    connectionDisconnect()
})

// window.addEventListener('beforeunload', function (e) {
//     e.preventDefault();
//     connectionDisconnect()
//     e.returnValue = '';
// });

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

// console.log(otherEmailId, code)

let peer
var Peer = require('simple-peer')

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

    peer.on('stream', function(stream){
        let video = document.createElement('video')
        document.querySelector('#otherVideo').appendChild(video)
        if ('srcObject' in video) {
            video.srcObject = stream
        } else {
            video.src = window.URL.createObjectURL(stream)
        }
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

    if(location.hash === '#init'){

    }else{
        if(code){
            console.log(code)
            peer.signal(code)
            // element('otherChatID').value = code
        }
    }
    
    // element('chatConnectButton').addEventListener('click', () => {
    //     var otherChatID = JSON.parse(element('otherChatID').value)
    //     console.log(typeof JSON.stringify(otherChatID))
    //     peer.signal(JSON.stringify(otherChatID))
    // })

    peer.on('signal', function(data){
        let newData = {
            otherID: otherEmailId,
            code: JSON.stringify(data)
        }

        if(location.hash === '#init'){
            console.log('initiating call to ' + otherEmailId)
            createCall(newData)
        }else{
            console.log('connecting to ' + otherEmailId)
            replyToCall(newData)
        }
        // element('myChatID').value = JSON.stringify(data)
    })
    
    peer.on('data', function(message){
        console.log('received: ' + message)
        appendMessage({message:message, who:'otherMessage'})
    })

    peer.on('connect', () => {
        console.log('connected')
        disconnectCall.innerHTML = 'Disconnect'
        disconnectCall.disabled = false
        disconnectCall.style.display = 'inline'
        
        fetchForms()

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

    peer.on('close', () => {
        connectionDisconnect()
    })

    peer.on('error', (err) => {
        console.log(err)
        connectionDisconnect()
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

function getReply(responseText){
    if(responseText.error){
        console.log('error', responseText)
        checkReply.disabled = false
    }else if(responseText.code){
        console.log(responseText.message)
        console.log(responseText.code)
        if(responseText.code === '' && responseText === undefined && responseText === null){
            console.code('Code is not there.')
        }else{
            peer.signal(responseText.code)
        }
        checkReply.style.display = 'none'
        // element('otherChatID').value = responseText.code
    }else{
        console.log('Unknown error in getReply.')
        checkReply.disabled = false
    }
}

function fetchForms(){
    console.log('Fetching form...')
    loadDoc('POST', '/patientForm/getAll', otherEmailId, true, (request) => {
        console.log(request.responseText)
        patientDetails = request.responseText.result
        patientDetail = patientDetails[0]

        formNumberInput.addEventListener('keydown', (event) => {
            if(event.which == 13 && event.shiftKey == false){
                var formNumber = parseInt(formNumberInput.value)
                if(!isNaN(formNumber)){
                    if(formNumber >= patientDetails.length){
                        formNumber = patientDetails.length - 1;
                    }
                    patientDetail = patientDetails[formNumber]
                }
            }
        })
    })
}

function handleForm(){
    
}