/* Generated from Java with JSweet 1.2.0 - http://www.jsweet.org */
namespace quickstart {
    import ArrayList = java.util.ArrayList;

    import List = java.util.List;

    /**
     * This class is used within the webapp/index.html file.
     */
    export class QuickStart {
        public static main(args : string[]) {
            let l : List<string> = <any>(new ArrayList<any>());
            l.add("Hello");
            l.add("world");
            let a : Array<string> = <any>(new Array<any>());
            a.push("Hello", "world");
            $("#target").text(l.toString());
            alert(a.toString());
        }
    }
    QuickStart["__class"] = "quickstart.QuickStart";

}


quickstart.QuickStart.main(null);
