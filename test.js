const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('index.html', 'utf8');

const dom = new JSDOM(html, {
    url: "http://localhost/",
    runScripts: "dangerously",
    resources: "usable"
});

dom.window.onerror = function (msg, url, line, col, err) {
    console.error(`ERROR: ${msg} at line ${line}`);
};

dom.window.document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded fired!");
    setTimeout(() => {
        console.log("Checking for exceptions...");
    }, 500);
});
