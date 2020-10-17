
/*online notepad without csrf protection*/

//vars
let fs = require("fs")
let port = process.env.PORT || 3000
let credentialsCookieName = "x-cookie-code"

//static
let express = require("express")
let bodyParser = require("body-parser")
let cookieParser = require("cookie-parser")

//instances
let app = express()
let jsonParser = bodyParser.json()
let cookieParserMid = cookieParser()

//express middleware
app.use(jsonParser)
app.use(cookieParserMid)

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
    let code = req.body.code

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
        let fields = ["body.code"]

        res.json({success: false, err: 401, fields: fields})
    }
})

app.post("/save", (req, res) => {
    let code = req.cookies[credentialsCookieName]
    let data = req.body.data

    if (code && data){
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
        let nullCode = code ? false : "code"
        let nullData = data ? false : "body.data"

        var fields = []

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