mermaid.initialize({
    startOnLoad: true,
    darkMode: true,
    theme: 'base',
    themeVariables: {
        primaryColor: 'hsl(131, 45%, 45%)',
        lineColor: 'hsl(211, 50%, 50%)',
        primaryTextColor: 'hsl(211, 25%, 25%)',
        textColor: 'hsl(211, 50%, 50%)',
        edgeLabelBackground: 'hsl(211, 50%, 50%)'
    },
    sequence: {
        mirrorActors: false
    }
});
function mermaidPlugin(hook) {
    hook.afterEach(function (html, next) {
        console.log(html);
        var htmlElement = document.createElement('div');
        htmlElement.innerHTML = html;
        htmlElement.querySelectorAll('pre[data-lang=mermaid]').forEach(function (element) {
            var replacement = document.createElement('div');
            replacement.textContent = element.textContent;
            replacement.classList.add('mermaid');
            element.parentNode.replaceChild(replacement, element);
        });
        next(htmlElement.innerHTML);
    });
    hook.doneEach(function () {
        mermaid.init({}, '.mermaid');
    });
}
var docsify = window.$docsify || {};
docsify.plugins = [mermaidPlugin].concat(docsify.plugins || []);
