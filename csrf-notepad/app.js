
/*online notepad with csrf protection*/

//vars
let fs = require("fs")
let port = process.env.PORT || 3000
let credentialsCookieName = "x-cookie-code"

//static
let express = require("express")
let bodyParser = require("body-parser")
let cookieParser = require("cookie-parser")
let csrf = require("./csrf.js")

//instances
let app = express()
let jsonParser = bodyParser.json()
let reqCookieParser = cookieParser()

//express middleware
app.use(jsonParser)
app.use(reqCookieParser)

//express logic

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/view/main.html`)
})

app.get("/myfile", (req, res) => {
    let code = req.cookies[credentialsCookieName]

    if (code){
        fs.readFile(`${__dirname}/datastore/${code}`, "utf8", (er, data) => {
            if (!er){
                res.json({success: true, data: data})
            }
            else{
                res.json({success: false, err: 500})
            }
        })
    }
    else{
        res.json({success: false, err: 401})
    }
})

app.post("/login", (req, res) => {
    let code = req.body["code"]

    if (code){
        fs.readFile(`${__dirname}/datastore/${code}`, (er) => {
            if (er){
                fs.writeFile(`${__dirname}/datastore/${code}`, `${code}'s file`, er => {
                    if (!er){
                        res.cookie(credentialsCookieName, code)
                        res.json({success: true, userFacingMsg: "Account created, logging in now.", code: code})
                    }
                    else{
                        res.json({success: false, status: 500})
                    }
                })
            }
            else{
                res.cookie(credentialsCookieName, code)
                res.json({success: true, code: code})
            }
        })
    }
    else{
        res.json({success: false, err: 401, userFacingMsg: "No code was passed into body"})
    }
})

app.get("/get-csrf", (req, res) => {
    let code = req.cookies[credentialsCookieName]

    if (code){
        fs.readFile(`${__dirname}/datastore/${code}`, async (er) => {
            if (!er){
                let secret = await csrf.getSecret(code)
                let csrfToken = csrf.newCsrf(secret)

                res.set("x-csrf-token", csrfToken)
                res.json({success: true})
            }
            else{
                res.json({success: false, err: 401, userFacingMsg: "Account doesn't exist"})
            }
        })
    }
    else{
        res.json({success: false, err: 401})
    }
})

app.post("/save", async (req, res) => {
    let code = req.cookies[credentialsCookieName]
    let xsrf = req.get("x-csrf-token")
    let data = req.body.data

    if (code && data && xsrf){
        let codeSecret = await csrf.getSecret(code)
        if (!csrf.verify(codeSecret, xsrf)){
            res.json({success: false, status: 403, userFacingMsg: "Invalid CSRF token"})
            console.log("Request made without valid CSRF token, CSRF attack blocked!!")
            return;
        }

        fs.writeFile(`${__dirname}/datastore/${code}`, data, er => {
            if (!er){
                res.json({success: true})
            }
            else{
                res.json({success: false, status: 500})
            }
        })
    }
    else{
        let nullCsrf = xsrf ? false : "x-csrf-token"
        let nullCode = code ? false : "code"
        let nullData = data ? false : "body.data"

        var fields = []

        if (nullCsrf){
            fields.push(nullCsrf)
        }
        if (nullCode){
            fields.push(nullCode)
        }
        if (nullData){
            fields.push(nullData)
        }

        res.json({success: false, err: 401, fields: fields})
    }
})

app.get("/client.js", (req, res) => {
    res.sendFile(`${__dirname}/public/main.js`)
})

//express start
app.listen(port, () => console.log(`Server listening on port ${port}`))