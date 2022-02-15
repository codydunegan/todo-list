export const Priority = Object.freeze({
    URGENT: 'Urgent',
    HIGH: 'High',
    MEDIUM: 'Medium',
    LOW: 'Low'
});

export function createElement(type, _class = '') {
    let div = document.createElement(type);
    if (_class !== '') div.classList.add(_class);

    return div;
}

export function createIcon(image) {
    let icon = createElement('span', 'iconify');
    icon.setAttribute('data-icon', image);

    return icon;
}