//static
let xsrfLib = require("csrf")
let crypto = require("crypto")
let fs = require("fs")

//instances
let csrfMod = {}

//functions
let secretPath = name => {return `${__dirname}/csrf-bin/${name}`}

//main
let csrfExpires = 1000 * 60


csrfMod.generateCryptoSecret = alpha => {
    return new Promise(async res => {
        let rad = crypto.randomBytes(alpha.length + 1).toString("utf-8")

        var secret = []
        alpha.split("").forEach((v, i) => {
            secret.push(v)
            secret.push(rad[i])
        })
        secret.reverse()
        secret = secret.join("")

        secret = Buffer.from(secret)
        let pseudoDate = Buffer.from(Date.now().toString())

        pseudoDate.forEach((v, i) => {
            if (i > secret.length){
                secret[i] = secret[i] % v
            }
            else{
                return
            }
        })
        
        secret = secret.toString("base64")
        res({secret: secret, expires: (parseInt(pseudoDate.toString("utf-8")) + csrfExpires)})
    })
}

csrfMod.getSecret = file => {
    return new Promise((res, rej) => {
        fs.readFile(secretPath(file), "utf8", async (not_exists, data) => {
            if (!not_exists){
                data = JSON.parse(data)
                let expired = data.expires - Date.now()
                if (expired > 0){
                    res(data.secret)
                }
                else{
                    let newSecret = await csrfMod.generateCryptoSecret(file)
                    fs.writeFile(secretPath(file), JSON.stringify(newSecret), er => {
                        if (er){
                            rej(er)
                        }

                        res(newSecret.secret)
                    })
                }
            }
            else{
                let newSecret = await csrfMod.generateCryptoSecret(file)

                fs.writeFile(secretPath(file), JSON.stringify(newSecret), (er) => {
                    if (er){
                        rej(er)
                    }

                    res(newSecret.secret)
                })
            }
        })
    })
}

csrfMod.newCsrf = secret => {
    let lib = new xsrfLib()
    return lib.create(secret)
}

csrfMod.verify = (secret, token) => {
    let lib = new xsrfLib()
    return lib.verify(secret, token)
}

/*
async function dun(){
    let cuteSecret = await csrfMod.getSecret("this is a cute test123")
    for (let i = 0; i <= 10; i++){
        let theSurfer = csrfMod.newCsrf(cuteSecret)
        console.log(theSurfer, csrfMod.verify(cuteSecret, theSurfer))
    }
}

dun()
*/

module.exports = csrfMod