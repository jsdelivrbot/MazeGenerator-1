/* Generated from Java with JSweet 1.2.0 - http://www.jsweet.org */
var ArrayList = java.util.ArrayList;
var Stack = java.util.Stack;
var HashMap = java.util.HashMap;
/**
 * This class creates a maze the size of the given width and depth.
 * This class will create the maze, show the steps of creating the maze if the given value depth is true.
 * And will solve the maze.
 */
var Maze = (function () {
    /**
     * Constructor that assigns the width and depth to the given values.
     * And calls the methods to create the graph and to create the path and to solve the maze.
     *
     * @param width The int width of the maze.
     * @param depth The int depth of the maze
     * @param debug The boolean flag deciding whether to debug or not. True means to debug, false not to debug.
     */
    function Maze(width, depth, debug) {
        this.myWidth = 0;
        this.myDepth = 0;
        this.myDebug = false;
        Maze.myGeneratedMazeAsAString = "";
        this.myWidth = width;
        this.myDepth = depth;
        this.myDebug = debug;
        this.myGraph = new Maze.Graph(this, width, depth);
        this.createPath();
        this.display();
    }
    /**
     * Returns a random number in the range of 0 to the given max integer.
     * Source: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-
     * in-a-specific-range
     * @param max The max integer to include.
     * @return Random number between 0 and the given max integer.
     */
    Maze.prototype.getRandomNum = function (max) {
        var min = 0;
        return ((Math.random() * (max - min) + min) | 0);
    };
    /**
     * Returns the String myGeneratedMazeAsAString, which is the generated and solved maze as a string.
     * @return The generated and solved maze as a string.
     */
    Maze.prototype.getGeneratedMazeAsString = function () {
        return Maze.myGeneratedMazeAsAString;
    };
    /**
     * Creates spanning tree inside of the maze as well as calling the method to solve the maze.
     * Before calling the spanning tree method and the maze solving method, this method chooses the starting and ending
     * point of the maze.
     */
    Maze.prototype.createPath = function () {
        var array = this.myGraph.getGraph();
        var currentNode;
        var listOfEdges = (new ArrayList());
        for (var row = 0; row < this.myWidth; row++) {
            for (var col = 0; col < this.myDepth; col++) {
                currentNode = array[row][col];
                if (currentNode.getNeighbors().size() === 3) {
                    listOfEdges.add(currentNode);
                }
            }
        }
        var numberOfEdges = listOfEdges.size();
        var randomEdge = this.getRandomNum(numberOfEdges);
        var endEdge = this.getRandomNum(numberOfEdges);
        while ((endEdge === randomEdge)) {
            endEdge = this.getRandomNum(numberOfEdges);
        }
        ;
        var nodeMap = this.myGraph.getMap();
        var stack = (new Stack());
        var nameOfNextNode;
        nameOfNextNode = randomEdge;
        var endNode = nodeMap.get("" + endEdge);
        while ((!endNode.isThisACornerOrEdge())) {
            endEdge = this.getRandomNum(numberOfEdges);
            while ((endEdge === randomEdge)) {
                endEdge = this.getRandomNum(numberOfEdges);
            }
            ;
            endNode = nodeMap.get("" + endEdge);
        }
        ;
        currentNode = nodeMap.get("" + nameOfNextNode);
        var difference = Math.abs(numberOfEdges - endEdge);
        while ((!currentNode.isThisACornerOrEdge() && difference !== numberOfEdges)) {
            nameOfNextNode = this.getRandomNum(numberOfEdges);
            while ((nameOfNextNode === endEdge)) {
                nameOfNextNode = this.getRandomNum(numberOfEdges);
            }
            ;
            currentNode = nodeMap.get("" + nameOfNextNode);
            difference = Math.abs(numberOfEdges - endEdge);
        }
        ;
        this.createSpanningTree(currentNode, endNode, stack);
        this.solution(currentNode, endNode);
    };
    /**
     * Creates spanning tree inside of maze. Starts at the given startingNode and goes through each node of the maze
     * until there are no more nodes to go through. As it goes through the maze once it reaches the given ending node
     * the program will mark the node to let the rest of the program know that this is where the ending node is.
     *
     * @param theStartingNode The Node to start creating the maze from, should be one of the edge nodes.
     * @param theEndingNode The Node to mark as the end of the maze, should be one of the edge nodes.
     * @param theStack The stack to add the nodes to.
     */
    Maze.prototype.createSpanningTree = function (theStartingNode, theEndingNode, theStack) {
        var currentNode = theStartingNode;
        var nameOfNextNode;
        var currentNodeNeighbors;
        currentNode.setVisited(true);
        currentNode.setThisAsStartNode();
        while ((this.anyUnvisitedNeighborsInMaze())) {
            if (this.areThereUnvisitedNeighborsForThisNode(currentNode, "visited")) {
                currentNodeNeighbors = this.getUnvisitedNeighborsForThisNode(currentNode, "visited");
                nameOfNextNode = this.getRandomNum(currentNodeNeighbors.size());
                theStack.push(currentNode);
                currentNode.breakWallAssociatedWithThisNode(currentNodeNeighbors.get(nameOfNextNode).getName());
                currentNodeNeighbors.get(nameOfNextNode).breakWallAssociatedWithThisNode(currentNode.getName());
                currentNode = currentNodeNeighbors.get(nameOfNextNode);
                currentNode.setVisited(true);
                if ((currentNode.getName() === theEndingNode.getName())) {
                    currentNode.setThisAsEndNode();
                }
            }
            else if (!theStack.isEmpty()) {
                currentNode = theStack.pop();
            }
            if (this.myDebug) {
                this.displayWithOrWithoutSolution(true);
            }
        }
        ;
    };
    /**
     * Looks at the given node's adjacent nodes to see if any of them have been visited by the createSpanningTree
     * method, or the solution method. If there are any nodes which have not been visited by one of these methods
     * depending on which method is being checked this method will return true, false if all adjacent nodes have
     * been visited.
     *
     * @param theNode The Node who's adjacent nodes will be checked.
     * @param whichMethod The String deciding which method to check against, for the createSpanningTree method use
     * "visited" for the solution method any other string is okay. I used "solution".
     * @return Returns true if, depending on which method, there are unvisited nodes adjacent to the given node.
     */
    Maze.prototype.areThereUnvisitedNeighborsForThisNode = function (theNode, whichMethod) {
        if ((whichMethod === "visited")) {
            var thereAreUnvisitedNeighbors = false;
            for (var i = 0; i < theNode.getNeighbors().size(); i++) {
                if (!theNode.getNeighbors().get(i).getVisited()) {
                    thereAreUnvisitedNeighbors = true;
                    break;
                }
                else
                    thereAreUnvisitedNeighbors = false;
            }
            return thereAreUnvisitedNeighbors;
        }
        else {
            var thereAreUnvisitedNeighbors = false;
            var currentNode = void 0;
            for (var i = 0; i < theNode.getNeighbors().size(); i++) {
                currentNode = theNode.getNeighbors().get(i);
                if (!currentNode.visitedBySolutionFinder() && theNode.isThisNodeConnectedToThisNode(currentNode)) {
                    thereAreUnvisitedNeighbors = true;
                    break;
                }
                else
                    thereAreUnvisitedNeighbors = false;
            }
            return thereAreUnvisitedNeighbors;
        }
    };
    /**
     * Looks through the entire maze and checks if any of the nodes have not been visited by the createSpanningTree
     * method. If there are any unvisited nodes this method will return true, if all methods have been visited this
     * method will return false.
     *
     * @return False if all nodes have been visited, true if there is at least one node that has not been visited.
     */
    Maze.prototype.anyUnvisitedNeighborsInMaze = function () {
        var thereAreUnvisitedNeighbors = false;
        var array = this.myGraph.getGraph();
        for (var row = 0; row < this.myWidth; row++) {
            for (var col = 0; col < this.myDepth; col++) {
                if (!array[row][col].getVisited()) {
                    thereAreUnvisitedNeighbors = true;
                    break;
                }
            }
            if (thereAreUnvisitedNeighbors)
                break;
        }
        return thereAreUnvisitedNeighbors;
    };
    /**
     * Returns the neighbors for the given node. If whichMethod is equal to "visited" this method will return a list
     * of all nodes adjacent to the given node that have not been visited by the createSpanningTree method. If
     * whichMethod is equal to any other string, this method will return a list of all nodes that have not been
     * visited by the solution method.
     *
     * @param theNode The Node who's adjacent nodes will be checked.
     * @param whichMethod String deciding which method to check against whether or not it has visited this node. Use
     * "visited" to check against the creatingSpanningTree method and use any other String to
     * check against the solution method.
     * @return Return a list of nodes that, depending on the method, have not been visited.
     */
    Maze.prototype.getUnvisitedNeighborsForThisNode = function (theNode, whichMethod) {
        var theList = (new ArrayList());
        var currentNode;
        if ((whichMethod === "visited")) {
            for (var i = 0; i < theNode.getNeighbors().size(); i++) {
                currentNode = theNode.getNeighbors().get(i);
                if (!currentNode.getVisited()) {
                    theList.add(currentNode);
                }
            }
            return theList;
        }
        else {
            for (var i = 0; i < theNode.getNeighbors().size(); i++) {
                currentNode = theNode.getNeighbors().get(i);
                if (!currentNode.visitedBySolutionFinder() && theNode.isThisNodeConnectedToThisNode(currentNode)) {
                    theList.add(currentNode);
                }
            }
            return theList;
        }
    };
    /**
     * Solves the maze. This method solves the maze by using a depth first search. As it goes through the maze it will
     * mark nodes that are a part of the solution path.
     *
     * @param theStartingNode The node to start solving the maze from.
     * @param theEndingNode The node that when reached during the solving of the maze will stop the method from going
     * any farther through the maze.
     */
    Maze.prototype.solution = function (theStartingNode, theEndingNode) {
        var stack = (new Stack());
        var currentNode = theStartingNode;
        currentNode.setThisNodeAsVisitedBySolutionFinder();
        currentNode.setThisNodeAsPartOfSolution();
        var currentNodeNeighbors;
        var nameOfNextNode;
        var endNodeFound = false;
        while ((!endNodeFound)) {
            if (this.areThereUnvisitedNeighborsForThisNode(currentNode, "solution")) {
                currentNodeNeighbors = this.getUnvisitedNeighborsForThisNode(currentNode, "solution");
                nameOfNextNode = this.getRandomNum(currentNodeNeighbors.size());
                stack.push(currentNode);
                currentNode = currentNodeNeighbors.get(nameOfNextNode);
                currentNode.setThisNodeAsVisitedBySolutionFinder();
                currentNode.setThisNodeAsPartOfSolution();
                if ((currentNode.getName() === theEndingNode.getName())) {
                    endNodeFound = true;
                }
            }
            else if (!stack.isEmpty()) {
                currentNode.setThisNodeAsNoLongerApartOfSolution();
                currentNode = stack.pop();
            }
        }
        ;
    };
    /**
     * Prints out the maze. If the given boolean is true this method will print out the maze with the nodes that were
     * visisted by the createSpanningTree method with an A. If the given boolean is false this method will print out the
     * maze with the nodes that were marked as part of the solution by the solution method with a plus.
     *
     * @param theDebugOrNot The boolean deciding whether or not to show the maze with the nodes that have been visited
     * by the createSpanningTree method as A's or as +'s with the node that has been visited by the
     * solution method. True will show the nodes as A's, false will show
     * the maze with +'s for the nodes that are a part of the solution path.
     */
    Maze.prototype.displayWithOrWithoutSolution = function (theDebugOrNot) {
        var array = this.myGraph.getGraph();
        if (theDebugOrNot) {
            for (var row = 0; row < this.myWidth; row++) {
                for (var col = 0; col < this.myDepth; col++) {
                    Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "X ";
                    array[row][col].printTopWall();
                    Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "X ";
                }
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "<br />";
                for (var col = 0; col < this.myDepth; col++) {
                    array[row][col].printMiddleWalls();
                }
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "<br />";
                for (var col = 0; col < this.myDepth; col++) {
                    Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "X ";
                    array[row][col].printBottomWall();
                    Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "X ";
                }
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "<br />";
            }
            Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "<br />";
        }
        else {
            for (var row = 0; row < this.myWidth; row++) {
                for (var col = 0; col < this.myDepth; col++) {
                    Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "X ";
                    array[row][col].printTopWall();
                    Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "X ";
                }
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "<br />";
                for (var col = 0; col < this.myDepth; col++) {
                    array[row][col].printMiddleWallsForSolution();
                }
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "<br />";
                for (var col = 0; col < this.myDepth; col++) {
                    Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "X ";
                    array[row][col].printBottomWall();
                    Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "X ";
                }
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "<br />";
            }
            Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "<br />";
        }
    };
    /**
     * This method calls the displayWithOrWithoutSolution method with false as the given value for the
     * displayWithOrWithoutSolution method, printing out the maze with +'s for nodes in the solution path.
     */
    Maze.prototype.display = function () {
        this.displayWithOrWithoutSolution(false);
    };
    /**
     * Returns String of the maze.
     * @return String of the maze.
     */
    Maze.prototype.toString = function () {
        return this.myGraph.toString();
    };
    return Maze;
}());
Maze["__class"] = "Maze";
var Maze;
(function (Maze) {
    var Node = (function () {
        /**
         * Constructor setting the name of the Node to the given String.
         * @param theName The name of the Node.
         */
        function Node(__parent, theName) {
            this.__parent = __parent;
            this.myVisited = false;
            this.myIsThisStartNode = false;
            this.myIsThisEndNode = false;
            this.myNodeWallIsBroken = false;
            this.myPartOfSolutionNode = false;
            this.myVisitedBySolution = false;
            this.myName = theName;
            this.myNeighborNodes = (new ArrayList());
            this.myVisited = false;
            this.left = null;
            this.right = null;
            this.top = null;
            this.bottom = null;
            this.myIsThisEndNode = false;
            this.myIsThisStartNode = false;
            this.myNodeWallIsBroken = false;
            this.myPartOfSolutionNode = false;
            this.myVisitedBySolution = false;
        }
        /**
         * Returns list of neighbors of the Node.
         * @return List of adjacent nodes.
         */
        Node.prototype.getNeighbors = function () {
            return this.myNeighborNodes;
        };
        /**
         * Returns name of this Node.
         * @return Name of the Node.
         */
        Node.prototype.getName = function () {
            return this.myName;
        };
        /**
         * Sets this Node as visited by the createSpanningTree method.
         * @param theSeenBoolean True to mean it was visited by the createSpanningTree method. False if not visited.
         */
        Node.prototype.setVisited = function (theSeenBoolean) {
            this.myVisited = theSeenBoolean;
        };
        /**
         * Returns true if this Node was visited by the createSpanningTree method. False if it was not visited.
         * @return True if visited, false if not.
         */
        Node.prototype.getVisited = function () {
            return this.myVisited;
        };
        /**
         * Returns list of all walls that are joining two Nodes.
         * @return List of walls joining two Nodes.
         */
        Node.prototype.getListOfWalls = function () {
            var list = (new ArrayList());
            if (this.left != null) {
                list.add(this.left);
            }
            if (this.right != null) {
                list.add(this.right);
            }
            if (this.top != null) {
                list.add(this.top);
            }
            if (this.bottom != null) {
                list.add(this.bottom);
            }
            return list;
        };
        /**
         * Sets the wall between this Node and the given node as broken.
         * @param theWallName The name of the Node to break this wall with.
         */
        Node.prototype.breakWallAssociatedWithThisNode = function (theWallName) {
            var list = this.getListOfWalls();
            for (var index121 = list.iterator(); index121.hasNext();) {
                var wallNode = index121.next();
                if ((theWallName === wallNode.getNameOfWall())) {
                    wallNode.breakThisWall();
                    break;
                }
            }
        };
        /**
         * Sets this Node to the given wall and on the given side.
         * @param theWallName The wall to this Node to.
         * @param theSide Which side to set this Node on.
         */
        Node.prototype.setThisNodeToThisWall = function (theWallName, theSide) {
            if (this.left == null && (theSide === "left"))
                this.left = new Maze.WallNode(this.__parent, theWallName);
            else if (this.right == null && (theSide === "right"))
                this.right = new Maze.WallNode(this.__parent, theWallName);
            else if (this.top == null && (theSide === "top"))
                this.top = new Maze.WallNode(this.__parent, theWallName);
            else if (this.bottom == null && (theSide === "bottom"))
                this.bottom = new Maze.WallNode(this.__parent, theWallName);
        };
        /**
         * Return true if this Node is connected to the given Node. False if it is not connected.
         * @param theNode The node to check if this node is connected to it.
         * @return True if this node and the given node are connected. False if they are not connected.
         */
        Node.prototype.isThisNodeConnectedToThisNode = function (theNode) {
            var theseNodesAreConnected = false;
            var list = this.getListOfWalls();
            for (var index122 = list.iterator(); index122.hasNext();) {
                var wallNode = index122.next();
                {
                    if ((wallNode.getNameOfWall() === theNode.getName()) && wallNode.isThisWallBroken()) {
                        theseNodesAreConnected = true;
                    }
                }
            }
            return theseNodesAreConnected;
        };
        /**
         * Returns string with each node and its adjacent nodes.
         * @return String of node with adjacent nodes.
         */
        Node.prototype.toStringWithNeighbors = function () {
            var nodeAsString = new java.lang.StringBuilder();
            nodeAsString.append("{ ");
            nodeAsString.append("[");
            nodeAsString.append(this.myName);
            nodeAsString.append("] ");
            for (var index123 = this.myNeighborNodes.iterator(); index123.hasNext();) {
                var myNeighborNode = index123.next();
                {
                    if (myNeighborNode != null) {
                        nodeAsString.append(myNeighborNode.getName());
                        nodeAsString.append(",");
                    }
                }
            }
            nodeAsString.delete(nodeAsString.length() - 1, nodeAsString.length());
            nodeAsString.append(" }");
            return nodeAsString.toString();
        };
        /**
         * Prints top of this node to console.
         */
        Node.prototype.printTopWall = function () {
            this.myNodeWallIsBroken = false;
            if ((this.isThisEndNode() && this.isThisNodeATop() && !this.myNodeWallIsBroken) || (this.isThisTheStartNode() && this.isThisNodeATop() && !this.myNodeWallIsBroken)) {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "  ";
                this.myNodeWallIsBroken = true;
            }
            else {
                this.printOutThisNode(this.top);
            }
        };
        /**
         * Prints middle of this node to the console.
         */
        Node.prototype.printMiddleWalls = function () {
            if ((this.isThisEndNode() && this.isThisNodeALeft() && !this.myNodeWallIsBroken) || (this.isThisTheStartNode() && this.isThisNodeALeft() && !this.myNodeWallIsBroken)) {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "  ";
                this.myNodeWallIsBroken = true;
            }
            else {
                this.printOutThisNode(this.left);
            }
            if (this.anyBrokenWalls() && !this.myPartOfSolutionNode) {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "A ";
            }
            else {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "  ";
            }
            if ((this.isThisEndNode() && this.isThisNodeARight() && !this.myNodeWallIsBroken) || (this.isThisTheStartNode() && this.isThisNodeARight() && !this.myNodeWallIsBroken)) {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "  ";
                this.myNodeWallIsBroken = true;
            }
            else {
                this.printOutThisNode(this.right);
            }
        };
        /**
         * Prints bottom of this node to console.
         */
        Node.prototype.printBottomWall = function () {
            if ((this.isThisEndNode() && this.isThisNodeABottom() && !this.myNodeWallIsBroken) || (this.isThisTheStartNode() && this.isThisNodeABottom() && !this.myNodeWallIsBroken)) {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "  ";
                this.myNodeWallIsBroken = true;
            }
            else {
                this.printOutThisNode(this.bottom);
            }
        };
        /**
         * Prints middle of this node to console for the maze showing the solution path.
         */
        Node.prototype.printMiddleWallsForSolution = function () {
            if ((this.isThisEndNode() && this.isThisNodeALeft() && !this.myNodeWallIsBroken) || (this.isThisTheStartNode() && this.isThisNodeALeft() && !this.myNodeWallIsBroken)) {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "  ";
                this.myNodeWallIsBroken = true;
            }
            else {
                this.printOutThisNode(this.left);
            }
            if (this.myPartOfSolutionNode) {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "+ ";
            }
            else {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "  ";
            }
            if ((this.isThisEndNode() && this.isThisNodeARight() && !this.myNodeWallIsBroken) || (this.isThisTheStartNode() && this.isThisNodeARight() && !this.myNodeWallIsBroken)) {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "  ";
                this.myNodeWallIsBroken = true;
            }
            else {
                this.printOutThisNode(this.right);
            }
        };
        /**
         * Returns true if any of this Nodes wall are broken. False if none of this nodes walls are broken.
         * @return True if walls of this Node are broken, false if none of this nodes walls are broken.
         */
        Node.prototype.anyBrokenWalls = function () {
            var list = this.getListOfWalls();
            var thereIsABrokenWall = false;
            for (var index124 = list.iterator(); index124.hasNext();) {
                var node = index124.next();
                {
                    if (node.isThisWallBroken()) {
                        thereIsABrokenWall = true;
                        break;
                    }
                }
            }
            return thereIsABrokenWall;
        };
        /**
         * Returns true if this is the start Node, false if not the start node.
         * @return True if this is the start Node, false if not the start node.
         */
        Node.prototype.isThisTheStartNode = function () {
            return this.myIsThisStartNode;
        };
        /**
         * Returns true if this is the end node, false if not the end node.
         * @return True if this is the end node, false if not the end node.
         */
        Node.prototype.isThisEndNode = function () {
            return this.myIsThisEndNode;
        };
        /**
         * Sets this node to be the start node.
         */
        Node.prototype.setThisAsStartNode = function () {
            this.myIsThisStartNode = true;
        };
        /**
         * Sets this node to be the end node.
         */
        Node.prototype.setThisAsEndNode = function () {
            this.myIsThisEndNode = true;
        };
        /**
         * Checks to see if this node is on top of the maze. Returns true if it is, and false if it is not.
         * @return True if node is on top of maze, false if not on top.
         */
        Node.prototype.isThisNodeATop = function () {
            var isThisATop = false;
            if (this.top == null) {
                isThisATop = true;
            }
            return isThisATop;
        };
        /**
         * Returns true if this node is on the right side of the maze, false if it is not.
         * @return True if node is on the right side of maze, false if not on the right side.
         */
        Node.prototype.isThisNodeARight = function () {
            var isThisARight = false;
            if (this.right == null) {
                isThisARight = true;
            }
            return isThisARight;
        };
        /**
         * Returns true if this node is on the left of the maze, false if not on the left.
         * @return True if node is on the left of maze, false if not on the left of maze.
         */
        Node.prototype.isThisNodeALeft = function () {
            var isThisALeft = false;
            if (this.left == null) {
                isThisALeft = true;
            }
            return isThisALeft;
        };
        /**
         * Returns true if this node is on the bottom of the maze, false if not on the bottom.
         * @return True if this node is on the bottom, false if not on the bottom of maze.
         */
        Node.prototype.isThisNodeABottom = function () {
            var isThisABottom = false;
            if (this.bottom == null) {
                isThisABottom = true;
            }
            return isThisABottom;
        };
        /**
         * Returns true if this node is a corner or an edge of the maze, false otherwise.
         * @return True if corner or edge, false if not a corner or edge.
         */
        Node.prototype.isThisACornerOrEdge = function () {
            var aCornerOrEdge = false;
            if (this.bottom == null && this.right == null) {
                aCornerOrEdge = true;
            }
            else if (this.bottom == null && this.left == null) {
                aCornerOrEdge = true;
            }
            else if (this.left == null && this.top == null) {
                aCornerOrEdge = true;
            }
            else if (this.right == null && this.top == null) {
                aCornerOrEdge = true;
            }
            if (this.isThisNodeATop() && !this.isThisNodeABottom() && !this.isThisNodeALeft() && !this.isThisNodeARight()) {
                aCornerOrEdge = true;
            }
            else if (!this.isThisNodeATop() && this.isThisNodeABottom() && !this.isThisNodeALeft() && !this.isThisNodeARight()) {
                aCornerOrEdge = true;
            }
            else if (!this.isThisNodeATop() && !this.isThisNodeABottom() && this.isThisNodeALeft() && !this.isThisNodeARight()) {
                aCornerOrEdge = true;
            }
            else if (!this.isThisNodeATop() && !this.isThisNodeABottom() && !this.isThisNodeALeft() && this.isThisNodeARight()) {
                aCornerOrEdge = true;
            }
            return aCornerOrEdge;
        };
        /**
         * Prints out the given node.
         * @param theNode The node to print out.
         */
        Node.prototype.printOutThisNode = function (theNode) {
            if (theNode != null && theNode.isThisWallBroken()) {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "  ";
            }
            else {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "X ";
            }
        };
        /**
         * Sets this node to be a part of the solution path.
         */
        Node.prototype.setThisNodeAsPartOfSolution = function () {
            this.myPartOfSolutionNode = true;
        };
        /**
         * Removes this node from the solution path.
         */
        Node.prototype.setThisNodeAsNoLongerApartOfSolution = function () {
            this.myPartOfSolutionNode = false;
        };
        /**
         * Sets this node as visited by the solution method.
         */
        Node.prototype.setThisNodeAsVisitedBySolutionFinder = function () {
            this.myVisitedBySolution = true;
        };
        /**
         * Returns true if this node was visited by the solution method, false if not visited.
         * @return True if visited by the solution method, false if not visited.
         */
        Node.prototype.visitedBySolutionFinder = function () {
            return this.myVisitedBySolution;
        };
        return Node;
    }());
    Maze.Node = Node;
    Node["__class"] = "Maze.Node";
    /**
     * The graph class creates a graph of n * m dimensions.
     */
    var Graph = (function () {
        /**
         * Constructor that sets the size of the graph and calls the method to create the graph.
         * @param theNumRows int number of rows of the graph.
         * @param theNumColumns int number of columns of the graph.
         */
        function Graph(__parent, theNumRows, theNumColumns) {
            this.__parent = __parent;
            this.myNumRows = 0;
            this.myNumColumns = 0;
            this.setVariables(theNumRows, theNumColumns);
            this.createGraph();
        }
        /**
         * Sets the starting values for the fields of this method.
         * @param theNumRows int number of rows of the graph.
         * @param theNumColumns int number of columns of the graph.
         */
        Graph.prototype.setVariables = function (theNumRows, theNumColumns) {
            this.myNumRows = theNumRows;
            this.myNumColumns = theNumColumns;
            this.myNodes = (new HashMap());
            this.myArray = (function (dims) { var allocate = function (dims) { if (dims.length == 0) {
                return undefined;
            }
            else {
                var array = [];
                for (var i = 0; i < dims[0]; i++) {
                    array.push(allocate(dims.slice(1)));
                }
                return array;
            } }; return allocate(dims); })([this.myNumRows, this.myNumColumns]);
        };
        /**
         * Creates graph of nodes using a 2d array.
         */
        Graph.prototype.createGraph = function () {
            var row;
            var col;
            var name;
            name = 0;
            for (row = 0; row < this.myNumRows; row++) {
                for (col = 0; col < this.myNumColumns; col++) {
                    this.myArray[row][col] = new Maze.Node(this.__parent, "" + (name));
                    name++;
                }
            }
            this.setNeighbors();
            var currentNode;
            for (row = 0; row < this.myNumRows; row++) {
                for (col = 0; col < this.myNumColumns; col++) {
                    currentNode = this.myArray[row][col];
                    this.myNodes.put(currentNode.getName(), currentNode);
                }
            }
        };
        /**
         * Connects each node with its adjacent nodes.
         */
        Graph.prototype.setNeighbors = function () {
            var row;
            var col;
            for (row = 0; row < this.myNumRows; row++) {
                for (col = 0; col < this.myNumColumns; col++) {
                    var right = col + 1;
                    if (right < this.myNumColumns && right >= 0 && this.myArray[row][right] != null) {
                        this.myArray[row][col].getNeighbors().add(this.myArray[row][right]);
                        this.myArray[row][col].setThisNodeToThisWall(this.myArray[row][right].getName(), "right");
                    }
                    var left = col - 1;
                    if (left < this.myNumColumns && left >= 0 && this.myArray[row][left] != null) {
                        this.myArray[row][col].getNeighbors().add(this.myArray[row][left]);
                        this.myArray[row][col].setThisNodeToThisWall(this.myArray[row][left].getName(), "left");
                    }
                    var bottom = row + 1;
                    if (bottom < this.myNumRows && bottom >= 0 && this.myArray[bottom][col] != null) {
                        this.myArray[row][col].getNeighbors().add(this.myArray[bottom][col]);
                        this.myArray[row][col].setThisNodeToThisWall(this.myArray[bottom][col].getName(), "bottom");
                    }
                    var top_1 = row - 1;
                    if (top_1 < this.myNumRows && top_1 >= 0 && this.myArray[top_1][col] != null) {
                        this.myArray[row][col].getNeighbors().add(this.myArray[top_1][col]);
                        this.myArray[row][col].setThisNodeToThisWall(this.myArray[top_1][col].getName(), "top");
                    }
                }
            }
        };
        /**
         * Returns String representing the graph.
         * @return String of the graph.
         */
        Graph.prototype.toString = function () {
            var graphAsString = new java.lang.StringBuilder();
            var row;
            var col;
            graphAsString.append("[ ");
            for (row = 0; row < this.myNumRows; row++) {
                if (row > 0) {
                    graphAsString.append("<br />");
                }
                for (col = 0; col < this.myNumColumns; col++) {
                    if (this.myArray[row][col] != null) {
                        graphAsString.append(this.myArray[row][col].toStringWithNeighbors());
                    }
                }
            }
            graphAsString.append(" ]<br />");
            return graphAsString.toString();
        };
        /**
         * Returns the graph as a 2d array.
         * @return 2d Node array of the graph.
         */
        Graph.prototype.getGraph = function () {
            return this.myArray;
        };
        /**
         * Returns Map of the graph. With Keys as String and Values as Nodes.
         * @return Map of the graph.
         */
        Graph.prototype.getMap = function () {
            return this.myNodes;
        };
        return Graph;
    }());
    Maze.Graph = Graph;
    Graph["__class"] = "Maze.Graph";
    /**
     * Class that holds information about a wall between nodes. The wall will hold the name of the node it is next to,
     * which for each Node will have the name of the adjacent node as the name of the wall between them. And this
     * wallNode holds information about whether this wallNode has been broken.
     */
    var WallNode = (function () {
        /**
         * Constructor that sets the wall to the given String theName and sets the walls as not broken.
         * @param theName The name of the wall.
         */
        function WallNode(__parent, theName) {
            this.__parent = __parent;
            this.myIsThisWallBroken = false;
            this.myWallName = theName;
            this.myIsThisWallBroken = false;
        }
        /**
         * Returns true if this wall is broken, and false if the wall is not broken.
         * @return True if the wall is broken, false if the wall is not broken.
         */
        WallNode.prototype.isThisWallBroken = function () {
            return this.myIsThisWallBroken;
        };
        /**
         * Breaks this wall.
         */
        WallNode.prototype.breakThisWall = function () {
            this.myIsThisWallBroken = true;
        };
        /**
         * Returns name of the wall.
         * @return Name of wall.
         */
        WallNode.prototype.getNameOfWall = function () {
            return this.myWallName;
        };
        return WallNode;
    }());
    Maze.WallNode = WallNode;
    WallNode["__class"] = "Maze.WallNode";
})(Maze || (Maze = {}));
