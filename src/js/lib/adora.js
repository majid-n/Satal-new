var _url = null;

function _deepen(o, ignoreFunctions) {
    var oo = {}, t, parts, part;
    for (var k in o) {
        var isFunction = typeof (o[k]) === 'function';
        var ignore = false;

        if (ignoreFunctions && isFunction) ignore = true;

        if (!ignore) {
            t = oo;
            parts = k.split('.');
            var key = parts.pop();
            while (parts.length) {
                part = parts.shift();
                t = t[part] = t[part] || {};
            }
            t[key] = o[k];
        }
    }
    return oo;
}

function _getCurrentLocation(success, error, options) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, options);
        return true;
    }
    return false;
}

function _htmlDecode(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes[0];
}

function _getQueryStrings() {
    var result = {};
    var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
    var queryString = location.search.substring(1);

    var keyValues = queryString.split('&');
    for (var i = 0; i < keyValues.length; i++) {
        if (keyValues[i]) {
            var key = keyValues[i].split('=');
            if (key) {
                if (key.length == 2) {
                    if (key.length > 1) {
                        result[decode(key[0])] = decode(key[1]);
                    }
                }
            }
        }
    }
    return result;
}

function _str2object(str, validateFirst) {
    try {
        if (validateFirst) {
            return JSON.parse(str
                // wrap keys without quote with valid double quote
                .replace(/([\$\w]+)\s*:/g, function (_, $1) { return '"' + $1 + '":'; })
                // replacing single quote wrapped ones to double quote
                .replace(/'([^']+)'/g, function (_, $1) { return '"' + $1 + '"'; })
            );
        } else {
            return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
        }
    } catch (e) { return false; }
}

//#region " Array "
if (!Array.prototype.remove) {
    Array.prototype.removeByVal = function (val) {
        var i = this.indexOf(val);
        return i > -1 ? this.splice(i, 1) : [];
    };
    Array.prototype.remove = function (index) {
        return index > -1 ? this.splice(index, 1) : [];
    };
    Array.prototype.removeByObjectId = function (val) {
        var index = -1;
        for (var i = 0; i < this.length; i++) {
            if (this[i].id == val) {
                return this.remove(i);
            }
        }
    };
    Array.prototype.insert = function (index, val) {
        this.splice(index, 0, val);
    }
}

//#region " String "
if (!String.prototype.getExtension) {
    String.prototype.getExtension = function () {
        var parts = this.split(".");
        if (parts.length === 1 || (parts[0] === '' && parts.length === 2)) {
            return '';
        }
        return parts.pop();
    }
}

if (!String.prototype.isAnImage) {
    String.prototype.isAnImage = function () {
        return (/\.(jpg|jpeg|png|gif)$/i).test(this);
    }
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

if (!String.prototype.toEnNumber) {
    String.prototype.toEnNumber = function () {
        var _persianNum = [/۰/gi, /۱/gi, /۲/gi, /۳/gi, /۴/gi, /۵/gi, /۶/gi, /۷/gi, /۸/gi, /۹/gi];
        var str = this;
        for (var i = 0; i < 10; i++) {
            str = str.replace(_persianNum[i], i);
        }
        return str;
    }
}

if (!String.prototype.getIranianMobiles) {
    String.prototype.getIranianMobiles = function () {
        var _mobileReg = /(0|\+98)?([ ]|-|[()]){0,2}9[1|2|3|4]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}/ig;
        var _mobileJunkReg = /[^\d]/ig;
        var str = this;
        if (!str || str.length == 0) str = '';
        var mobiles = str.toEnNumber().match(_mobileReg) || [];
        mobiles.forEach(function (value, index, arr) {
            arr[index] = value.replace(_mobileJunkReg, '');
            arr[index][0] === '0' || (arr[index] = '0' + arr[index]);
        });
        return mobiles;
    }
}

if (!String.prototype.isValidNationalCode) {
    String.prototype.isValidNationalCode = function () {
        var input = this;
        if (!/^\d{10}$/.test(input))
            return false;

        var check = parseInt(input[9]);
        var sum = [0, 1, 2, 3, 4, 5, 6, 7, 8]
            .map(function (x) { return parseInt(input[x]) * (10 - x); })
            .reduce(function (x, y) { return x + y; }) % 11;

        return sum < 2 && check == sum || sum >= 2 && check + sum == 11;
    }
}

if (!String.prototype.like) {
    String.prototype.like = function (searchPattern) {
        var str = this;
        var regex = new RegExp(searchPattern, "i");
        var result = str.match(regex);
        return result != null;
    }
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    }
}

if (!String.prototype.left) {
    String.prototype.left = function (n) {
        if (n < 0) return this.toString();
        return this.substring(0, n)
    }
}

if (!String.prototype.right) {
    String.prototype.right = function (n) {
        if (n < 0) return this.toString();
        if (this.length - n < 0) return this.toString();
        return this.substring(this.length - n)
    }
}

if (!String.prototype.trimStartChar) {
    String.prototype.trimStartChar = function (char) {
        var result = this.trim();
        if (result.left(1) == char) {
            result = result.right(result.length - 1);
        }
        return result;
    }
}

if (!String.prototype.trimEndChar) {
    String.prototype.trimEndChar = function (char) {
        var result = this.trim();
        if (result.right(1) == char) result = result.left(result.length - 1);
        return result;
    }
}

if (!String.prototype.format) {
    String.prototype.format = function (args) {
        var regex = new RegExp("{-?[0-9]+}", "g");
        var str = this;
        return str.replace(regex, function (item) {
            var intVal = parseInt(item.substring(1, item.length - 1));
            var replace;
            if (intVal >= 0) {
                replace = args[intVal];
            } else if (intVal === -1) {
                replace = "{";
            } else if (intVal === -2) {
                replace = "}";
            } else {
                replace = "";
            }
            return replace;
        });
    }
}

if (!String.prototype.toObject) {
    String.prototype.toObject = function () {
        return _str2object(this, true);
    }
}