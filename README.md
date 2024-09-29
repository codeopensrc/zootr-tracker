#### TODO
Status Badges

---

### Running
- Using [docker compose](#running-with-docker-compose)  
- Using [helm](#running-with-helm)  
#### Running with `docker compose`
Fastest and easiest way to run is using docker and `docker compose`  
**[Docker Engine](https://docs.docker.com/engine/installation)**  

- Create a directory and `cd` into it:  
`mkdir zootr-tracker && cd zootr-tracker`  
- Download the `docker-compose.yml` file:  
`curl -O https://gitlab.codeopensrc.com/os/zootr-tracker/-/raw/master/docker-compose.yml`  
- Create an empty `.env.tmpl` file:  
`touch .env.tmpl`  
- Pull Image:  
`docker compose pull main`  
- And run:  
`docker compose up main [-d]`  
- Project will be available at `localhost:5200` (main default)  

#### Running with `helm`

To run in a kubernetes environment, use helm.  
**[Install Helm](https://helm.sh/docs/intro/install/)**  
**[Helm quickstart guide](https://helm.sh/docs/intro/quickstart/)**  

If you have a kubernetes environment ready and helm installed -

Method 1)  
Using the remote chart repository.
- Add the chart repository:  
`helm repo add os https://gitlab.codeopensrc.com/api/v4/projects/156/packages/helm/stable`  
- Install the chart:  
`helm upgrade --install zootr os/zootr`  
- Port-foward a local port (here we use `5000`) to the `zootr-app` service:  
`kubectl port-forward service/zootr-app 5000:80`  
-   Project will be available at `localhost:5000`  

Method 2)  
Cloning and using the local chart.
- Clone the repository:  
`git clone https://gitlab.codeopensrc.com/os/zootr-tracker.git`  
- Build the chart dependencies:  
`helm dependency build zootr-tracker/charts/zootr`
- (Optional) Add/modify values in the `values.yaml` file:  
`vi zootr-tracker/charts/zootr/values.yaml`  
  - ~See `zootr-tracker/charts/tpl/values.yaml` for full list of values~
  - TODO: Link to react template values.yaml that has the full list
- Install the chart:  
`helm upgrade --install zootr zootr-tracker/charts/zootr`  
- Port-foward a local port (here we use `5000`) to the `zootr-app` service:  
`kubectl port-forward service/zootr-app 5000:80`  
- Project will be available at `localhost:5000`  

TODO: ingress section  
For using with a resolvable hostname see [ingress](#ingress)  

---

### Development  
- Using [docker compose](#developing-with-docker-compose) 
- TODO: Using [skaffold, helm, and minikube/k8s cluster](#todo-developing-with-skaffold)
#### Developing with `docker compose`
1) Clone  and change into project directory  
`git clone https://gitlab.codeopensrc.com/os/zootr-tracker.git`  
`cd zootr-tracker`  
1) Edit the `dev` service in `docker-compose.yml` to suit your needs   
    A) (optional) Create .env file from template.  
    `cp .env.tmpl .env`  
    B) If using windows then 2a. is not optional and both of the following uncommented and modified
    ```bash
    COMPOSE_CONVERT_WINDOWS_PATHS=1  
    FOLDER_LOCATION=/ABSOLUTE/PATH/TO/WINDOWS/FOLDER/zootr-tracker  
    ```
1) Build it  
`docker compose build dev`  
1) Run it (`-d` for detached):  
`docker compose up dev [-d]`  
1) Project will be available at `localhost:5205` (dev default)  
1) Run webpack inside the container. (Another terminal if not using `-d`):  
`docker exec CONTAINER_NAME npm run watch`  
1) Modify files in `src/*` and `server/*`  
1) See changes (after page refresh) at `localhost:5205`  


### Hot Reloading

Enable hot reloading (component updates without page refresh) for react components by adjusting a step and using a different port.

- Replace the command in #6 from above  
 `docker exec CONTAINER_NAME npm run watch`  
to  
`docker exec -it CONTAINER_NAME npm run reloader`  
The `-it` allows Ctrl+c to stop the `webpack-dev-server` started inside of the container.  

- Instead of loading `localhost:5205`, load `localhost:5255`  
See ports in `docker-compose.yml` and `src/config/webpack.config.js` to adjust.  

Now with `:5255` loaded in the browser, when you update a react component you can see the page re-render it. The component should keep its state and will not re-run `componentDidMount`/`useEffect` functions.  


### Database

By default the database will not start and connect without editing `docker-compose.yml`.  
- Under `environment` for the `dev` service, change  
`ENABLE_DB: "false"` to `ENABLE_DB: "true"`  

- Uncomment the following lines in `docker-compose.yml`  
```yaml
        #depends_on:
        #    - mongodb
```
to
```yaml
        depends_on:
            - mongodb
```

Now when `docker-compose up dev` is run, a mongodb image will be pulled, start, and the server will connect to it using the `DEV_DATABASE_URL_ORIGIN/MONGO_DB_NAME` connection string.  

---

#### TODO Developing with `skaffold`



---

### Source
Development being done using a self-hosted GitLab instance.  
**[GitLab](https://gitlab.codeopensrc.com/os/zootr-tracker)**  
**[GitHub Mirror](https://github.com/codeopensrc/zootr-tracker)**  

### Contributing
- Feel free to [open issues on GitHub](https://github.com/codeopensrc/zootr-tracker/issues)
- Feel free to submit [pull requests on GitHub](https://github.com/codeopensrc/zootr-tracker/pulls)

### TODO Writeups
- Gitlab CI/CD. See `.gitlab-ci.yml`  
- Skaffold / Kubernetes / Helm  
