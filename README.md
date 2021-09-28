### Demo
[Working Demo](http://www.nite.city:3000) available at www.nite.city:3000

&nbsp;  
### Quick Setup
This repository contains two distinct applications. In the root folder is the Next JS chat application, and in the `socket_chat_server` is the SocketIO chat server. Both need to be run with npm.

To run locally:
  1. Clone the repo
  2. Create local envrionment files and populate them using the templates below
     1. Create a `.env.local` file in the project root
     2. Create a `.local` file in _./socket_chat_server_ directory      
  3. `npm install` in both the root directory and the _socket_chat_server_ directory
  4. In the root directory, run `npm run dev` (or alternatively, `npm run build` followed by `npm run start`)
  5. In the socket_server directory run `npm run start`
  6. Open a browser to `http://localhost:3000`

&nbsp;
### Environment Configuration
In order to authenticate with a Google account, you must create a new set of credentials within a new or existing GCP project. If the project is only being used for OAuth, it will remain within the free tier. See [Setting up OAuth 2.0](https://support.google.com/cloud/answer/6158849) for instructions.

Once the credentials have been created, copy the OAuth ID and secreat values into the _./.env.local_ file.

A JWT_SECRET value also needs to be set. The _next-auth_ library uses this secret to sign the JWT after authenticating with a provider. The value can be anything, but should meet length and complexity standards sutiable for a signing key.

##### _./.env.local_
```
GOOGLE_ID = <google_oauth2_id>
GOOGLE_SECRET = <google_oauth2_secret>

NEXTAUTH_URL_INTERNAL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

SELF_HOST=http://localhost:3000
WS_HOST=http://localhost:4000

JWT_SECRET=<any_string>
```

####_./socket_chat_server/.env_
```
AUTH_ENDPOINT=http://localhost:3000/api/auth/getJwt
```

&nbsp;  
### Architecture
Technologies
  * [Next.js](https://www.nextjs.org) - A lightweight pre-scaffolded environment for running hybrid rendered React applications. The framework comes with built in routing, using filenames to dynamically create both front and backend routes. This project is a SPA, which is not really suited for Next.js, but I wanted to give the framework a try and learn how it operates
  * [NextAuth.js](https://next-auth.js.org) - Designed to be used with Next.js, the library claims to offer easy to intergrate authentication. However, I found that it was more difficult to work with then other similar libraries for Node. The integration with a Next.js frontend client was smooth, but the library is extremely sensitive to configuration and environmental changes, with cryptic error messages when things are misconfigured. The library has built in support for a number of OAuth providers including Google and Facebook.
  * [Socket.IO](htts://socket.io) - A library that sits on top of, and enhances, the standard web socket protocol. Comes with both server and client libraries, and has built in support for rooms and namespaces. I've had experience with the library before, but hadn't really used it for multi-directional communication before.
  * [PM2](https://pm2.keymetrics.io/) - The most widely used manager for running Node processes on a server. Simple to set up. This project only used the simpler features, but the tool can be set up to support full CI pipelines as well as provide load balancing.
  * [AWS Lightsail](https://aws.amazon.com/lightsail/) - Easy to configure VMs for hosting web applications. I chose this over an EC2 instance due to being able to set it up quickly.
  * [Google Domains](https://domains.google/) - I have a number of registered domains with Google (mostly on the .dev domain), and since AWS Lightsail provides a free static IP, I thought I'd try and get the app running publicly. I picked http://www.nite.city as it was one of the few domains I owned that wasn't currently attached to anything, and could be accessed over _http_ (all .dev domains require _https_ access, and I didn't know if I would have time to set up SSL) 

Design Decisions:
  * I initially planned on building something that was just server based, with the only interface being a console application. However, I wanted to explore Socket.IO some, and making only a console chat application sitting in front of the library seemed trivial
  * As part of the requirements were that authentication was needed to join a room, I decided to try my hand at a basic OAuth 2.0 implementation using Google as the provider. I had worked with OAuth a little before, but had never integrated it end-to-end with a front-end and multiple servers.
  * Since I decided to create a frontend web app, I chose to go with React since that is where I have the most experience. I wanted to try something different than `create-react-app`, and had been hearing some good things about Next.js. Although my application wouldn't be using any of the server-side rendering features of Next, I thought a SPA would be a good learning project for the framework.

&nbsp;
### Future Enhancement (a.k.a things I ran out of time to do)
* Get the app running on port 80 (www.nite.city)
  * I tried doing some basic ip-table redirects, but it broke the OAuth callbacks. I will need to get this running behind a nginx or Apache reverse proxy. I've used both in the past, but I ran out of time to set it up.
* Enable https/ssl using _Let's Encrypt_, and change the domain to something on _.dev_
  * This will also require setting up nginx, as it looks like it is a PITA to set up Next.js natively with SSL
* Dockerize the server
  * This one is pretty simple, since things are already set up to run via PM2
* Add E2E encryption for the chat messages
  * I've been wanting to work with some kind of multi-party key-exchange architecture for a while, and encrypting/decrypting all the chat messages client side would be a cool learning exercise.
    * This is likely a longer-term goal, as from what I've researched, it is not trivial.
* Add persistent storage
  * The chat server has a MessageStore layer that just implements a basic in-memory cache. It would be easy to modify it to use a database, likely something like Mongo or another no-SQL DB. 
