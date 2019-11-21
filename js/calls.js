console.log('calls')

createCall()

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
    xmlHttpReq.send(data);
}

function createCall(){
    
    console.log('creating call')
    loadDoc('POST', '/calls/create', data, true, (request) => {
        console.log('Request Send, waiting for response...')
        console.log(request.responseText)
    })
}