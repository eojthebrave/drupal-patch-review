## Drupal Patch Reivew

The idea is to build a web based application that can be used to spin up Drupal 8.x sites on demmand, apply a patch, and provide a sandbox that can be used to easily review UI changes in a patch.

If you don't know how to setup your own development LAMP stack, use Git, and a handful of utilities for applying patches it can be difficult to help review a patch in the drupal.org issue queue. There are also a lot of patches where it would be nice to be able to quicly spin up an environment that you can review UI changes, or test funtional changes or just see what is going on.

What if you could just navigate to a website and give it the URL of an issue on drupal.org and it would automatically build a sandbox for you?

What if you could have a javascript bookmarklet that when viewing an issue on drupal.org you could just click the bookmarklet and it would find the latest patch in the issue and build a sanbox environment for you with that patch applied?

Neat!

## Work in Progress

This is very much a work in progress. In fact, it doesn't even work yet. But we'll get there someday ...