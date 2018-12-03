
var url = function (r) {

    var root = r;
    
    this.resolve = function (u) {
        return url.prototype.resolve(root, this.mapToRoot(u));
    }
    this.mapToRoot = function (u) {
        return url.prototype.mapToRoot(u);
    }
    this.resolveOnPage = function (u) {
        return this.resolve(_pageAdapter + '/' + u);
    }
}

url.prototype = {
    resolve: function (root, relative) {
        var _culture = { bilingual: false };
        if (typeof(culture) != 'undefined') {
            _culture = culture;
        }
        var resolved = relative;
        if (relative.charAt(0) == '~') {
            var langPrefix = '';
            if (_culture.bilingual === true) {
                langPrefix = _culture.lang + '/';
            }

            if (langPrefix.length) {
                langPrefix = '/' + langPrefix;
            }
            resolved = `${root.trimEndChar('/')}${langPrefix.trimStartChar('/').trimEndChar('/')}/${relative.trimStartChar('/').substring(2)}`;
            //resolved = root + langPrefix + relative.substring(2);
        }
        //console.log(relative + ' mapped to => ' + resolved);
        return resolved;
    },
    mapToRoot: function (u) {
        var result = u;
        if (u.charAt(0) != '~') {
            result = '~/' + u;
        }
        //console.log(u + ' mapped to => ' + result);
        return result;
    }
};