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

After you have become a user on your local website it's time for an attack. You will visit a link hosted on glitch which will send a request to your local server pretending to be you with your code. Since the code is stored in cookies other websites will be able to request actions on your accounts with the correct tokens.

If you chose to ran the vulnerable one or the secure one. You will go back on the localhost website in your browser and see if your data has been changed on the notepad.

Here is the link: [csrftestattacker.glitch.me](https://csrftestattacker.glitch.me/)

# Thank you and kee your websites secure developers!
