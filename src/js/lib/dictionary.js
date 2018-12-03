var Dictionary = function () {
    var collection = new Array();
}
Dictionary.prototype.add = function (key, value, overWrite) {
    if (!this.containsKey(key)) {
        this.collection.push({ key: key, value: value });
    }
    else {
        if (overWrite === true) {
            var index = this.getKeyIndex(key);
            this.remove(key);
            this.collection.insert(index, { key: key, value: value });
        }
    }
}
Dictionary.prototype.insert = function (index, key, value, overWrite) {
    if (!this.containsKey(key)) {
        this.collection.insert(index, { key: key, value: value });
    }
    else {
        if (overWrite === true) {
            var index = this.getKeyIndex(key);
            this.remove(key);
            this.collection.insert(index, { key: key, value: value });
        }
    }
}
Dictionary.prototype.remove = function (key) {
    var index = this.getKeyIndex(key);
    if (index >= 0) {
        this.collection.remove(index);
    }
}
Dictionary.prototype.containsKey = function (key) {
    return this.getKeyIndex(key) != -1;
}
Dictionary.prototype.getKeyIndex = function (key) {
    if (!key) return -1;
    if (key.length <= 0) return -1;
    for (var i = 0; i < this.collection.length; i++) {
        if (this.collection[i].key.toLowerCase().trim() == key.toLowerCase().trim()) {
            return i;
        }
    }
    return -1;
}
Dictionary.prototype.value = function (key) {
    var keyIndex = this.getKeyIndex(key);
    if (keyIndex < 0) return null;
    return this.collection[keyIndex].value;
}
Dictionary.prototype.keys = function () {
    var result = new Array();
    for (var i = 0; i < this.collection.length; i++) {
        result.push(this.collection[i].key);
    }
    return result;
}

module.exports = Dictionary();