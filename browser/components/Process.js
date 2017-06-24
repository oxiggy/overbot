window.Process= Process;

/**
 * Информация о процессе
 */
function Process(element) {

    element.innerHTML= `
        <h2>Процесс</h2>
        <pre></pre>
    `;

    fetchData();

    setInterval(() => {
        fetchData();
    }, 1000 * 60);

    function fetchData() {
        fetch('/api/v1/process')
            .then((res) => res.json())
            .then(onData)
        ;
    }

    function onData(data) {
        element.querySelector('pre').innerHTML= JSON.stringify(data, null, 2);
    }

}
