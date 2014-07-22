CDN Repository
===============

Valid folders for content versioning
- assets
- scripts

Below are just placeholder folders for cdn directory structure.
- circulars
- clientuploads
- products
- recipes

cdn is the staging repository.

cdn Merging
===========
cdn -> gh-pages - host for staging

cdn -> gh-pages -> production - a process will watch this branch and deploy to Production once it is merged.

cdn-beta Merging
================
cdn-beta is a fork for beta.

cdn-beta -> gh-pages - host for beta

