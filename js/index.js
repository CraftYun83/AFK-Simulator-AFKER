const ws = new WebSocket("ws://localhost:6942");
let XPCount = 0

ws.addEventListener("open", () =>{
    return false;
});
 
ws.addEventListener('message', (data) => {
    if (data.data.includes(":xpUpdate:")) {
        XPCount = data.data.replaceAll(":xpUpdate:", "")
        document.getElementById("XPCount").innerText = "XP: "+parseInt(XPCount).toLocaleString("en-US").toString();
    } if (data.data.includes(":chatUpdate:")) {
        
        document.getElementById("chat").innerHTML += "<h3>"+data.data.replaceAll(":chatUpdate:", "").replaceAll("\n", "<br>")+"</h3>"
        document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight
    }
});

document.querySelector("button").onclick = function() {
    if (document.getElementById("sendMessage").value != "") {
        ws.send(document.getElementById("sendMessage").value)
        document.getElementById("sendMessage").value = ""
    }
}