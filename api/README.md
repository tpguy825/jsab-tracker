# What is this directory?

This is the remenants of the original backend. It was quite complicated to get working and allowed little flexibility on the front end (as the way I used it was through managing what screen the user was on via `localStorage` alongside some very dodgy and intermittent code). It also didn't work as it used the filesystem to save data, which worked well on a local development environment but not on Vercel, as the filesystem is read-only.

It has now been replaced by Firebase.
