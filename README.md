# Basic-CSRF-logic

In this repo we have 2 web apps (node) which are meant to be simple online notepads which save user's notepad data in a file. When a user logs in it saves a cookie with the user's code in it. With the one that is doesn't have csrf protection then other websites can edit the user's notepad. This is why you always need CSRF protection.

You are able to demo both of these apps and see for yourself why you always need CSRF protection.

# How to use
Make sure you have [git](https://git-scm.com/) and [node](https://nodejs.org/) installed.

First to import this repo on your computer and then set the imported folder as the current directory
```sh
git clone https://github.com/lulu-is-cute/Basic-CSRF-logic.git directory_name 
# After cloning
cd directory_name
```
