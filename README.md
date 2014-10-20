#CDN Repository

Merging
=======
master -> beta/integration - a process will watch this branch and deploy to beta once it is merged.

master -> staging - a process will watch this branch and deploy to Staging once it is merged.

master -> production - a process will watch this branch and deploy to Production once it is merged.

IMPORTANT
=========
The branches above are environments.  To summarize the workflow below:

  1. DO fork or branch when you are adding a feature.
  2. DO merge new feature into master for integration testing.
  3. DON'T merge if you are making changes to existing feature/hot-fix, just do a merge/pull-request directly into the branch (staging/production).

TL;DR;
#Merge Workflow

Scenario 1
===========
The regular process of adding new feature.

- create a branch or fork from master
- add your feature to the branch
- create pull-request to merge into master

Scenario 2
===========
You need to add a feature for Staging/Production (hot-fix) only.  Don't want to change master.

- create a branch from staging/production
- add your feature to the branch
- create pull-request to merge into original branch
- create pull-request from original branch back into master to integrate 

The extension of this scenario would more likely to have their own branch and environment such as test or test2.

Ultimately, all changes need to be in master for integration testing.  Even if you make hot fixes to a file that probably already been fixed in master, you probably add additional file/feature in hot-fix that may also need to merge into master.
