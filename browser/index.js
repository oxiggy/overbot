new Discord(document.getElementById('discord'));
new Process(document.getElementById('process'));

fetch('/api/v1').then(res => res.json()).then((data) => {
    document.getElementById('version').innerHTML= `v${data.version}`;
})
