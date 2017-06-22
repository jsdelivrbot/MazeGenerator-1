/* Generated from Java with JSweet 1.2.0 - http://www.jsweet.org */
var quickstart;
(function (quickstart) {
    var ArrayList = java.util.ArrayList;
    /**
     * This class is used within the webapp/index.html file.
     */
    var QuickStart = (function () {
        function QuickStart() {
        }
        QuickStart.main = function (args) {
            var l = (new ArrayList());
            l.add("Hello");
            l.add("world");
            var a = (new Array());
            a.push("Hello", "world");
            $("#target").text(l.toString());
            alert(a.toString());
        };
        return QuickStart;
    }());
    quickstart.QuickStart = QuickStart;
    QuickStart["__class"] = "quickstart.QuickStart";
})(quickstart || (quickstart = {}));
quickstart.QuickStart.main(null);
