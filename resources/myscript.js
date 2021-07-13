/************  This is the javascript file for the meeting page ***************/

window.addEventListener( 'load', () => {


    token = readCookie('token');
    var decoded = jwt_decode(token);
    const username = decoded.username;
 
    $( "#rezisable" ).resizable();
    $("#local").draggable();
    $(".bubble").draggable();
    
    // CHAT BUBBLE STARTS//

    var isMoving = false;
    var isdragging = false;
    var chatMode = false;

    function closeChat(){
        $(".bubble").css("top", "50%").css("left", "-25px").css("transition", "all 0.5s");
        $(".chat").addClass("bounceoutcustom").removeClass("bounceincustom");
        $(".chat").replaceWith($(".chat").clone(true));
    }

    $(".bubble").on("click", function(){
        
        var pos = $(".chat_container").offset();
        
        if(chatMode)
        {
          closeChat();
          chatMode = false;
        }
        else 
        {
            $(".chat").addClass("bounceincustom").removeClass("bounceoutcustom");
            $(".bubble").css("top", (pos.top + 30) + "px").css("left", (pos.left - 0) + "px").css("transition", "all 0.3s");
            $(".chat").replaceWith($(".chat").clone(true));
            chatMode = true;
        }
    });
      
    $(".bubble").mousedown(function(){
        isdragging = false;
    });
      
    $(".bubble").mousemove(function(){
        isdragging = true;
        $(this).css("transition", "all 0s");
    });
      
    $(".bubble").mouseup(function(e){
        e.preventDefault();
        var lastY = window.event.clientY;
        var lastX = window.event.clientX;
        var swidth = $( window ).width();
        
        if(isdragging){
          
          if(chatMode){
            chatMode = false;
            closeChat();
          }
          
          if(lastX > (swidth/2)){
            $(this).css("top", lastY).css("left", (swidth-55) + "px").css("transition", "all 0.4s");
          }else{
            $(this).css("top", lastY).css("left", "25px").css("transition", "all 0.4s");
          }
        }
    });

    var unread_msg_counter= 0;

    document.querySelector( '#bubble' ).addEventListener( 'click', ( e ) => {
        let chatElem = document.querySelector( '.chat' );

        if ( chatElem.classList.contains( 'chat-opened' ) ) {
            chatElem.classList.remove( 'chat-opened' );              
        }

        else {
            chatElem.classList.add( 'chat-opened' );
            unread_msg_counter= 0;
            document.getElementById('new-chat-notification').innerHTML = unread_msg_counter;    
        }

        
    } );
    //CHAT BUBBLE ENDS//

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function ValidURL(str) {
        var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        if(!regex .test(str)) {
          return false;
        } else {
          return true;
        }
    }

    function pageHasFocus() {
        return !( document.hidden || document.onfocusout || window.onpagehide || window.onblur );
    }
    //adjusting the videos on the page each time a user joins in the meeting
    function adjustVideoElemSize() {
        let elem = document.getElementsByClassName( 'video-card' );
        let totalRemoteVideosDesktop = elem.length;

        let newWidth = totalRemoteVideosDesktop == 1 ? '100%' : (
            totalRemoteVideosDesktop == 2 ? '50%' : (
                totalRemoteVideosDesktop == 3 ? '33.33%' : (
                    totalRemoteVideosDesktop <= 8 ? '25%' : (
                        totalRemoteVideosDesktop <= 15 ? '20%' : (
                            totalRemoteVideosDesktop <= 18 ? '16%' : (
                                totalRemoteVideosDesktop <= 23 ? '15%' : (
                                    totalRemoteVideosDesktop <= 32 ? '12%' : '10%'
                                )
                            )
                        )
                    )
                )
            )
        );

        let newHeight = totalRemoteVideosDesktop == 1 ? '100vh' : (
            totalRemoteVideosDesktop == 2 ? '100vh' : (
                totalRemoteVideosDesktop == 3 ? '50vh' : (
                    totalRemoteVideosDesktop <= 8 ? '50vh' : (
                        totalRemoteVideosDesktop <= 15 ? '50vh' : (
                            totalRemoteVideosDesktop <= 18 ? '50vh' : (
                                totalRemoteVideosDesktop <= 23 ? '50vh' : (
                                    totalRemoteVideosDesktop <= 32 ? '50vh' : '10%'
                                )
                            )
                        )
                    )
                )
            )
        );
                                    
        for ( let i = 0; i < totalRemoteVideosDesktop; i++ ) {
            elem[i].style.width = newWidth;
            elem[i].style.height = newHeight;

           
        }
    };

    //FUNCTION TO REMOVE VIDEO ELEMENT ONCE USER DISCONNECTS
    function closeVideo( elemId ) {
        if ( document.getElementById( elemId ) ) {
            document.getElementById( elemId ).remove();
           adjustVideoElemSize();
        }
    };

    // TO MOVE PAGE FOCUS TO LATEST MESSAGE
    function pageHasFocus() {
        return !( document.hidden || document.onfocusout || window.onpagehide || window.onblur );
    };

    // TO FIND THE 'GET' VARIABLE VALUES FROM URL
    function getQString( url = '', keyToReturn = '' ) {
        url = url ? url : location.href;
        let queryStrings = decodeURIComponent( url ).split( '#', 2 )[0].split( '?', 2 )[1];

        if ( queryStrings ) {
            let splittedQStrings = queryStrings.split( '&' );

            if ( splittedQStrings.length ) {
                let queryStringObj = {};

                splittedQStrings.forEach( function ( keyValuePair ) {
                    let keyValue = keyValuePair.split( '=', 2 );

                    if ( keyValue.length ) {
                        queryStringObj[keyValue[0]] = keyValue[1];
                    }
                } );

                return keyToReturn ? ( queryStringObj[keyToReturn] ? queryStringObj[keyToReturn] : null ) : queryStringObj;
            }

            return null;
        }

        return null;
    };

    function generateRandomString() {
        const crypto = window.crypto || window.msCrypto;
        let array = new Uint32Array(1);
        
        return crypto.getRandomValues(array);
    };

    // get a unique room corresponding to each meeting 
    const room = getQString( location.href, 'room' );
    


    // LINK SHARING WITH FRIENDS
    const shareButton = document.querySelector('#share-link');
    shareButton.addEventListener('click', event => {
        if (navigator.share) { 
            navigator.share({
            title: 'Share Meeting With Friends',
            url: window.location.href
            }).then(() => {
            console.log('Thanks for sharing!');
            })
            .catch(console.error);
            } 
        });
            
    //WEBRTC AND SOCKET.IO BEGINS HERE
    var pc =  new Map();
    let socket = io();
    var socketId = '';
    var myStream = '';
    var screen = '';

    //GET USER VIDEO BY DEFAULT
    navigator.mediaDevices.getUserMedia( {
        video: true,
        audio: {
            echoCancellation: true,
            noiseSuppression: true
        }
    } ).then( ( stream ) => { //SAVE LOCAL STREAM
        myStream = stream;
        mirrorMode = false;
        const localVidElem = document.getElementById( 'local' );
        localVidElem.srcObject = stream;
        mirrorMode ? localVidElem.classList.add( 'mirror-mode' ) : localVidElem.classList.remove( 'mirror-mode' );
    } ).catch( ( e ) => {
        console.error( `stream error: ${ e }` );
    } );
        

    //SOCKET CONNECTION
    socket.on( 'connect', () => {

        socketId = socket.io.engine.id;

        socket.emit( 'subscribe', {
            room: room,
            socketId: socketId,
            printname:username
        } );

        socket.on( 'new user', ( data ) => {
            socket.emit( 'newUserStart', { to: data.socketId, sender: socketId, printname:data.printname } );
            init( true, data.socketId, data.printname );
        } );

        socket.on( 'newUserStart', ( data ) => {
            init( false, data.sender, data.printname );
        } );

        socket.on( 'ice candidates', async ( data ) => {
            data.candidate ? await pc[data.sender].pcc.addIceCandidate( new RTCIceCandidate( data.candidate ) ) : '';
        } );

        socket.on( 'sdp', async ( data ) => {
            if ( data.description.type === 'offer' ) {
                data.description ? await pc[data.sender].pcc.setRemoteDescription( new RTCSessionDescription( data.description ) ) : '';

                navigator.mediaDevices.getUserMedia( {
                    video: true,
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true
                    }
                } ).then( async ( stream ) => {
                    if ( !document.getElementById( 'local' ).srcObject ) {
                        mirrorMode = false;
                        const localVidElem = document.getElementById( 'local' );
                        localVidElem.srcObject = stream;
                        mirrorMode ? localVidElem.classList.add( 'mirror-mode' ) : localVidElem.classList.remove( 'mirror-mode' );
                    }
                    //SAVE MY STREAM
                    myStream = stream;

                    stream.getTracks().forEach( ( track ) => {
                        pc[data.sender].pcc.addTrack( track, stream );
                    } );

                    let answer = await pc[data.sender].pcc.createAnswer();
                    await pc[data.sender].pcc.setLocalDescription( answer );

                    socket.emit( 'sdp', { description: pc[data.sender].pcc.localDescription, to: data.sender, sender: socketId, printname:data.printname } );
                } ).catch( ( e ) => {
                    console.error( e );
                } );
            }

            else if ( data.description.type === 'answer' ) {
                await pc[data.sender].pcc.setRemoteDescription( new RTCSessionDescription( data.description ) );
            }
        } );

        //SOCKET CHAT
        socket.on( 'chat', ( data ) => {
            addChat( data, 'remote' );
        } );

        //SOCKET TYPING INDICATOR        
        socket.on('display_typing_indicator', (data)=>{
            if(data.indicator==true)
                {
                    $('.typing').text(`${data.sender}`);
                    $('.ticontainer').show();
                }
            else
            {
                $('.typing').text("");
                $('.ticontainer').hide();
            }
            })
        //SOCKET TYPING INDICATOR ENDS
    } );


    //RETRIVE THE SAVED CHAT HISTORY
    socket.on('savedchat',(data)=>{

        for(let i=0;i<data.length;i++)  
        {

            if(data[i].sender_database == username ){
                retrieve_chat( data[i], 'local' );
            }

            else
            {
                retrieve_chat( data[i], 'remote' );
            }
        }   
    });

    //RETRIEVE CHAT FUNCTION STARTS
    function  retrieve_chat( info, senderType ) {
        let chatMsgDiv = document.querySelector( '#chat-messages' );
        let contentAlign = 'justify-content-end';
        let senderName = 'You';
        let msgBg = 'chat-box-sender-arrow magictime slideRightReturn';
        let msg_time = info.time_database;

        if ( senderType === 'remote' ) {
            contentAlign = 'justify-content-start';
            senderName = info.sender_database;
            
            msgBg = 'chat-box-reciever-arrow magictime slideLeftReturn ';
            
            if ( document.querySelector( '.chat' ).classList.contains( 'chat-opened' ) ) {

                unread_msg_counter= 0;
                document.getElementById('new-chat-notification').innerHTML = unread_msg_counter;
            }
    
            else {
                unread_msg_counter = unread_msg_counter + 1;
                document.getElementById('new-chat-notification').innerHTML = unread_msg_counter;
            }

        }

        let infoDiv = document.createElement( 'div' );
        infoDiv.className = 'sender-info';
        infoDiv.innerHTML = `${ senderName } - ${ msg_time }`;

        let colDiv = document.createElement( 'div' );
        colDiv.className = `col-9 card chat-card msg ${ msgBg }`;
        colDiv.innerHTML = xssFilters.inHTMLData( info.message_database ).autoLink( { target: "_blank", rel: "nofollow"});

        let rowDiv = document.createElement( 'div' );
        rowDiv.className = `row ${ contentAlign } mb-2`;


        colDiv.appendChild( infoDiv );
        rowDiv.appendChild( colDiv );
        chatMsgDiv.appendChild( rowDiv );

        if ( pageHasFocus() ) {
            rowDiv.scrollIntoView();
        }
    }
    //RETRIEVE CHAT FUNCTION ENDS



    //ADD CHAT FUNCTION STARTS HERE
    function  addChat( data, senderType ) {
        let chatMsgDiv = document.querySelector( '#chat-messages' );
        let contentAlign = 'justify-content-end';
        let senderName = 'You';
        let msgBg = 'chat-box-sender-arrow magictime slideRightReturn';

        if ( senderType === 'remote' ) {
            contentAlign = 'justify-content-start';
            senderName = data.sender;
            msgBg = 'chat-box-reciever-arrow magictime slideLeftReturn ';
            
            if ( document.querySelector( '.chat' ).classList.contains( 'chat-opened' ) ) {

                unread_msg_counter= 0;
                document.getElementById('new-chat-notification').innerHTML = unread_msg_counter;
            }
    
            else {
                unread_msg_counter = unread_msg_counter + 1;
                document.getElementById('new-chat-notification').innerHTML = unread_msg_counter;
            }

        }

        let infoDiv = document.createElement( 'div' );
        infoDiv.className = 'sender-info';
        infoDiv.innerHTML = `${ senderName } - ${ moment().format( 'h:mm a' ) }`;

        let colDiv = document.createElement( 'div' );
        colDiv.className = `col-9 card chat-card msg ${ msgBg }`;
        colDiv.innerHTML = xssFilters.inHTMLData( data.msg ).autoLink( { target: "_blank", rel: "nofollow"});

        let rowDiv = document.createElement( 'div' );
        rowDiv.className = `row ${ contentAlign } mb-2`;

        if(ValidURL(data.msg)){
                
            let linkDiv = document.createElement( 'div' );
            linkDiv.className = 'link-info';
            linkDiv.innerHTML = data.title;

            let descriptionDiv = document.createElement( 'div' );
            descriptionDiv.className = 'description-info';
            descriptionDiv.innerHTML = data.description;

            let domainDiv = document.createElement( 'div' );
            domainDiv.className = 'domain-info';
            domainDiv.innerHTML = data.domain;

            let imgDiv = document.createElement( 'img' );
            imgDiv.className = 'img-info';
            imgDiv.src = data.img;
    
            
            colDiv.appendChild( imgDiv );
            colDiv.appendChild( domainDiv );
            colDiv.appendChild( descriptionDiv );
            colDiv.appendChild( linkDiv );
        }
        else{
        }

        colDiv.appendChild( infoDiv );
        rowDiv.appendChild( colDiv );
        chatMsgDiv.appendChild( rowDiv );

        if ( pageHasFocus() ) {
            rowDiv.scrollIntoView();
        }
    }
    //ADD CHAT FUNCTION ENDS HERE

    //EMIT CHAT
    function sendMsg( msg ) {
        let data = {
            room: room,
            msg: msg,
            sender: username
            
        };

        //EMIT CHAT MESSAGE
        socket.emit( 'chat', data );

        //ADD LOCALCHAT
        addChat( data, 'local' );
    }
    //EMIT CHAT ENDS

    //TYPING INDICTOR FUNCTION STARTS HERE
    function typing_Indicator(indicator) {
        let data = {
            room: room,
            sender: username,
            indicator:indicator,
        };
        socket.emit( 'indicator', data );

    }
    //TYPING INDICTOR FUNCTION ENDS HERE

    //WEBRTC INIT FUNCTION START HERE
    function init( createOffer, partnerName, printusername ) {
        
        pc[partnerName] = {'printusername': printusername, 'pcc': new RTCPeerConnection({ 
            iceServers: [
                {
                    urls: ["stun:eu-turn4.xirsys.com"]
                },
                {
                    username: "ml0jh0qMKZKd9P_9C0UIBY2G0nSQMCFBUXGlk6IXDJf8G2uiCymg9WwbEJTMwVeiAAAAAF2__hNSaW5vbGVl",
                    credential: "4dd454a6-feee-11e9-b185-6adcafebbb45",
                    urls: [
                        "turn:eu-turn4.xirsys.com:80?transport=udp",
                        "turn:eu-turn4.xirsys.com:3478?transport=tcp"
                    ]
                }
            ]

            })};
        if ( screen && screen.getTracks().length ) {
            screen.getTracks().forEach( ( track ) => {
                pc[partnerName].pcc.addTrack( track, screen );//SHOULD TRIGGER NEGOTIATED EVENT
            } );
        }

        else if ( myStream ) {
            myStream.getTracks().forEach( ( track ) => {
                pc[partnerName].pcc.addTrack( track, myStream );//SHOULD TRIGGER NEGOTIATED EVENT
            } );
        }

        else {
            navigator.mediaDevices.getUserMedia( {
                video: true,
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true
                }
            } ).then( ( stream ) => {
                //SAVE MY STREAM
                myStream = stream;

                stream.getTracks().forEach( ( track ) => {
                    pc[partnerName].pcc.addTrack( track, stream );//SHOULD TRIGGER NEGOTIATED EVENT
                } );

                mirrorMode = false;
                const localVidElem = document.getElementById( 'local' );
                localVidElem.srcObject = stream;
                mirrorMode ? localVidElem.classList.add( 'mirror-mode' ) : localVidElem.classList.remove( 'mirror-mode' );

            } ).catch( ( e ) => {
                console.error( `stream error: ${ e }` );
            } );
        }

        //CREATE OFFER
        if ( createOffer ) {
            pc[partnerName].pcc.onnegotiationneeded = async () => {
                let offer = await pc[partnerName].pcc.createOffer();

                await pc[partnerName].pcc.setLocalDescription( offer );

                socket.emit( 'sdp', { description: pc[partnerName].pcc.localDescription, to: partnerName, sender: socketId, printname:printusername } );
            };
        }

        //SEND ICE CANDITATES TO PARTNER NAMES
        pc[partnerName].pcc.onicecandidate = ( { candidate } ) => {
            socket.emit( 'ice candidates', { candidate: candidate, to: partnerName, sender: socketId, printname:printusername } );
        };

        //ADD REMOTE VIDEOS
        pc[partnerName].pcc.ontrack = ( e ) => {
            let str = e.streams[0];
            if ( document.getElementById( `${ partnerName }-video` ) ) {
                document.getElementById( `${ partnerName }-video` ).srcObject = str;
            }

            else {
                let spanDiv = document.createElement( 'span' );
                spanDiv.className = 'sender_name';
                spanDiv.id='sender_name';
            

                $( document ).ready(function() {

                    spanDiv.innerHTML = pc[partnerName].printusername;

                });
                
                //VIDEO ELEMENT
                let newVid = document.createElement( 'video' );
                newVid.id = `${ partnerName }-video`;
                newVid.srcObject = str;
                newVid.autoplay = true;
                newVid.className = 'remote-video';
                newVid.appendChild(spanDiv);

                //CREATE A NEW DIV FOR CARD
                let cardDiv = document.createElement( 'div' );
                cardDiv.className = 'video-card card-sm col-12';
                cardDiv.id = partnerName;
                cardDiv.appendChild( newVid );
                
            
                //PUT DIV IN MAIN SECTION ELEMENT
                document.getElementById( 'videos' ).appendChild( cardDiv );
                adjustVideoElemSize();

                
            }
        };

        pc[partnerName].pcc.onconnectionstatechange = ( d ) => {
            switch ( pc[partnerName].pcc.iceConnectionState ) {
                case 'disconnected':
                case 'failed':
                    closeVideo( partnerName );
                    break;

                case 'closed':
                    closeVideo( partnerName );
                    break;
            }
        };

        pc[partnerName].pcc.onsignalingstatechange = ( d ) => {
            switch ( pc[partnerName].pcc.signalingState ) {
                case 'closed':

                    closeVideo( partnerName );
                    break;
            }
        };
    }
    //WEBRTC INIT FUNCTION ENDS HERE//

    function toggleShareIcons( share ) {
        let shareIconElem = document.querySelector( '#share-screen' );

        if ( share ) {
            shareIconElem.setAttribute( 'title', 'Stop sharing screen' );
        }

        else {
            shareIconElem.setAttribute( 'title', 'Share screen' );
        }
    }

    
    function toggleVideoBtnDisabled( disabled ) {
        document.getElementById( 'hide-video' ).disabled = disabled;
    }

    function setLocalStream( stream, mirrorMode = true ) {
        const localVidElem = document.getElementById( 'videos' );

        localVidElem.srcObject = stream;
        mirrorMode ? localVidElem.classList.add( 'mirror-mode' ) : localVidElem.classList.remove( 'mirror-mode' );
    }

    function replaceTrack( stream, recipientPeer ) {
        let sender = recipientPeer.getSenders ? recipientPeer.getSenders().find( s => s.track && s.track.kind === stream.kind ) : false;

        sender ? sender.replaceTrack( stream ) : '';
    }

    function shareScreen() {
        navigator.mediaDevices.getDisplayMedia( {
            video: {
                cursor: "always"
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100
            }
        } ).then( ( stream ) => {
                toggleShareIcons( true );

                //disable the video toggle btns while sharing screen. This is to ensure clicking on the btn does not interfere with the screen sharing
                //It will be enabled was user stopped sharing screen
                toggleVideoBtnDisabled( true );

                //save my screen stream
                screen = stream;

                //share the new stream with all partners
                broadcastNewTracks( stream, 'video', false );

                //When the stop sharing button shown by the browser is clicked
                screen.getVideoTracks()[0].addEventListener( 'ended', () => {
                    stopSharingScreen();
                } );
            } ).catch( ( e ) => {
                console.error( e );
        } );
    }
    
    
    
    function stopSharingScreen() {
        //enable video toggle btn
        toggleVideoBtnDisabled( false );

        return new Promise( ( res, rej ) => {
            screen.getTracks().length ? screen.getTracks().forEach( track => track.stop() ) : '';

            res();
        } ).then( () => {
            toggleShareIcons( false );
            broadcastNewTracks( myStream, 'video' );
        } ).catch( ( e ) => {
            console.error( e );
        } );
    }
    
    
    
    function broadcastNewTracks( stream, type, mirrorMode = true ) {
        setLocalStream( stream, mirrorMode );

        let track = type == 'audio' ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0];

        for ( let p in pc ) {
            let pName = pc[p];

            if ( typeof pc[pName] == 'object' ) {
                replaceTrack( track, pc[pName] );
            }
        }
    }
    document.getElementById( 'share-screen' ).addEventListener( 'click', ( e ) => {
        e.preventDefault();

        if ( screen && screen.getVideoTracks().length && screen.getVideoTracks()[0].readyState != 'ended' ) {
            stopSharingScreen();
        }

        else {
            shareScreen();
        }
    } );
            
    
    //CHAT TEXTAREA
    $('#chatting_input').keypress((e)=>{

        if ( e.which === 13 && ( e.target.value.trim() ) ) {
            e.preventDefault();

            sendMsg( e.target.value );

            setTimeout( () => {
                e.target.value = '';
            }, 50 );
        }
    } );

    //TYPING INDICATOR STARTS HERE
    var typing=false;
    var timeout=undefined;
    $('#chatting_input').keypress((e)=>{
        
        if(e.which!=13){
            
            typing=true;
            typing_Indicator(typing); //it is the function

            function typingTimeout(){
                typing=false;
                typing_Indicator(typing);
            }

            timeout=setTimeout(typingTimeout, 3000)

        }
        
        else{
            clearTimeout(timeout)
            typing=false
            typing_Indicator(typing);
            }
        
        });
    ////TYPING INCDICATOR ENDS HERE
            

    //When the video icon is clicked
    document.getElementById( 'hide-video' ).addEventListener( 'click', ( e ) => {
        e.preventDefault();

        let elem = document.getElementById( 'local' );
        if ( myStream.getVideoTracks()[0].enabled ) {
            e.target.classList.remove( 'fa-video' );
            e.target.classList.add( 'fa-video-slash' );
            elem.setAttribute( 'title', 'Show Video' );

            myStream.getVideoTracks()[0].enabled = false;
        }

        else {
            e.target.classList.remove( 'fa-video-slash' );
            e.target.classList.add( 'fa-video' );
            elem.setAttribute( 'title', 'Hide Video' );

            myStream.getVideoTracks()[0].enabled = true;
        }

        broadcastNewTracks( myStream, 'video' );
    } );


    //When the mute icon is clicked
    document.getElementById( 'hide-microphone' ).addEventListener( 'click', ( e ) => {
        e.preventDefault();

        let elem = document.getElementById( 'local' );

        if ( myStream.getAudioTracks()[0].enabled ) {
            e.target.classList.remove( 'fa-microphone' );
            e.target.classList.add( 'fa-microphone-slash' );
            elem.setAttribute( 'title', 'Unmute' );

            myStream.getAudioTracks()[0].enabled = false;
        }

        else {
            e.target.classList.remove( 'fa-microphone-slash' );
            e.target.classList.add( 'fa-microphone' );
            elem.setAttribute( 'title', 'Mute' );

            myStream.getAudioTracks()[0].enabled = true;
        }

        broadcastNewTracks( myStream, 'audio' );
    } );


    //video recording
    function saveRecordedStream( stream, user ) {
        let blob = new Blob( stream, { type: 'video/webm' } );

        let file = new File( [blob], `${ user }-${ moment().unix() }-record.webm` );

        saveAs( file , "yesss.mp4");
    }

    function toggleRecordingIcons( isRecording ) {
        let e = document.getElementById( 'record' );

        if ( isRecording ) {
            e.setAttribute( 'title', 'Stop recording' );
        }

        else {
            e.setAttribute( 'title', 'Record' );
        }
    }

    function startRecording( stream ) {
        mediaRecorder = new MediaRecorder( stream, {
            mimeType: 'video/webm;codecs=vp9'
        } );

        mediaRecorder.start( 1000 );
        toggleRecordingIcons( true );

        mediaRecorder.ondataavailable = function ( e ) {
            recordedStream.push( e.data );
        };

        mediaRecorder.onstop = function () {
            toggleRecordingIcons( false );

            saveRecordedStream( recordedStream, username );

            setTimeout( () => {
                recordedStream = [];
            }, 3000 );
        };

        mediaRecorder.onerror = function ( e ) {
            console.error( e );
        };
    }


    //When user choose to record screen
    document.getElementById( 'record-download' ).addEventListener( 'click', () => {
        

        if ( screen && screen.getVideoTracks().length ) {
            startRecording( screen );
        }

        else {
            navigator.mediaDevices.getDisplayMedia( {
                video: {
                    cursor: "always"
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            } ).then( ( screenStream ) => {
                startRecording( screenStream );
            } ).catch( () => { } );
        }
    } );
        

    document.getElementById( 'close_room' ).addEventListener( 'click', () => {
        var answer = window.confirm("Are you sure you want to leave the meeting?");
        if (answer) {
            window.location = `${ location.origin }/profile`;
        }
        else {
            //some code
        }
        
        
    });

});
