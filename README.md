
### To Run

Dev & Production system require:  
**[<u>Docker</u>](https://docs.docker.com/engine/installation/)** (Engine & Compose) (v2+)  

Inside root project directory with `docker-compose.yml` run:  
`docker-compose up [-d]`  

Check `HOST` under `HOST:CONTAINER` in `docker-compose.yml` for port (default 5000).  

### Development  
1) Edit `docker-compose.yml` to suit your needs  
2) Inside directory with `docker-compose.yml` run:  
`docker-compose up [-d]`  
3) To run webpack inside the container, in another tab/pane run:  
`docker exec CONTAINER_NAME npm run watch`  

### Source
A link to this project to clone can be found on **[<u>Bitbucket</u>](https://bitbucket.org/JestrJ/react-template)**.
A link to the pre-built docker container can be found on **[<u>DockerHub</u>](https://hub.docker.com/r/jestrr/react-template/)**.

The container itself is rather useless, but illustrates how easy it is to get up and running.  
