#CDN Repository

Merging
=======
gh-pages (aka master) - host for beta

gh-pages -> staging - a process will watch this branch and deploy to Staging once it is merged.

gh-pages -> production - a process will watch this branch and deploy to Production once it is merged.

Follow this workflow:

Scenario 1
===========
The regular process of adding new feature.

- create a branch or fork from gh-pages (aka master)
- add your feature to the branch
- create pull-request to merge into gh-pages
- create pull-request to merge into Staging or Production when all features has been tested and set to go

Scenario 2
===========
You need to add a feature for Staging only.  Don't want to change beta.

- create a branch
- add your feature to the branch
- create pull-request to merge into Staging

The extension of this scenario would more likely to have their own branch and environment such as test or test2.

Scenario 3 (Hot-Fix)
====================
Use this scenario only if necessary.  Hot-fix scenario or anything that need to go into Staging/Production outside of the regular workflow.

Example, if you need to check in your feature from a previous commit:

- click on the "Commits"
- click on "Browse code" on the commit you want to branch from
- click on the "tree: xxxxxx" up in the upper left, just below the language statistics bar, you'll get the option to "Find or Create Branch" (just type in a new branch name there) 
- add anything you want to it
- create pull-request to merge into Staging or Production
- create pull-request to merge into gh-pages

![Hot-Fix](http://i.stack.imgur.com/JMRGs.png)

Scenario 3b
===========

- alternatively, you can branch directly from Production
- make your changes
- create pull-request to merge into Production
- create pull-request to merge into gh-pages


Ultimately, you want all your changes to be in gh-pages (aka master) for integration testing.  Even if you make hot fixes to a file that probably already been fixed in gh-pages, you probably add additional file/feature in your hot-fix that may also need to merge into gh-pages.
