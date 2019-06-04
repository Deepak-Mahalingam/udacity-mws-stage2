if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js',{scope: '/'})
    .then(()=> console.log("Registration successful"))
    .catch((err)=>console.log("Registration unsuccessful ",err))
}
