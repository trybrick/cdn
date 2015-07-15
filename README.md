#CDN Repository

This repository allow automate pushes to CDN origin on commits.  This method allow us to track and revert changes that are pushed into CDN.  Please follow instructions below:  

#Ways to resolve/prevent conflicts
- version your js/css for deployment
  - example: scripts/gsncore/1.4.4/gsn.core.js, scripts/gsncore/1.4.5/gsn.core.js, etc..
- keep related content in separate repository and pull in through bower
  - example: some of the asset folders are in different repository, see bower.json
  - since they're in separate branch, you can test them individually
- fork and create separate branch and perform pull request from specific branch

#Installation
Go to the root folder and run commands below.  If windows, do not need to run sudo.
```
sudo npm install -g gulp
npm install
```
