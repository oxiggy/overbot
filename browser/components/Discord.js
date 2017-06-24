window.Discord= Discord;

/**
 * Информация о подключении к Дискорду
 */
function Discord(element) {

    element.innerHTML= `
        <h2>Дискорд</h2>
        <pre></pre>
    `;

    fetchData();

    setInterval(() => {
        fetchData();
    }, 1000 * 60);

    function fetchData() {
        fetch('/api/v1/discord')
            .then((res) => res.json())
            .then(onData)
        ;
    }

    function onData(data) {
        element.querySelector('pre').innerHTML= JSON.stringify(data, null, 2);
    }

}
