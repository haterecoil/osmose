/*
    Simplified version of Underscore.Js

    since we just need Bakbone's extent function, and since we
    have an educational goal,
    we decided to make a simplified version of this function which uses Underscore.JS
 http://backbonejs.org/#View-extend
 http://underscorejs.org/docs/underscore.html
 */

/*
var _su =  {};

_su.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_su.has(obj, key)) keys.push(key);

    if (hasEnumBug) collectNonEnumProps(obj, keys);

}
//first helper function copies a list of properties
//to a first argument "source" from all further arguments
var createAssigner = function(keysFunc, undefinedOnly) {
    //obj will take the first argument, aka the receiving object
    return function(obj) {
        //arguments still is the parent arguments function
        var length = arguments.length;
        if ( length < 2 || obj == null ) return obj; //if nothing to copy, return
        for (var index = 1; index < length; index++) { //index begins at 1 !
            var source  = arguments[index],//since index >= 1, it will point to a source object
                keys    = keysFunc(source),// ???
                l       = keys.length;
            for (var i =0; i < l; i++) {
                var key = keys[i];
                if (!undefinedOnly || obj[key] === void 0) //void 0 is a safe alternative to undefined
                    obj[key] = source[key];
            }
        }
        return obj;
    }
}


_su.extend = createAssigner(_.keysFunc);*/