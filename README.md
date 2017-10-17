
# Ruby Lens

#### Setup Development environment

Clone the repo

Create env file
`cp env/.env.default env/.env.dev`

Add permissions to sh file
`chmod +x docker-entrypoint-dev.sh`

Add `127.0.0.1 dev.rubylens.com` to your `hosts` file, this is for OAuth redirections.

Open the console and access to this folder, then run the next command   
`docker-compose -f docker-compose.dev.yml up`   
This runs the web-server inside a docker container, the database-server inside another docker container, link them on the same docker network, and bind the port 3000 to the host machine (your machine).

Open `dev.rubylens.com:3000` in your browser... ta da!

##### Docker stuff

After running the first time if you stop the docker containers you can start them with   
`docker-compose -f docker-compose.dev.yml start`   

Restart docker machine
`docker-compose -f docker-compose.dev.yml restart`

Start a terminal in the running docker container of the webserver   
`docker exec -it rubylens-web-dev /bin/bash`

psql -U rubylens rubylens

Attach a terminal to the webserver stdin and stdout
`docker attach rubylens-web-server`

Watch the logs of a running container
`docker logs -f rubylens-web-dev`

Rebuild Docker images
`docker-compose -f docker-compose.dev.yml build`

Stop all docker machines
`docker-compose stop $(docker ps -a -q)`

##### Database stuff

Access the database from the host
`psql -U rubylens -h localhost -p 5433 -W rubylens`
pass: 'changethis'

#### Development bugs

- If host's node_modules has files they will be copied? to the containers when starting it


#### Important changes:

- Replace debug.js with winston.js


### TODO: Credit Authors

<div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
