#CDN Repository

This repository allow automate pushes to CDN origin on commits.  This method allow us to track and revert changes that are pushed into CDN.  Please follow instructions below:  

#Ways to resolve/prevent conflicts
- version your js/css for deployment
  - example: scripts/gsncore/1.4.4/gsn.core.js, scripts/gsncore/1.4.5/gsn.core.js, etc..
- keep related content in separate repository and pull in through bower
  - example: some of the asset folders are in different repository, see bower.json
  - since they're in separate branch, you can test them individually
- fork and create separate branch and perform pull request from specific branch
  - lastly, if necessary, pull-request or merge into github.com/gsn2/cdn for staging

#Installation
Go to the root folder and run:
```
npm install -g gulp
npm install
```

#To run Digital Store
First, please follow installation instruction above.  Then run the following command to start debug on chain 216 and 218:
```
gulp
cd asset
node serverApp.js 216 218
```

Server will start on 3000 + chainId: 3216 and 3218 as example shown above.  To debug, open browser to:
http://localhost:3216
http://localhost:3218
