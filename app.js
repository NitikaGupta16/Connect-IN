const express = require( 'express' );
const PORT = process.env.PORT || 801;
const cors = require("cors");
const mongoose = require('mongoose')
const User = require('./resources/user')
const Chat=require('./resources/chat');
const contact_list=require('./resources/contact_list');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const expressjwt = require("express-jwt");
var cookieParser = require('cookie-parser');
const jwt_decode = require('jwt-decode');
const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'
const jwtCheck = expressjwt({    
	secret: JWT_SECRET,
	algorithms: ['HS256']
});


//Connecting to the mongoDB database
mongoose.connect('mongodb+srv://Nitika:nitika123456@video-cluster.ckuxm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})


let app = express();
let server = require( 'http' ).Server( app );
let io = require( 'socket.io' )( server );
let path = require( 'path' );

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors());

app.use( '/resources', express.static( path.join( __dirname, 'resources' ) ) );

app.use("/profile", expressjwt({
	secret: JWT_SECRET,
	algorithms: ['HS256'],
	getToken: function fromCookie (req) {
	  var token = req.cookies.token;
	  if (token) {
		return token;
	  } 
	  return null;
	}
  })
);

app.use("/meeting", expressjwt({
	secret: JWT_SECRET,
	algorithms: ['HS256'],
	getToken: function fromCookie (req) {
	  var token = req.cookies.token;
	  if (token) {
		return token;
		
	  } 
	  return null;
	}
  })
);

app.use("/profile", function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		return res.redirect('/');
	}
});

app.use("/meeting", function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {

		return res.redirect('/');

	}
});


app.get( '/', ( req, res ) => {
    res.sendFile( __dirname + '/index.html' );
} );

app.get( '/profile', ( req, res ) => {
    res.sendFile( __dirname + '/profile.html' );
} );

app.get( '/meeting', ( req, res ) => {
    res.sendFile( __dirname + '/meeting.html' );
} );


app.post('/', async (req, res) => {

	//LOGIN
	if ('login' === req.body.formType) {
	 
		const { username, password } = req.body

		const user = await User.findOne({ username }).lean()

		if (!user) {
			return res.json({ status: 'error', error: 'Invalidd username/password' })
		}

		if (await bcrypt.compare(password, user.password)) {
			// the username, password combination is successful

			const token = jwt.sign(
				{
					id: user._id,
					username: user.username
				},
				JWT_SECRET
			)

			return res.json({ status: 'ok', data: token })
		}

		res.json({ status: 'error', error: 'Invalid username/passsword' })
	}

	//REGISTER
	else
	if ('register' === req.body.formType) {

		const { username, password: plainTextPassword } = req.body

		if (!username || typeof username !== 'string') {
			return res.json({ status: 'error', error: 'Invalid username' })
		}

		if (!plainTextPassword || typeof plainTextPassword !== 'string') {
			return res.json({ status: 'error', error: 'Invalid password' })
		}

		if (plainTextPassword.length < 5) {
			return res.json({
				status: 'error',
				error: 'Password too small. Should be atleast 6 characters'
			})
		}

		const password = await bcrypt.hash(plainTextPassword, 10)

		try {
			const response = await User.create({
				username,
				password
			})
			console.log('User created successfully: ', response)
		} catch (error) {
			if (error.code === 11000) {
				// duplicate key
				return res.json({ status: 'error', error: 'Username already in use' })
			}
			throw error
		}

		res.json({ status: 'ok' })
	}
})


