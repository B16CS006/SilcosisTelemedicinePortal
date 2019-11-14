let Peer = require('simple-peer')
let socket = io()
const video = document.querySelector('video')
// const filter = document.querySelector('#filter')
// const checkboxTheme = document.querySelector('#theme')
let client = {}
// let currentFilter
//get stream

// ask for permission
navigator.mediaDevices.getUserMedia({video: true, audio: true})
.then(stream => {
    socket.emit('NewClient')
    video.srcObject = stream // to user can see himself
    video.play()

    //used to initialize a peer
    function InitPeer(type){
        let peer = new Peer({initiator: (type == 'init')?true: false, stream: stream, trickle: false})
        peer.on('stream', function(stream){
            CreateVideo(stream)
        })
        // peer.on('close', function(){
        //     document.getElementById('peerVideo').remove();
        //     peer.destroy()
        // })

        peer.on('data', function(data){
            let decodedData = new TextDecoder('utf-8').decode(data)
            let peervideo = document.querySelector('#peerVideo')
            peervideo.style.filter = decodedData
        })
        return peer
    }

    //for peer of type init
    function MakePeer(){
        client.gotAnswer = false
        let peer = InitPeer('init')
        peer.on('signal', function(data){
            if(!client.gotAnswer){
                socket.emit('Offer', data)
            }
        })
        client.peer = peer
    }

    //for peer of type notInit
    function FrontAnswer(offer){
        let peer = InitPeer('notInit')
        peer.on('signal', (data) => {
            socket.emit('Answer', data)
        })
        peer.signal(offer)
    }

    //answer came from backent
    function SignalAnswer(answer){
        client.gotAnswer = true
        let peer = client.peer
        peer.signal(answer)
    }

    function CreateVideo(stream){
        let video = document.createElement('video')
        video.id = 'peerVideo'
        video.srcObject = stream
        video.class  = 'embed-responsive-item' 
        document.querySelector('#peerDiv').appendChild(video)
        video.play()
    }

    function SessionActive(){
        document.write('Session Active. Please come back later')
    }

    socket.on('BackOffer', FrontAnswer)
    socket.on('BackAnswer', SignalAnswer)
    socket.on('SessionActive', SessionActive)
    socket.on('CreatePeer', MakePeer)

}).catch(err => document.write(err))
