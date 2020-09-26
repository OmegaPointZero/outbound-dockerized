
# Node Outbound Sample App

## Steps to run and test 

1. Populate the `.env` file

```
VGS_OUTBOUND_PROXY=<tenantID>.SANDBOX.verygoodproxy.com  
VGS_PROXY_AUTH=<userID>:<password>
```

2. Update your upstream

Line `34` of app.js should be changed to the address of your server. To test with this server, you will also require an outbound route on your VGS vault pointing to your server's address. For local development, we typically use [NGROK](https://ngrok.com).

3. Build the Docker container

```
docker build -t app .
docker run -p 3000:3000 -d test:latest
```

4. Test the route. 

Visit `localhost:3000/outbound` to test. This sends a request through your outbound VGS route back to the `/post` endpoint. The `/post` endpoint should echo back `{'status':'Outbound connection successfully received!'}`. 
