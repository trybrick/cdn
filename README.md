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

Scenario 2b (Alternative Hot-Fix)
====================
Use this scenario only if necessary.  Hot-fix scenario or anything that need to go into Staging/Production outside of the regular workflow.

Example, if you need to check in your feature from a previous commit:

- click on the "Commits"
- click on "Browse code" on the commit you want to branch from
- click on the "tree: xxxxxx" up in the upper left, just below the language statistics bar, you'll get the option to "Find or Create Branch" (just type in a new branch name there) 
- add anything you want to it
- create pull-request to merge into Staging or Production
- create pull-request to merge into master

![Hot-Fix](http://i.stack.imgur.com/JMRGs.png)

Ultimately, all changes need to be in master for integration testing.  Even if you make hot fixes to a file that probably already been fixed in master, you probably add additional file/feature in hot-fix that may also need to merge into master.
