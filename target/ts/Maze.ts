/* Generated from Java with JSweet 1.2.0 - http://www.jsweet.org */
import ArrayList = java.util.ArrayList;

import Map = java.util.Map;

import Stack = java.util.Stack;

import List = java.util.List;

import HashMap = java.util.HashMap;

/**
 * This class creates a maze the size of the given width and depth.
 * This class will create the maze, show the steps of creating the maze if the given value depth is true.
 * And will solve the maze.
 */
class Maze {
    static myGeneratedMazeAsAString : string;

    /**
     * Width of the maze.
     */
    private myWidth : number;

    /**
     * Depth of maze.
     */
    private myDepth : number;

    /**
     * Flag for whether to show how the maze is created.
     */
    private myDebug : boolean;

    /**
     * The graph of the maze.
     */
    private myGraph : Maze.Graph;

    /**
     * Constructor that assigns the width and depth to the given values.
     * And calls the methods to create the graph and to create the path and to solve the maze.
     * 
     * @param width The int width of the maze.
     * @param depth The int depth of the maze
     * @param debug The boolean flag deciding whether to debug or not. True means to debug, false not to debug.
     */
    public constructor(width : number, depth : number, debug : boolean) {
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
    getRandomNum(max : number) : number {
        let min : number = 0;
        return (<number>(Math.random() * (max - min) + min)|0);
    }

    /**
     * Returns the String myGeneratedMazeAsAString, which is the generated and solved maze as a string.
     * @return The generated and solved maze as a string.
     */
    public getGeneratedMazeAsString() : string {
        return Maze.myGeneratedMazeAsAString;
    }

    /**
     * Creates spanning tree inside of the maze as well as calling the method to solve the maze.
     * Before calling the spanning tree method and the maze solving method, this method chooses the starting and ending
     * point of the maze.
     */
    createPath() {
        let array : Maze.Node[][] = this.myGraph.getGraph();
        let currentNode : Maze.Node;
        let listOfEdges : ArrayList<Maze.Node> = <any>(new ArrayList<any>());
        for(let row : number = 0; row < this.myWidth; row++) {
            for(let col : number = 0; col < this.myDepth; col++) {
                currentNode = array[row][col];
                if(currentNode.getNeighbors().size() === 3) {
                    listOfEdges.add(currentNode);
                }
            }
        }
        let numberOfEdges : number = listOfEdges.size();
        let randomEdge : number = this.getRandomNum(numberOfEdges);
        let endEdge : number = this.getRandomNum(numberOfEdges);
        while((endEdge === randomEdge)){
            endEdge = this.getRandomNum(numberOfEdges);
        };
        let nodeMap : Map<string, Maze.Node> = this.myGraph.getMap();
        let stack : Stack<Maze.Node> = <any>(new Stack<any>());
        let nameOfNextNode : number;
        nameOfNextNode = randomEdge;
        let endNode : Maze.Node = nodeMap.get("" + endEdge);
        while((!endNode.isThisACornerOrEdge())){
            endEdge = this.getRandomNum(numberOfEdges);
            while((endEdge === randomEdge)){
                endEdge = this.getRandomNum(numberOfEdges);
            };
            endNode = nodeMap.get("" + endEdge);
        };
        currentNode = nodeMap.get("" + nameOfNextNode);
        let difference : number = Math.abs(numberOfEdges - endEdge);
        while((!currentNode.isThisACornerOrEdge() && difference !== numberOfEdges)){
            nameOfNextNode = this.getRandomNum(numberOfEdges);
            while((nameOfNextNode === endEdge)){
                nameOfNextNode = this.getRandomNum(numberOfEdges);
            };
            currentNode = nodeMap.get("" + nameOfNextNode);
            difference = Math.abs(numberOfEdges - endEdge);
        };
        this.createSpanningTree(currentNode, endNode, stack);
        this.solution(currentNode, endNode);
    }

    /**
     * Creates spanning tree inside of maze. Starts at the given startingNode and goes through each node of the maze
     * until there are no more nodes to go through. As it goes through the maze once it reaches the given ending node
     * the program will mark the node to let the rest of the program know that this is where the ending node is.
     * 
     * @param theStartingNode The Node to start creating the maze from, should be one of the edge nodes.
     * @param theEndingNode The Node to mark as the end of the maze, should be one of the edge nodes.
     * @param theStack The stack to add the nodes to.
     */
    createSpanningTree(theStartingNode : Maze.Node, theEndingNode : Maze.Node, theStack : Stack<Maze.Node>) {
        let currentNode : Maze.Node = theStartingNode;
        let nameOfNextNode : number;
        let currentNodeNeighbors : ArrayList<Maze.Node>;
        currentNode.setVisited(true);
        currentNode.setThisAsStartNode();
        while((this.anyUnvisitedNeighborsInMaze())){
            if(this.areThereUnvisitedNeighborsForThisNode(currentNode, "visited")) {
                currentNodeNeighbors = this.getUnvisitedNeighborsForThisNode(currentNode, "visited");
                nameOfNextNode = this.getRandomNum(currentNodeNeighbors.size());
                theStack.push(currentNode);
                currentNode.breakWallAssociatedWithThisNode(currentNodeNeighbors.get(nameOfNextNode).getName());
                currentNodeNeighbors.get(nameOfNextNode).breakWallAssociatedWithThisNode(currentNode.getName());
                currentNode = currentNodeNeighbors.get(nameOfNextNode);
                currentNode.setVisited(true);
                if((currentNode.getName() === theEndingNode.getName())) {
                    currentNode.setThisAsEndNode();
                }
            } else if(!theStack.isEmpty()) {
                currentNode = theStack.pop();
            }
            if(this.myDebug) {
                this.displayWithOrWithoutSolution(true);
            }
        };
    }

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
    areThereUnvisitedNeighborsForThisNode(theNode : Maze.Node, whichMethod : string) : boolean {
        if((whichMethod === "visited")) {
            let thereAreUnvisitedNeighbors : boolean = false;
            for(let i : number = 0; i < theNode.getNeighbors().size(); i++) {
                if(!theNode.getNeighbors().get(i).getVisited()) {
                    thereAreUnvisitedNeighbors = true;
                    break;
                } else thereAreUnvisitedNeighbors = false;
            }
            return thereAreUnvisitedNeighbors;
        } else {
            let thereAreUnvisitedNeighbors : boolean = false;
            let currentNode : Maze.Node;
            for(let i : number = 0; i < theNode.getNeighbors().size(); i++) {
                currentNode = theNode.getNeighbors().get(i);
                if(!currentNode.visitedBySolutionFinder() && theNode.isThisNodeConnectedToThisNode(currentNode)) {
                    thereAreUnvisitedNeighbors = true;
                    break;
                } else thereAreUnvisitedNeighbors = false;
            }
            return thereAreUnvisitedNeighbors;
        }
    }

    /**
     * Looks through the entire maze and checks if any of the nodes have not been visited by the createSpanningTree
     * method. If there are any unvisited nodes this method will return true, if all methods have been visited this
     * method will return false.
     * 
     * @return False if all nodes have been visited, true if there is at least one node that has not been visited.
     */
    anyUnvisitedNeighborsInMaze() : boolean {
        let thereAreUnvisitedNeighbors : boolean = false;
        let array : Maze.Node[][] = this.myGraph.getGraph();
        for(let row : number = 0; row < this.myWidth; row++) {
            for(let col : number = 0; col < this.myDepth; col++) {
                if(!array[row][col].getVisited()) {
                    thereAreUnvisitedNeighbors = true;
                    break;
                }
            }
            if(thereAreUnvisitedNeighbors) break;
        }
        return thereAreUnvisitedNeighbors;
    }

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
    getUnvisitedNeighborsForThisNode(theNode : Maze.Node, whichMethod : string) : ArrayList<Maze.Node> {
        let theList : ArrayList<Maze.Node> = <any>(new ArrayList<any>());
        let currentNode : Maze.Node;
        if((whichMethod === "visited")) {
            for(let i : number = 0; i < theNode.getNeighbors().size(); i++) {
                currentNode = theNode.getNeighbors().get(i);
                if(!currentNode.getVisited()) {
                    theList.add(currentNode);
                }
            }
            return theList;
        } else {
            for(let i : number = 0; i < theNode.getNeighbors().size(); i++) {
                currentNode = theNode.getNeighbors().get(i);
                if(!currentNode.visitedBySolutionFinder() && theNode.isThisNodeConnectedToThisNode(currentNode)) {
                    theList.add(currentNode);
                }
            }
            return theList;
        }
    }

    /**
     * Solves the maze. This method solves the maze by using a depth first search. As it goes through the maze it will
     * mark nodes that are a part of the solution path.
     * 
     * @param theStartingNode The node to start solving the maze from.
     * @param theEndingNode The node that when reached during the solving of the maze will stop the method from going
     * any farther through the maze.
     */
    solution(theStartingNode : Maze.Node, theEndingNode : Maze.Node) {
        let stack : Stack<Maze.Node> = <any>(new Stack<any>());
        let currentNode : Maze.Node = theStartingNode;
        currentNode.setThisNodeAsVisitedBySolutionFinder();
        currentNode.setThisNodeAsPartOfSolution();
        let currentNodeNeighbors : ArrayList<Maze.Node>;
        let nameOfNextNode : number;
        let endNodeFound : boolean = false;
        while((!endNodeFound)){
            if(this.areThereUnvisitedNeighborsForThisNode(currentNode, "solution")) {
                currentNodeNeighbors = this.getUnvisitedNeighborsForThisNode(currentNode, "solution");
                nameOfNextNode = this.getRandomNum(currentNodeNeighbors.size());
                stack.push(currentNode);
                currentNode = currentNodeNeighbors.get(nameOfNextNode);
                currentNode.setThisNodeAsVisitedBySolutionFinder();
                currentNode.setThisNodeAsPartOfSolution();
                if((currentNode.getName() === theEndingNode.getName())) {
                    endNodeFound = true;
                }
            } else if(!stack.isEmpty()) {
                currentNode.setThisNodeAsNoLongerApartOfSolution();
                currentNode = stack.pop();
            }
        };
    }

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
    displayWithOrWithoutSolution(theDebugOrNot : boolean) {
        let array : Maze.Node[][] = this.myGraph.getGraph();
        if(theDebugOrNot) {
            for(let row : number = 0; row < this.myWidth; row++) {
                for(let col : number = 0; col < this.myDepth; col++) {
                    Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "X ";
                    array[row][col].printTopWall();
                    Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "X ";
                }
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "<br />";
                for(let col : number = 0; col < this.myDepth; col++) {
                    array[row][col].printMiddleWalls();
                }
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "<br />";
                for(let col : number = 0; col < this.myDepth; col++) {
                    Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "X ";
                    array[row][col].printBottomWall();
                    Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "X ";
                }
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "<br />";
            }
            Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "<br />";
        } else {
            for(let row : number = 0; row < this.myWidth; row++) {
                for(let col : number = 0; col < this.myDepth; col++) {
                    Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "X ";
                    array[row][col].printTopWall();
                    Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "X ";
                }
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "<br />";
                for(let col : number = 0; col < this.myDepth; col++) {
                    array[row][col].printMiddleWallsForSolution();
                }
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "<br />";
                for(let col : number = 0; col < this.myDepth; col++) {
                    Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "X ";
                    array[row][col].printBottomWall();
                    Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "X ";
                }
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "<br />";
            }
            Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "<br />";
        }
    }

    /**
     * This method calls the displayWithOrWithoutSolution method with false as the given value for the
     * displayWithOrWithoutSolution method, printing out the maze with +'s for nodes in the solution path.
     */
    public display() {
        this.displayWithOrWithoutSolution(false);
    }

    /**
     * Returns String of the maze.
     * @return String of the maze.
     */
    public toString() : string {
        return this.myGraph.toString();
    }
}
Maze["__class"] = "Maze";


namespace Maze {

