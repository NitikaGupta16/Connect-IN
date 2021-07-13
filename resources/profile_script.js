
window.addEventListener( 'load', () => {
    
    // function to check if a string is a valid URL or not
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

    // reading the user's name from the cookie
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

    token = readCookie('token');
    // decoding the token received after the cookie is read. If the decoded token matches with the jwt private key, result will be OK
    var decoded = jwt_decode(token);
    const username = decoded.username;
    document.querySelector( '.leaderboard__title--top' ).innerHTML = 'Welcome '+username+'!';

    
    var delete_cookie = function(name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };

    $(document).ready(function(){

        $(document).on("click", ".logout_button", function(){

            var answer = window.confirm("Are you sure you want to Logout?");
                if (answer) {
                    delete_cookie('token');
                    window.location = `${ location.origin }`;
                }
                else {

                }
             
        });

    });


    // Add contact event
    const form = document.getElementById('contact_list_form')
        if(form!==null)
        {
            form.addEventListener('submit', add_contact)
        }
        else
        {
            
        }
        async function add_contact(event) {
            event.preventDefault()

            const contact_name= document.getElementById('contact_name').value
            const unique_link = Math.random().toString(36).substr(2, 5);
            const formType = 'contact';
            

            const result = await fetch('/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contact_name,
                    unique_link,
                    formType, 
                    username,
                })
            }).then((res) => res.json())

            if (result.status === 'ok') {
                // everything went fine
                alert('Contact is now sucessfully saved.');

                $('#contact_list_form').modal('hide');

                let outerDiv = document.querySelector( '#contact_list' );
                let innerDiv = document.createElement( 'article' );
                innerDiv.className = 'leaderboard__profile';
                innerDiv.id = 'leaderboard__profile';
                outerDiv.appendChild( innerDiv );

                let innerinnerDiv = document.createElement( 'span' );
                innerinnerDiv.className = 'leaderboard__name';
                innerinnerDiv.innerHTML = `${ contact_name }`;
                innerDiv.appendChild( innerinnerDiv );


                let innerinnerinnerDiv1 = document.createElement( 'button' );
                innerinnerinnerDiv1.className = 'chat_link btn btn-success hvr-shrink btn-circle fas fa-comment-dots';
                innerDiv.appendChild( innerinnerinnerDiv1 );

                let spanbuttonDiv = document.createElement( 'span' );
                spanbuttonDiv.className = 'hidden_span';
                spanbuttonDiv.innerHTML = `${ unique_link }`;
                innerinnerinnerDiv1.appendChild( spanbuttonDiv );

                let innerinnerinnerDiv = document.createElement( 'button' );
                innerinnerinnerDiv.className = 'video_link btn btn-primary hvr-shrink btn-circle fas fa-video';
                innerDiv.appendChild( innerinnerinnerDiv );
                
                let spanbuttonDiv1 = document.createElement( 'span' );
                spanbuttonDiv1.className = 'hidden_span';
                spanbuttonDiv1.innerHTML = `${ unique_link }`;
                innerinnerinnerDiv.appendChild( spanbuttonDiv1 );
            } else {
                alert(result.error)
            }
        }


    // Create group event
    const form1 = document.getElementById('group_name_form')
        if(form1!==null)
        {
            form1.addEventListener('submit', add_group)
        }

        else
        {
            
        }
        async function add_group(event) {
            event.preventDefault()
            const contact_name1= document.getElementById('contact_name_1').value;
            const contact_name2= document.getElementById('contact_name_2').value;
            const contact_name3= document.getElementById('contact_name_3').value;

            const unique_link = Math.random().toString(36).substr(2, 5);
            const formType = 'group';
            
            const result = await fetch('/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contact_name1,
                    contact_name2,
                    contact_name3,
                    unique_link,
                    formType, 
                    username,
                })
            }).then((res) => res.json())

            if (result.status === 'ok') {
                // everything went fine
                alert('Group is now sucessfully saved.');
                $('#group_name_form').modal('hide');
            } else {
                alert(result.error)
            }
        }

    
    // Change password event
    const form2 = document.getElementById('change_password')
        if(form2!==null)
        {
            form2.addEventListener('submit', change_password)
        }

        else
        {
            
        }
        async function change_password(event) {
            event.preventDefault()
            const password= document.getElementById('password').value;

            const formType = 'new_password';
            
            const result = await fetch('/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newpassword  : password,
                    token: token,
                    formType, 
                })
            }).then((res) => res.json())

            if (result.status === 'ok') {
                // everythign went fine
                alert('Password is now sucessfully changed.');
                $('#change_password').modal('hide');
            } else {
                alert(result.error)
            }
        }


           
    /********************* Handling of sockets begins *******************/
    let socket = io();
        
        // Socket for displaying user's contact list stored in the database
        socket.on( 'connect', () => {

            //set socketId
            socketId = socket.io.engine.id;

            socket.emit( 'subscribetochat', {
                socketId: username,
            } );

            socket.on('contactlist',(data)=>{

                for(let i=0;i<data.length;i++)  
                {

                    if(data[i].friends.length >2)
                    {
                        var name = 'group';
                    }
                    else 
                    {
                        var name ='';
                        if(data[i].friends[0]== username)
                        {
                            name = data[i].friends[1];
                        }
                        else
                        {
                            name = data[i].friends[0];
                        }
                    }
                    var unique_link = data[i].unique_link;

                    let outerDiv = document.querySelector( '#contact_list' );
                    let innerDiv = document.createElement( 'article' );
                    innerDiv.className = 'leaderboard__profile';
                    innerDiv.id = 'leaderboard__profile';
                    outerDiv.appendChild( innerDiv );

                    let innerinnerDiv = document.createElement( 'span' );
                    innerinnerDiv.className = 'leaderboard__name';
                    innerinnerDiv.innerHTML = `${ name }`;
                    innerDiv.appendChild( innerinnerDiv );


                    let innerinnerinnerDiv1 = document.createElement( 'button' );
                    innerinnerinnerDiv1.className = 'chat_link btn btn-success hvr-shrink btn-circle fas fa-comment-dots';
                    innerDiv.appendChild( innerinnerinnerDiv1 );

                    let spanbuttonDiv = document.createElement( 'span' );
                    spanbuttonDiv.className = 'hidden_span';
                    spanbuttonDiv.innerHTML = `${ unique_link }`;
                    innerinnerinnerDiv1.appendChild( spanbuttonDiv );

                    let innerinnerinnerDiv = document.createElement( 'button' );
                    innerinnerinnerDiv.className = 'video_link btn btn-primary hvr-shrink btn-circle fas fa-video';
                    innerDiv.appendChild( innerinnerinnerDiv );
                    
                    let spanbuttonDiv1 = document.createElement( 'span' );
                    spanbuttonDiv1.className = 'hidden_span';
                    spanbuttonDiv1.innerHTML = `${ unique_link }`;
                    innerinnerinnerDiv.appendChild( spanbuttonDiv1 );
                }   
            });  
        });


    
    let unique_link ='';
        $(document).ready(function(){

            $(document).on("click", ".video_link", function(){

                    unique_link = $(this).find('span').html();
                window.location = `${ location.origin }/meeting?room=`+unique_link;
            });
            
            $(document).on("click", ".chat_link", function(){

                if(document.getElementById('chat-messages'))
                {
                    document.getElementById('chat-messages').innerHTML='';
                }
                $('#chatting_input').show;
                unique_link = $(this).find('span').html();

                socket.emit( 'startchat', {
                    unique_link: unique_link,
                    socketId: username
                } );
            });
                
            // Socket for retrieving all the previously saved chats of the user 
            socket.on('savedchat',(data)=>{
                for(let i=0;i<data.length;i++)  
                {
                    console.log(data[i]);
                    if(data[i].sender_database == username ){
                        retrieve_chat( data[i], 'local' );
                    }

                    else
                    {
                        retrieve_chat( data[i], 'remote' );
                    }
                }   
            });

            // Socket for adding all the previously saved chats of the user to the HTML
            socket.on( 'chat', ( data ) => {
                addChat( data, 'remote' );
            } );

            
            // Socket for showing typing indicators to let connected users know if any user is typing a message
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
            });


            //send message 
            $('#chatting_input').keypress((e)=>{
                if ( e.which === 13 && ( e.target.value.trim() ) ) {
                    e.preventDefault();

                    sendMsg( e.target.value,unique_link );

                    setTimeout( () => {
                        e.target.value = '';
                    }, 50 );
                }
            } );
        
            var typing=false;
            var timeout=undefined;
            // Setting time out for the typing indicator. After 3 sec of typig inactivity, the typing indicator will not be shown.
            $('#chatting_input').keypress((e)=>{
                
                if(e.which!=13){
                    
                    typing=true;
                    typing_Indicator(typing,unique_link);

                    function typingTimeout(){
                        typing=false;
                        typing_Indicator(typing,unique_link);
                    }

                    timeout=setTimeout(typingTimeout, 3000);
    
                }
                
                else{
                    clearTimeout(timeout)
                    typing=false
                    typing_Indicator(typing,unique_link);
                }
            });
        });
            
            
        // Function to retrive the chat history of the user
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


        function  addChat( data, senderType ) {
            let chatMsgDiv = document.querySelector( '#chat-messages' );
            let contentAlign = 'justify-content-end';
            let senderName = 'You';
            let msgBg = 'chat-box-sender-arrow magictime slideRightReturn';
    
            if ( senderType === 'remote' ) {
                contentAlign = 'justify-content-start';
                senderName = data.sender;
                msgBg = 'chat-box-reciever-arrow magictime slideLeftReturn ';

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

        function sendMsg( msg,room ) {
            let data = {
                room: room,
                msg: msg,
                sender: username
                
            };

            //emit the chat message
            socket.emit( 'chat', data );
            //adding the local chat of the user
            addChat( data, 'local' );
        }

        
        function typing_Indicator(indicator,room) {
            let data = {
                room: room,
                sender: username,
                indicator:indicator,
            };

            //emit typing indicator 
            socket.emit( 'indicator', data );

        }
        
 
 });







