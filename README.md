# Node-Experimentations
A playground folder to experiment with NodeJS in different fields:
- Go [here](https://github.com/RiccardoTonioloDev/Node-Experimentations/tree/main/Node-first-server), to see a <u>feature-complete online marketplace</u>;
- Go [here](https://github.com/RiccardoTonioloDev/Node-Experimentations/tree/main/Node-first-RESTAPI), a socialnetwork-lite app using <u>REST APIs</u>.

*The other resources of this repo are little assignments/trials to test different minor things.*

## How to set & test projects
In the case of the feature-complete marketplace, you just need to clone the repo, and run:
`npm install`, to install the node_modules required to get the server run correctly.
After the installation completed, run `npm start`, and on http://localhost:3000, you will have the app running.  <hr>

In the case of the REST API stuff, you have to:
- Clone the repo;
- Run `npm install`, inside the main folder, and inside the ***frontendTester*** folder;
- Run `npm start` in the ***frontendTester*** folder to spin up the react front-end to test the API endpoints;
- Run `npm start` in the main folder, to spin up the server, activating the end-points.