    export class Node {
        public __parent: any;
        /**
         * Name of the Node.
         */
        myName : string;

        /**
         * List that holds the adjacent nodes to this node.
         */
        myNeighborNodes : List<Maze.Node>;

        /**
         * boolean showing whether this Node has been visited by the createSpanningTree method.
         */
        myVisited : boolean;

        /**
         * WallNodes connected to this node.
         */
        left : Maze.WallNode;

        /**
         * WallNodes connected to this node.
         */
        right : Maze.WallNode;

        /**
         * WallNodes connected to this node.
         */
        top : Maze.WallNode;

        /**
         * WallNodes connected to this node.
         */
        bottom : Maze.WallNode;

        /**
         * boolean showing that this Node is the start or the end node of the maze.
         */
        myIsThisStartNode : boolean;

        /**
         * boolean showing that this Node is the start or the end node of the maze.
         */
        myIsThisEndNode : boolean;

        /**
         * boolean showing this Node wall is broken for the starting or ending node.
         */
        myNodeWallIsBroken : boolean;

        /**
         * boolean showing if this node is a part of the solution path.
         */
        myPartOfSolutionNode : boolean;

        /**
         * boolean showing if this node was visited by the solution method.
         */
        myVisitedBySolution : boolean;

        /**
         * Constructor setting the name of the Node to the given String.
         * @param theName The name of the Node.
         */
        public constructor(__parent: any, theName : string) {
            this.__parent = __parent;
            this.myVisited = false;
            this.myIsThisStartNode = false;
            this.myIsThisEndNode = false;
            this.myNodeWallIsBroken = false;
            this.myPartOfSolutionNode = false;
            this.myVisitedBySolution = false;
            this.myName = theName;
            this.myNeighborNodes = <any>(new ArrayList<any>());
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
        public getNeighbors() : List<Maze.Node> {
            return this.myNeighborNodes;
        }

        /**
         * Returns name of this Node.
         * @return Name of the Node.
         */
        public getName() : string {
            return this.myName;
        }

        /**
         * Sets this Node as visited by the createSpanningTree method.
         * @param theSeenBoolean True to mean it was visited by the createSpanningTree method. False if not visited.
         */
        public setVisited(theSeenBoolean : boolean) {
            this.myVisited = theSeenBoolean;
        }

        /**
         * Returns true if this Node was visited by the createSpanningTree method. False if it was not visited.
         * @return True if visited, false if not.
         */
        public getVisited() : boolean {
            return this.myVisited;
        }

        /**
         * Returns list of all walls that are joining two Nodes.
         * @return List of walls joining two Nodes.
         */
        getListOfWalls() : ArrayList<Maze.WallNode> {
            let list : ArrayList<Maze.WallNode> = <any>(new ArrayList<any>());
            if(this.left != null) {
                list.add(this.left);
            }
            if(this.right != null) {
                list.add(this.right);
            }
            if(this.top != null) {
                list.add(this.top);
            }
            if(this.bottom != null) {
                list.add(this.bottom);
            }
            return list;
        }

        /**
         * Sets the wall between this Node and the given node as broken.
         * @param theWallName The name of the Node to break this wall with.
         */
        public breakWallAssociatedWithThisNode(theWallName : string) {
            let list : ArrayList<Maze.WallNode> = this.getListOfWalls();
            for(let index121=list.iterator();index121.hasNext();) {
                let wallNode = index121.next();
                if((theWallName === wallNode.getNameOfWall())) {
                    wallNode.breakThisWall();
                    break;
                }
            }
        }

        /**
         * Sets this Node to the given wall and on the given side.
         * @param theWallName The wall to this Node to.
         * @param theSide Which side to set this Node on.
         */
        public setThisNodeToThisWall(theWallName : string, theSide : string) {
            if(this.left == null && (theSide === "left")) this.left = new Maze.WallNode(this.__parent, theWallName); else if(this.right == null && (theSide === "right")) this.right = new Maze.WallNode(this.__parent, theWallName); else if(this.top == null && (theSide === "top")) this.top = new Maze.WallNode(this.__parent, theWallName); else if(this.bottom == null && (theSide === "bottom")) this.bottom = new Maze.WallNode(this.__parent, theWallName);
        }

        /**
         * Return true if this Node is connected to the given Node. False if it is not connected.
         * @param theNode The node to check if this node is connected to it.
         * @return True if this node and the given node are connected. False if they are not connected.
         */
        public isThisNodeConnectedToThisNode(theNode : Maze.Node) : boolean {
            let theseNodesAreConnected : boolean = false;
            let list : ArrayList<Maze.WallNode> = this.getListOfWalls();
            for(let index122=list.iterator();index122.hasNext();) {
                let wallNode = index122.next();
                {
                    if((wallNode.getNameOfWall() === theNode.getName()) && wallNode.isThisWallBroken()) {
                        theseNodesAreConnected = true;
                    }
                }
            }
            return theseNodesAreConnected;
        }

        /**
         * Returns string with each node and its adjacent nodes.
         * @return String of node with adjacent nodes.
         */
        public toStringWithNeighbors() : string {
            let nodeAsString : java.lang.StringBuilder = new java.lang.StringBuilder();
            nodeAsString.append("{ ");
            nodeAsString.append("[");
            nodeAsString.append(this.myName);
            nodeAsString.append("] ");
            for(let index123=this.myNeighborNodes.iterator();index123.hasNext();) {
                let myNeighborNode = index123.next();
                {
                    if(myNeighborNode != null) {
                        nodeAsString.append(myNeighborNode.getName());
                        nodeAsString.append(",");
                    }
                }
            }
            nodeAsString.delete(nodeAsString.length() - 1, nodeAsString.length());
            nodeAsString.append(" }");
            return nodeAsString.toString();
        }

        /**
         * Prints top of this node to console.
         */
        public printTopWall() {
            this.myNodeWallIsBroken = false;
            if((this.isThisEndNode() && this.isThisNodeATop() && !this.myNodeWallIsBroken) || (this.isThisTheStartNode() && this.isThisNodeATop() && !this.myNodeWallIsBroken)) {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "  ";
                this.myNodeWallIsBroken = true;
            } else {
                this.printOutThisNode(this.top);
            }
        }

        /**
         * Prints middle of this node to the console.
         */
        public printMiddleWalls() {
            if((this.isThisEndNode() && this.isThisNodeALeft() && !this.myNodeWallIsBroken) || (this.isThisTheStartNode() && this.isThisNodeALeft() && !this.myNodeWallIsBroken)) {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "  ";
                this.myNodeWallIsBroken = true;
            } else {
                this.printOutThisNode(this.left);
            }
            if(this.anyBrokenWalls() && !this.myPartOfSolutionNode) {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "A ";
            } else {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "  ";
            }
            if((this.isThisEndNode() && this.isThisNodeARight() && !this.myNodeWallIsBroken) || (this.isThisTheStartNode() && this.isThisNodeARight() && !this.myNodeWallIsBroken)) {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "  ";
                this.myNodeWallIsBroken = true;
            } else {
                this.printOutThisNode(this.right);
            }
        }

        /**
         * Prints bottom of this node to console.
         */
        public printBottomWall() {
            if((this.isThisEndNode() && this.isThisNodeABottom() && !this.myNodeWallIsBroken) || (this.isThisTheStartNode() && this.isThisNodeABottom() && !this.myNodeWallIsBroken)) {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "  ";
                this.myNodeWallIsBroken = true;
            } else {
                this.printOutThisNode(this.bottom);
            }
        }

        /**
         * Prints middle of this node to console for the maze showing the solution path.
         */
        public printMiddleWallsForSolution() {
            if((this.isThisEndNode() && this.isThisNodeALeft() && !this.myNodeWallIsBroken) || (this.isThisTheStartNode() && this.isThisNodeALeft() && !this.myNodeWallIsBroken)) {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "  ";
                this.myNodeWallIsBroken = true;
            } else {
                this.printOutThisNode(this.left);
            }
            if(this.myPartOfSolutionNode) {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "+ ";
            } else {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "  ";
            }
            if((this.isThisEndNode() && this.isThisNodeARight() && !this.myNodeWallIsBroken) || (this.isThisTheStartNode() && this.isThisNodeARight() && !this.myNodeWallIsBroken)) {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "  ";
                this.myNodeWallIsBroken = true;
            } else {
                this.printOutThisNode(this.right);
            }
        }

        /**
         * Returns true if any of this Nodes wall are broken. False if none of this nodes walls are broken.
         * @return True if walls of this Node are broken, false if none of this nodes walls are broken.
         */
        anyBrokenWalls() : boolean {
            let list : ArrayList<Maze.WallNode> = this.getListOfWalls();
            let thereIsABrokenWall : boolean = false;
            for(let index124=list.iterator();index124.hasNext();) {
                let node = index124.next();
                {
                    if(node.isThisWallBroken()) {
                        thereIsABrokenWall = true;
                        break;
                    }
                }
            }
            return thereIsABrokenWall;
        }

        /**
         * Returns true if this is the start Node, false if not the start node.
         * @return True if this is the start Node, false if not the start node.
         */
        public isThisTheStartNode() : boolean {
            return this.myIsThisStartNode;
        }

        /**
         * Returns true if this is the end node, false if not the end node.
         * @return True if this is the end node, false if not the end node.
         */
        public isThisEndNode() : boolean {
            return this.myIsThisEndNode;
        }

        /**
         * Sets this node to be the start node.
         */
        public setThisAsStartNode() {
            this.myIsThisStartNode = true;
        }

        /**
         * Sets this node to be the end node.
         */
        public setThisAsEndNode() {
            this.myIsThisEndNode = true;
        }

        /**
         * Checks to see if this node is on top of the maze. Returns true if it is, and false if it is not.
         * @return True if node is on top of maze, false if not on top.
         */
        public isThisNodeATop() : boolean {
            let isThisATop : boolean = false;
            if(this.top == null) {
                isThisATop = true;
            }
            return isThisATop;
        }

        /**
         * Returns true if this node is on the right side of the maze, false if it is not.
         * @return True if node is on the right side of maze, false if not on the right side.
         */
        public isThisNodeARight() : boolean {
            let isThisARight : boolean = false;
            if(this.right == null) {
                isThisARight = true;
            }
            return isThisARight;
        }

        /**
         * Returns true if this node is on the left of the maze, false if not on the left.
         * @return True if node is on the left of maze, false if not on the left of maze.
         */
        public isThisNodeALeft() : boolean {
            let isThisALeft : boolean = false;
            if(this.left == null) {
                isThisALeft = true;
            }
            return isThisALeft;
        }

        /**
         * Returns true if this node is on the bottom of the maze, false if not on the bottom.
         * @return True if this node is on the bottom, false if not on the bottom of maze.
         */
        public isThisNodeABottom() : boolean {
            let isThisABottom : boolean = false;
            if(this.bottom == null) {
                isThisABottom = true;
            }
            return isThisABottom;
        }

        /**
         * Returns true if this node is a corner or an edge of the maze, false otherwise.
         * @return True if corner or edge, false if not a corner or edge.
         */
        public isThisACornerOrEdge() : boolean {
            let aCornerOrEdge : boolean = false;
            if(this.bottom == null && this.right == null) {
                aCornerOrEdge = true;
            } else if(this.bottom == null && this.left == null) {
                aCornerOrEdge = true;
            } else if(this.left == null && this.top == null) {
                aCornerOrEdge = true;
            } else if(this.right == null && this.top == null) {
                aCornerOrEdge = true;
            }
            if(this.isThisNodeATop() && !this.isThisNodeABottom() && !this.isThisNodeALeft() && !this.isThisNodeARight()) {
                aCornerOrEdge = true;
            } else if(!this.isThisNodeATop() && this.isThisNodeABottom() && !this.isThisNodeALeft() && !this.isThisNodeARight()) {
                aCornerOrEdge = true;
            } else if(!this.isThisNodeATop() && !this.isThisNodeABottom() && this.isThisNodeALeft() && !this.isThisNodeARight()) {
                aCornerOrEdge = true;
            } else if(!this.isThisNodeATop() && !this.isThisNodeABottom() && !this.isThisNodeALeft() && this.isThisNodeARight()) {
                aCornerOrEdge = true;
            }
            return aCornerOrEdge;
        }

        /**
         * Prints out the given node.
         * @param theNode The node to print out.
         */
        printOutThisNode(theNode : Maze.WallNode) {
            if(theNode != null && theNode.isThisWallBroken()) {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "  ";
            } else {
                Maze.myGeneratedMazeAsAString = Maze.myGeneratedMazeAsAString + "X ";
            }
        }

        /**
         * Sets this node to be a part of the solution path.
         */
        public setThisNodeAsPartOfSolution() {
            this.myPartOfSolutionNode = true;
        }

        /**
         * Removes this node from the solution path.
         */
        public setThisNodeAsNoLongerApartOfSolution() {
            this.myPartOfSolutionNode = false;
        }

        /**
         * Sets this node as visited by the solution method.
         */
        public setThisNodeAsVisitedBySolutionFinder() {
            this.myVisitedBySolution = true;
        }

        /**
         * Returns true if this node was visited by the solution method, false if not visited.
         * @return True if visited by the solution method, false if not visited.
         */
        public visitedBySolutionFinder() : boolean {
            return this.myVisitedBySolution;
        }
    }
    Node["__class"] = "Maze.Node";


