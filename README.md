# Basic-CSRF-logic

In this repo we have 2 web apps (node) which are meant to be simple online notepads which save user's notepad data in a file. When a user logs in it saves a cookie with the user's code in it. With the one that is doesn't have csrf protection then other websites can edit the user's notepad. This is why you always need CSRF protection.

You are able to demo both of these apps and see for yourself why you always need CSRF protection.

# How to use
Make sure you have [git](https://git-scm.com/) and [node](https://nodejs.org/) installed.

First to import this repo on your computer and then set the imported folder as the current directory:
```sh
git clone https://github.com/lulu-is-cute/Basic-CSRF-logic.git directory_name 
# After cloning
cd directory_name
```

Set current directory to web app you wanna run:
```sh
cd csrf-notepad or non-csrf-notepad
```

Run the app with node:
```sh
node app.js

# Should output:
Server listening on port 80
```

Great! The local server is now online and you can visit [localhost:80](http://localhost:80/) in your browser.

```
Now that the local server is running. Visit localhost:80 and login with a random code. It will create an account and a data file on the application datastore directory.

Once you have done that then in the notepad part write some stuff. Whatever you want!!
```

You can then simulate your own attack on each web app, thank you for looking at my repo!

We have made our own attack simulation that you can run, visit [this repo](https://github.com/lulu-is-cute/csrf_server-attacker/)

# Secure your apps!
