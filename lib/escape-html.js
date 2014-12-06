'use strict';

var escapeHtml = function (text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#039;',
        '\n': '<br>',
        '≤': '<a class="clickable">',
        '≥': '</a>'
    };

    return text.replace(/[&<>"'\n\≤\≥]/g, function (m) {
        return map[m];
    });
};

module.exports = escapeHtml;
