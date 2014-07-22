CDN Repository
===============

Valid folders for content versioning
- asset
- script

Below are just placeholder folders for cdn directory structure.
- circular
- clientupload
- product
- recipe

cdn is the staging repository.

cdn Merging
===========
cdn -> gh-pages - host for staging

cdn -> gh-pages -> production - a process will watch this branch and deploy to Production once it is merged.

cdn-beta Merging
================
cdn-beta is a fork for beta.

cdn-beta -> gh-pages - host for beta

