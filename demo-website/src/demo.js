import demoLibraryJarUrl from "./demo-library.jar?url"

/**
 * @typedef {'3.1'|'4.1'|'local'} CheerpJVersion
 */

document.querySelector('#init-cj-v3_1-java-v8').onclick = () => init({cheerpJ: '3.1', java: 8})
document.querySelector('#init-cj-v4_1-java-v8').onclick = () => init({cheerpJ: '4.1', java: 8})
document.querySelector('#init-cj-v4_1-java-v11').onclick = () => init({cheerpJ: '4.1', java: 11})
document.querySelector('#init-cj-local-java-v8').onclick = () => init({cheerpJ: 'local', java: 8})
document.querySelector('#init-cj-local-java-v11').onclick = () => init({cheerpJ: 'local', java: 11})

if (window.location.hash.startsWith("#init")) {
    // Auto init for quick testing during development
    document.querySelector(window.location.hash).click()
}

/**
 * @param {CheerpJVersion} cheerpJ
 * @param {8|11} java
 */
async function init({cheerpJ, java}) {
    try {
        document.querySelectorAll('button').forEach(button => button.disabled = true)

        await insertCheerpJLoader(cheerpJ)

        log(`Initializing ${JSON.stringify({cheerpJ, java})}`)
        await cheerpjInit({
            version: java,
            enableDebug: false,
        })

        log("Downloading demo library jar")
        const jarPath = "/str/demo-library.jar";
        const jarBytes = await downloadDemoLibraryJar();
        cheerpOSAddStringFile(jarPath, jarBytes);

        log("Initializing demo library jar")
        const jar = await cheerpjRunLibrary(jarPath);
        const Demo = await jar.io.vason.Demo;

        log("Running tests...")

        // This is a simple test which always passes
        await assertEquals({
            description: "Demo.ping",
            expected: "pong",
            getActual: () => Demo.ping(),
        })

        // FIXME: This test sometimes passes with {version: 11},
        //        but usually throws java.lang.ExceptionInInitializerError.
        //        No such error occurs with {version: 8}.
        await assertEquals({
            description: "Demo.getContentType",
            expected: "application/vnd.openxmlformats-package.core-properties+xml",
            getActual: () => Demo.getContentType(),
        })

        // FIXME: This test always throws java.lang.UnsatisfiedLinkError with {version: 11},
        //        No such error occurs with {version: 8}.
        await assertEquals({
            description: "Demo.getDoubleValue",
            expected: 13.37,
            getActual: () => Demo.getDoubleValue(),
        })
    } catch (e) {
        log("Error. See console for details.")
        console.error(e)
    } finally {
        document.body.append("Demo finished. Refresh the page to run it again.")
    }
}

/**
 * @returns {Promise<Uint8Array>}
 */
async function downloadDemoLibraryJar() {
    const jarRes = await fetch(demoLibraryJarUrl);
    const jarBuffer = await jarRes.arrayBuffer();
    return new Uint8Array(jarBuffer);
}

async function assertEquals({description, expected, getActual}) {
    let actual
    try {
        actual = await getActual()
    } catch (e) {
        actual = `Error. See console for details.`
        console.error(`${description} error: `, e)
    }

    const pass = expected === actual

    log(`[${pass ? 'PASS' : 'FAIL'}] ${description} -> Expected: ${expected}, Actual: ${actual}`)
}

function log(message) {
    const logs = document.querySelector('#logs')
    logs.append(`${new Date().toLocaleTimeString()} | ${message}\n`)
}

/**
 * @param {CheerpJVersion} version
 */
function insertCheerpJLoader(version) {
    let src;
    switch (version) {
        case "3.1":
            src = "https://cjrtnc.leaningtech.com/3.1/cj3loader.js"
            break;
        case "4.1":
            src = "https://cjrtnc.leaningtech.com/4.1/loader.js"
            break;
        case "local":
            // This is git-ignored to keep repo size small, so you
            // will need to manually copy CheerpJ distribution to
            // $PROJECT_ROOT/demo-website/public/cheerpj
            // in order to test a self-hosted distribution.
            src = "/cheerpj/loader.js"
            break;
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
}