    /**
     * The graph class creates a graph of n * m dimensions.
     */
    export class Graph {
        public __parent: any;
        /**
         * Number of rows.
         */
        myNumRows : number;

        /**
         * Number of columns.
         */
        myNumColumns : number;

        /**
         * Map of the nodes in this graph.
         */
        myNodes : Map<string, Maze.Node>;

        /**
         * Array of the nodes in this graph.
         */
        myArray : Maze.Node[][];

        /**
         * Constructor that sets the size of the graph and calls the method to create the graph.
         * @param theNumRows int number of rows of the graph.
         * @param theNumColumns int number of columns of the graph.
         */
        public constructor(__parent: any, theNumRows : number, theNumColumns : number) {
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
        setVariables(theNumRows : number, theNumColumns : number) {
            this.myNumRows = theNumRows;
            this.myNumColumns = theNumColumns;
            this.myNodes = <any>(new HashMap<any, any>());
            this.myArray = <any> (function(dims) { let allocate = function(dims) { if(dims.length==0) { return undefined; } else { let array = []; for(let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims);})([this.myNumRows, this.myNumColumns]);
        }

        /**
         * Creates graph of nodes using a 2d array.
         */
        createGraph() {
            let row : number;
            let col : number;
            let name : number;
            name = 0;
            for(row = 0; row < this.myNumRows; row++) {
                for(col = 0; col < this.myNumColumns; col++) {
                    this.myArray[row][col] = new Maze.Node(this.__parent, "" + (name));
                    name++;
                }
            }
            this.setNeighbors();
            let currentNode : Maze.Node;
            for(row = 0; row < this.myNumRows; row++) {
                for(col = 0; col < this.myNumColumns; col++) {
                    currentNode = this.myArray[row][col];
                    this.myNodes.put(currentNode.getName(), currentNode);
                }
            }
        }

        /**
         * Connects each node with its adjacent nodes.
         */
        setNeighbors() {
            let row : number;
            let col : number;
            for(row = 0; row < this.myNumRows; row++) {
                for(col = 0; col < this.myNumColumns; col++) {
                    let right : number = col + 1;
                    if(right < this.myNumColumns && right >= 0 && this.myArray[row][right] != null) {
                        this.myArray[row][col].getNeighbors().add(this.myArray[row][right]);
                        this.myArray[row][col].setThisNodeToThisWall(this.myArray[row][right].getName(), "right");
                    }
                    let left : number = col - 1;
                    if(left < this.myNumColumns && left >= 0 && this.myArray[row][left] != null) {
                        this.myArray[row][col].getNeighbors().add(this.myArray[row][left]);
                        this.myArray[row][col].setThisNodeToThisWall(this.myArray[row][left].getName(), "left");
                    }
                    let bottom : number = row + 1;
                    if(bottom < this.myNumRows && bottom >= 0 && this.myArray[bottom][col] != null) {
                        this.myArray[row][col].getNeighbors().add(this.myArray[bottom][col]);
                        this.myArray[row][col].setThisNodeToThisWall(this.myArray[bottom][col].getName(), "bottom");
                    }
                    let top : number = row - 1;
                    if(top < this.myNumRows && top >= 0 && this.myArray[top][col] != null) {
                        this.myArray[row][col].getNeighbors().add(this.myArray[top][col]);
                        this.myArray[row][col].setThisNodeToThisWall(this.myArray[top][col].getName(), "top");
                    }
                }
            }
        }

        /**
         * Returns String representing the graph.
         * @return String of the graph.
         */
        public toString() : string {
            let graphAsString : java.lang.StringBuilder = new java.lang.StringBuilder();
            let row : number;
            let col : number;
            graphAsString.append("[ ");
            for(row = 0; row < this.myNumRows; row++) {
                if(row > 0) {
                    graphAsString.append("<br />");
                }
                for(col = 0; col < this.myNumColumns; col++) {
                    if(this.myArray[row][col] != null) {
                        graphAsString.append(this.myArray[row][col].toStringWithNeighbors());
                    }
                }
            }
            graphAsString.append(" ]<br />");
            return graphAsString.toString();
        }

        /**
         * Returns the graph as a 2d array.
         * @return 2d Node array of the graph.
         */
        public getGraph() : Maze.Node[][] {
            return this.myArray;
        }

        /**
         * Returns Map of the graph. With Keys as String and Values as Nodes.
         * @return Map of the graph.
         */
        public getMap() : Map<string, Maze.Node> {
            return this.myNodes;
        }
    }
    Graph["__class"] = "Maze.Graph";


    /**
     * Class that holds information about a wall between nodes. The wall will hold the name of the node it is next to,
     * which for each Node will have the name of the adjacent node as the name of the wall between them. And this
     * wallNode holds information about whether this wallNode has been broken.
     */
    export class WallNode {
        public __parent: any;
        /**
         * Name of wall.
         */
        myWallName : string;

        /**
         * boolean showing whether this wall is broken.
         */
        myIsThisWallBroken : boolean;

        /**
         * Constructor that sets the wall to the given String theName and sets the walls as not broken.
         * @param theName The name of the wall.
         */
        public constructor(__parent: any, theName : string) {
            this.__parent = __parent;
            this.myIsThisWallBroken = false;
            this.myWallName = theName;
            this.myIsThisWallBroken = false;
        }

        /**
         * Returns true if this wall is broken, and false if the wall is not broken.
         * @return True if the wall is broken, false if the wall is not broken.
         */
        public isThisWallBroken() : boolean {
            return this.myIsThisWallBroken;
        }

        /**
         * Breaks this wall.
         */
        public breakThisWall() {
            this.myIsThisWallBroken = true;
        }

        /**
         * Returns name of the wall.
         * @return Name of wall.
         */
        public getNameOfWall() : string {
            return this.myWallName;
        }
    }
    WallNode["__class"] = "Maze.WallNode";

}



