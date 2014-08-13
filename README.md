#CDN Repository

Merging
=======
gh-pages - host for beta

gh-pages -> staging - a process will watch this branch and deploy to Staging once it is merged.

gh-pages -> production - a process will watch this branch and deploy to Production once it is merged.

Follow this workflow:

- create any feature branch or fork from gh-pages
- feature are identified and integrated into gh-pages
- feature can individually merge from branch directly into Staging or Production when ready to go.  Of course it should also be merged into gh-pages.
- gh-pages merge into Staging or Production when all features has been tested and set to go
