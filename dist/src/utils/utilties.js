"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UtilitiesClass = /** @class */ (function () {
    function UtilitiesClass() {
        var _this = this;
        this.removeStrings = function (str, strings) { return strings.reduce(function (result, s) { return result.replace(s, ''); }, str); };
        this.titleFunction = function (title) {
            if (!title)
                return '';
            return _this.removeStrings(title, [
                'FREE DOWNLOAD',
                '[FREE DOWNLOAD]',
                '[ORIGINAL MIX]',
                '[EXTENDED MIX]',
                'ORIGINAL MIX',
                'EXTENDED MIX'
            ]).trim();
        };
    }
    return UtilitiesClass;
}());
var Utilities = new UtilitiesClass();
exports.default = Utilities;
//# sourceMappingURL=utilties.js.map