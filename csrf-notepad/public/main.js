$(() => {
    let loginPage = $("#login")
    let mainPage = $("#main")

    let loginForm = $("#loginForm")
    let saveBtn = $("#saveBtn")

    let loginCodeInput = $("#loginInput")
    let textboxMain = $("#textMain")

    let loginResult = $("#loginResult")
    let saveResult = $("#saveResult")

    //SESSION
    var loginData;

    //MAIN

    let getSessionToken = (code) => {
        return new Promise(async (res, rej) => {
            try{
                let tokenReq = await fetch("/get-csrf", {method: "get", headers: {code: code}})
                let tokenRes = await tokenReq.json()

                if (tokenRes.success){
                    res(tokenReq.headers.get("x-csrf-token"))
                }
                else{
                    rej(res)
                }
            }
            catch(er){
                rej(er)
            }
        })
    }


    let resultEffect = (bin, msg, success) => {
        return new Promise(res => {
            if (success){
                bin.css("color", "green")
            }
            else{
                bin.css("color", "red")
            }

            bin.text(msg)
            bin.css("display", "block")

            setTimeout(() => {
                bin.css("display", "none")
                res()
            }, 3000)
        })
    }

    let startNotepad = async () => {
        let getFileReq = await fetch("/myfile", {method: "GET", headers: {code: loginData.code}})
        let res = await getFileReq.json()

        if (res.success){
            textboxMain.text(res.data)
            resultEffect(saveResult, "Notepad loaded successfully", true)
        }
        else{
            resultEffect(saveResult, "Failed to load notepad content, try refreshing the page.", false)
        }

        mainPage.css("display", "block")
        loginPage.css("display", "none")
    }

    loginForm.on("submit", e => {
        e.preventDefault()

        let request = fetch("/login", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({code: loginCodeInput.val()})})
        request.then(async data => {
            data = await data.json()
            loginData = data

            if (data.success){
                if (data.userFacingMsg){
                    await resultEffect(loginResult, data.userFacingMsg, true)
                }
                else{
                    await resultEffect(loginResult, "Login successfull, starting notepad now.", true)
                }

                startNotepad()
            }
            else{
                if (data.userFacingMsg){
                    resultEffect(loginResult, data.userFacingMsg, false)
                }
                else{
                    switch(data.err){
                        case 500:
                            resultEffect(loginResult, "Server error while logging in", false)
                        break;

                        case 401:
                            resultEffect(loginResult, "Clientsided error occured", false)
                        break;

                        default:
                            resultEffect(loginResult, "Unknown error occured", false)
                        break;
                    }
                }
            }
        })

        request.catch(er => {
            alert("Network error")
        })

        return false
    })

    saveBtn.on("click", async () => {
        let csrfToken = await getSessionToken(loginData.code)
        console.log(`CSRF: ${csrfToken}`)
        let saveReq = await fetch("/save", {method: "POST", headers: {"Content-Type": "application/json", "x-csrf-token": csrfToken}, body: JSON.stringify({data: textboxMain.val()})})
        let res = await saveReq.json()

        if (res.success){
            resultEffect(saveResult, "Saved successfully", true)
        }
        else{
            alert("Save failed")
            console.log(res)
            resultEffect(saveResult, "Failed to save, make sure you copy your work.", false)
        }
    })
})