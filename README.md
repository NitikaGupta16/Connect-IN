# Connect-IN
Website: https://connect-in-app.herokuapp.com/
</br>
## Overview 
Connect-IN is a multi functional web application where multiple users can connect with each other via chat as well as video call. A user can add friends to his/her contact list and then can chat and even have a meet with his/her friends. Also, users can chat with each other before the meeting, during the meeting as well after the meeting.Connect-IN name has been chosen in a way that will represent INDIA. Connect-IN can be pronounced as Connect INDIA. 
## TechStack 
- Frontend: HTML, CSS, Bootstrap, Javascript, JQuery, Ajax 
- Backend: Node.js,  express.js, Socket.IO, WebRTC, Express cookie-parser middleware, express-jwt middleware, bcryptjs for password security, jwt-decode for decoding JWTs tokens 
- Database: MongoDB 
- Hosting Platform: Heroku app 
## Some UNIQUE features of my project are: 
- Adopt feature is fully implemented. 
- JSON Web Tokens (JWT) are used for authentication during Sign in. These tokens ensure that the information from one user is transmitted securely to the other user. 
- bcryptjs for password security. 
- Typing Indicator… which will let the user know if some other user in the meeting is typing any message in the chat box. 
- Thumbnails over the shared link i.e. rich links. 
- Any number of participants can connect with each other over a video as well as chat conversation. 
- Number of unread chat messages are displayed. 
## Steps to run it on local system: 
- Make sure you had installed node.js, npm and mongoDB on your system 
```
- npm i puppeteer
- git clone https://github.com/NitikaGupta16/Connect-IN
- npm start

```