app.post('/profile', async (req, res) => {

	//save contact list
	if ('contact' === req.body.formType) {
	 
		const { contact_name, unique_link,username } = req.body

		try {
			const response = await contact_list.create({

				"friends" : [contact_name,username],
				"unique_link" : unique_link
			})
			console.log('Contact Saved Successfully: ', response)
		} catch (error) {
			if (error.code === 11000) {
				// duplicate key
				return res.json({ status: 'error', error: 'Contact Already exists' })
			}
			throw error
		}

		res.json({ status: 'ok' })

	}
	else
	if ('group' === req.body.formType) {
	 
		const { contact_name1,contact_name2,contact_name3, unique_link,username } = req.body

		try {
			const response = await contact_list.create({

				"friends" : [ contact_name1,contact_name2,contact_name3,username],
				"unique_link" : unique_link
			})
			console.log('Contact Saved Successfully: ', response)
		} catch (error) {
			if (error.code === 11000) {
				// duplicate key
				return res.json({ status: 'error', error: 'Contact Already exists' })
			}
			throw error
		}

		res.json({ status: 'ok' })

	}

	else
	if ('new_password' === req.body.formType) {

		const { token, newpassword: plainTextPassword } = req.body

		if (!plainTextPassword || typeof plainTextPassword !== 'string') {
			return res.json({ status: 'error', error: 'Invalid password' })
		}

		if (plainTextPassword.length < 5) {
			return res.json({
				status: 'error',
				error: 'Password too small. Should be atleast 6 characters'
			})
		}

		try {
			const user = jwt.verify(token, JWT_SECRET)

			const _id = user.id

			const password = await bcrypt.hash(plainTextPassword, 10)

			await User.updateOne(
				{ _id },
				{
					$set: { password }
				}
			)
			res.json({ status: 'ok' })
		} catch (error) {
			res.json({ status: 'error', error: ';))' })
		}
	}
})



io.on('connect',socket=>{

    function ValidURL(str) {
        var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        if(!regex .test(str)) {
          return false;
        } 
		else {
          return true;
        }
    }


    socket.on( 'subscribe', ( data ) => {
        //join a room
        socket.join( data.room );
        socket.join( data.socketId );

		const clients = socket.adapter.rooms.get(data.room);
        const numClients = clients ? clients.size : 0;
		
        if ( numClients >= 1 ) {
            socket.to( data.room ).emit( 'new user', { socketId: data.socketId, printname:data.printname } );
        }
		
        Chat.find({ room_database: data.room },(err,res)=>{
			if(err) throw err;
            if(res.length > 0){
				// Yes they have chat data 
				// Emitting saved chat
				socket.emit( 'savedchat', res);
			}
		})

    });


	socket.on( 'subscribetochat', ( data ) => {
		contact_list.find({ friends: data.socketId },(err,res)=>{
			if(err) throw err;
            if(res.length > 0){
				// Emitting users contact list		
				socket.emit( 'contactlist', res);
			}
		})
    });

	
	socket.on( 'startchat', ( data ) => {

        socket.join( data.unique_link );//reciever's name

        Chat.find({ room_database: data.unique_link },(err,res)=>{
			
			if(err) throw err;
            if(res.length > 0){
				// Yes they have chat data 
				// Emitting saved chat
				socket.emit( 'savedchat', res);
			}
		})
    });


	/*****Sockets for WebRTC*****/
    socket.on( 'newUserStart', ( data ) => { 
        socket.to( data.to ).emit( 'newUserStart', { sender: data.sender, printname:data.printname });
    });


    socket.on( 'sdp', ( data ) => {
        socket.to( data.to ).emit( 'sdp', { description: data.description, sender: data.sender, printname:data.printname});
    });


    socket.on( 'ice candidates', ( data ) => {
        socket.to( data.to ).emit( 'ice candidates', { candidate: data.candidate, sender: data.sender, printname:data.printname });
    });


	const linkPreviewGenerator = require('link-preview-generator');

    //Adding chat to the database 
    socket.on( 'chat', async ( data ) => {

        if(ValidURL(data.msg))
        {

			Chat.create(
                { 
					"room_database" : data.room,
                  	"message_database" : data.msg,
                  	"sender_database" : data.sender,
                }
             );
            let result = await linkPreviewGenerator(data.msg);
        	socket.to( data.room ).emit( 'chat', { sender: data.sender, msg: data.msg, title:result.title, description:result.description, domain:result.domain, img:result.img } );
        }

        else
        {
           Chat.create(
                { 
					"room_database" : data.room,
                  	"message_database" : data.msg,
                  	"sender_database" : data.sender,
                }
             );

            socket.to( data.room ).emit( 'chat', { sender: data.sender, msg: data.msg } );
        }
    });


	//Socket for Typing indicator
    socket.on('indicator', (data)=>{
        socket.to( data.room ).emit( 'display_typing_indicator', { sender: data.sender, indicator:data.indicator} );
      });

})

server.listen( PORT , () => console.log('Application is running'));

