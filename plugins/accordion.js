function accordionToggle(mouseEvent) {
    var content = mouseEvent.target.nextElementSibling;
    content.hidden = !content.hidden;
}
function accordionPlugin(hook, vm) {
    hook.doneEach(function () {
        document.querySelectorAll('button.accordion-toggle').forEach(function (element) { return element.onclick = accordionToggle; });
    });
}
var docsify = window.$docsify || {};
docsify.plugins = [accordionPlugin].concat(docsify.plugins || []);
