
function accordionToggle(mouseEvent: MouseEvent) {
    const content = (mouseEvent.target as HTMLElement).parentElement.querySelector<HTMLDivElement>('.accordion-content');
    content.hidden = !content.hidden;
}

function accordionPlugin(hook: any, vm: any) {
    hook.doneEach(function() {
        document.querySelectorAll('button.accordion-toggle').forEach((element: HTMLButtonElement) => element.onclick = accordionToggle);
    });
}

let docsify = (window as any).$docsify || {};
docsify.plugins = [accordionPlugin].concat(docsify.plugins || []);
