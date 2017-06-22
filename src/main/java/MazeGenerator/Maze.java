/*
 * Maze Generator
 * TCSS 342B
 * Teacher: Chris Marriott
 * @author Ameet S Toor ameet2r@uw.edu
 * @version Winter 2016 (3/12/16)
 */

import static def.jquery.Globals.$;

import java.util.ArrayList;
import java.util.Map;
import java.util.Stack;
import java.util.List;
import java.util.HashMap;

/**
 * This class creates a maze the size of the given width and depth.
 * This class will create the maze, show the steps of creating the maze if the given value depth is true.
 * And will solve the maze.
 */
public class Maze
{
    private static String myGeneratedMazeAsAString;
    /**Width of the maze.*/
    private final int myWidth;

    /**Depth of maze.*/
    private final int myDepth;

    /**Flag for whether to show how the maze is created.*/
    private final boolean myDebug;

    /**The graph of the maze.*/
    private Graph myGraph;

    /**
     * Constructor that assigns the width and depth to the given values.
     * And calls the methods to create the graph and to create the path and to solve the maze.
     *
     * @param width The int width of the maze.
     * @param depth The int depth of the maze
     * @param debug The boolean flag deciding whether to debug or not. True means to debug, false not to debug.
     */
    public Maze( int width, int depth, boolean debug )
    //Creates a 2d maze of size n by m and with the debug flag set to true will show th steps of maze creation.
    {
        myGeneratedMazeAsAString = "";
        myWidth = width;
        myDepth = depth;
        myDebug = debug;
        myGraph = new Graph( width, depth );
        createPath();
        display();
    }

//    public static void main(String[] args)
//    {
//        Maze testMaze = new Maze( 5, 5, false);
//        testMaze.display();
//        $("#target").html(myGeneratedMazeAsAString);
//        //document.getElementById("target").innerHTML = myGeneratedMazeAsAString;
//    }

    /**
     * Returns a random number in the range of 0 to the given max integer.
     * Source: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-
     * in-a-specific-range
     * @param max The max integer to include.
     * @return Random number between 0 and the given max integer.
     */
    private int getRandomNum(int max) {
        int min = 0;
        return (int) (Math.random() * (max - min) + min);
    }

    /**
     * Returns the String myGeneratedMazeAsAString, which is the generated and solved maze as a string.
     * @return The generated and solved maze as a string.
     */
    public String getGeneratedMazeAsString() {
        return myGeneratedMazeAsAString;
    }

    /**
     * Creates spanning tree inside of the maze as well as calling the method to solve the maze.
     * Before calling the spanning tree method and the maze solving method, this method chooses the starting and ending
     * point of the maze.
     *
     */
    private void createPath()
    {
        //Get list of all edges.
        final Node array[][] = myGraph.getGraph();
        Node currentNode;
        ArrayList< Node > listOfEdges = new ArrayList<>();
        for ( int row = 0; row < myWidth; row++ )
        {
            for ( int col = 0; col < myDepth; col++ )
            {
                currentNode = array[ row ][ col ];
                if ( currentNode.getNeighbors().size()  == 3 ) //Meaning it is an edge.
                {
                    listOfEdges.add( currentNode );
                }
            }
        }

        //Go through list of edges and decide an entrance and exit edge.
        final int numberOfEdges = listOfEdges.size();

        //Choose a random edge.
        //Random randomNodeChooser = new Random();
        int randomEdge = getRandomNum(numberOfEdges);


        //Choose end node that is not the same as the starting node.
        int endEdge = getRandomNum( numberOfEdges );

        while ( endEdge == randomEdge )
        {
            endEdge = getRandomNum( numberOfEdges );
        }

        //Use array or arrayList or map to implement depth first search.
        //USE MAP
        Map< String, Node > nodeMap = myGraph.getMap();

        //Use stack to hold visited nodes.
        Stack< Node > stack = new Stack<>();


        //Create spanning tree.

        //Had help with depth first maze generation from these websites:
        //www.algosome.com/articles/maze-generation-depth-first.html
        //https://en.wikipedia.org/wiki/Maze_generation_algorithm

        int nameOfNextNode;
        nameOfNextNode = randomEdge;

        Node endNode = nodeMap.get( "" + endEdge );
        while ( !endNode.isThisACornerOrEdge() )
        {
            endEdge = getRandomNum( numberOfEdges );

            while ( endEdge == randomEdge )
            {
                endEdge = getRandomNum( numberOfEdges );
            }
            endNode = nodeMap.get( "" + endEdge );
        }

        //Start at entrance.
        currentNode = nodeMap.get( "" + nameOfNextNode );

        int difference = Math.abs( numberOfEdges - endEdge );

        while ( !currentNode.isThisACornerOrEdge() && difference != numberOfEdges  )
        {
            nameOfNextNode = getRandomNum( numberOfEdges );

            while ( nameOfNextNode == endEdge )
            {
                nameOfNextNode = getRandomNum( numberOfEdges );
            }
            currentNode = nodeMap.get( "" + nameOfNextNode );
            difference = Math.abs( numberOfEdges - endEdge );
        }
        createSpanningTree( currentNode,  endNode, stack );
        solution( currentNode, endNode );
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
    private void createSpanningTree( Node theStartingNode, Node theEndingNode, Stack< Node > theStack ) {
        //Random randomNodeChooser = new Random();
        Node currentNode = theStartingNode;
        int nameOfNextNode;
        ArrayList<Node> currentNodeNeighbors;

        //Mark cell as visited.
        currentNode.setVisited(true);
        //Mark first cell as starting cell.
        currentNode.setThisAsStartNode();

        while ( anyUnvisitedNeighborsInMaze() )
        {
            if ( areThereUnvisitedNeighborsForThisNode( currentNode, "visited" ) ) {

                //Choose neighbor randomly
                currentNodeNeighbors = getUnvisitedNeighborsForThisNode( currentNode, "visited" );
                nameOfNextNode = getRandomNum( currentNodeNeighbors.size() );

                //Push node onto stack.
                theStack.push(currentNode);

                //Remove wall between the current Cell and the chosen cell.
                currentNode.breakWallAssociatedWithThisNode(currentNodeNeighbors.get(nameOfNextNode).getName());

                //Remove wall between chosen cell and current cell.
                currentNodeNeighbors.get( nameOfNextNode ).breakWallAssociatedWithThisNode( currentNode.getName() );

                //Make chosen cell the current cell and mark as visited.
                currentNode = currentNodeNeighbors.get(nameOfNextNode);
                currentNode.setVisited( true );


                //theCurrentNode is the endNode mark as end node.
                if ( currentNode.getName().equals( theEndingNode.getName() ) )
                {
                    currentNode.setThisAsEndNode();
                }

            } else if ( !theStack.isEmpty() ) {
                currentNode = theStack.pop();
            }

            //If debug active show steps
            if ( myDebug )
            {
                displayWithOrWithoutSolution( true );
            }
        }
    }

    /**
     * Looks at the given node's adjacent nodes to see if any of them have been visited by the createSpanningTree
     * method, or the solution method. If there are any nodes which have not been visited by one of these methods
     * depending on which method is being checked this method will return true, false if all adjacent nodes have
     * been visited.
     *
     * @param theNode The Node who's adjacent nodes will be checked.
     * @param whichMethod The String deciding which method to check against, for the createSpanningTree method use
     *                    "visited" for the solution method any other string is okay. I used "solution".
     * @return Returns true if, depending on which method, there are unvisited nodes adjacent to the given node.
     */
    private boolean areThereUnvisitedNeighborsForThisNode( Node theNode, String whichMethod )
    {
        if ( whichMethod.equals( "visited" ) )
        {
            boolean thereAreUnvisitedNeighbors = false;
            for ( int i = 0; i < theNode.getNeighbors().size(); i++ ) {
                if ( !theNode.getNeighbors().get(i).getVisited() )
                //If there is a neighbor that has not been visited.
                {
                    thereAreUnvisitedNeighbors = true;
                    break;
                } else
                    thereAreUnvisitedNeighbors = false;
            }
            return thereAreUnvisitedNeighbors;
        }
        else
        {
            boolean thereAreUnvisitedNeighbors = false;
            Node currentNode;
            for ( int i = 0; i < theNode.getNeighbors().size(); i++ ) {
                currentNode = theNode.getNeighbors().get( i );
                if ( !currentNode.visitedBySolutionFinder() && theNode.isThisNodeConnectedToThisNode( currentNode ) )
                //If there is a neighbor that has not been visited by the solution finder
                // and is connected to theNode by a broken wall
                {
                    thereAreUnvisitedNeighbors = true;
                    break;
                } else
                    thereAreUnvisitedNeighbors = false;
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
    private boolean anyUnvisitedNeighborsInMaze()
    {
        boolean thereAreUnvisitedNeighbors = false;
        final Node array[][] = myGraph.getGraph();
        for ( int row = 0; row < myWidth; row++ )
        {
            for ( int col = 0; col < myDepth; col++ )
            {
                if ( !array[ row ][ col ].getVisited() )
                //If this node has not been visited.
                {
                    thereAreUnvisitedNeighbors = true;
                    break;
                }
            }
            if ( thereAreUnvisitedNeighbors )
                break;
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
     *                    "visited" to check against the creatingSpanningTree method and use any other String to
     *                    check against the solution method.
     * @return Return a list of nodes that, depending on the method, have not been visited.
     */
    private ArrayList< Node > getUnvisitedNeighborsForThisNode( Node theNode, String whichMethod )
    {
        ArrayList< Node > theList = new ArrayList<>();
        Node currentNode;

        if ( whichMethod.equals( "visited" ) )
        {
            for ( int i = 0; i < theNode.getNeighbors().size(); i++ )
            {
                currentNode = theNode.getNeighbors().get( i );
                if ( !currentNode.getVisited() )
                {
                    theList.add( currentNode );
                }
            }
            return theList;
        }
        else
        {
            for ( int i = 0; i < theNode.getNeighbors().size(); i++ )
            {
                currentNode = theNode.getNeighbors().get( i );
                if ( !currentNode.visitedBySolutionFinder() && theNode.isThisNodeConnectedToThisNode( currentNode ) )
                {
                    theList.add( currentNode );
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
     *                      any farther through the maze.
     */
    private void solution( Node theStartingNode, Node theEndingNode )
    {
        //Got idea for using depth first from this website:
        //https://en.wikipedia.org/wiki/Maze_solving_algorithm

        //Do depth first search.
        //Add nodes to stack as you go,
        //When back tracking remove nodes.
        //Stop looking once node that matches theEndingNode.
        //Mark each of these nodes as part of solution.

        Stack < Node > stack = new Stack<>();
        Node currentNode = theStartingNode;
        currentNode.setThisNodeAsVisitedBySolutionFinder();
        currentNode.setThisNodeAsPartOfSolution();

        ArrayList<Node> currentNodeNeighbors;
        int nameOfNextNode;
        //Random randomNodeChooser = new Random();

        boolean endNodeFound = false;
        while ( !endNodeFound )
        {
            if ( areThereUnvisitedNeighborsForThisNode( currentNode, "solution" ) ) {

                //Choose neighbor randomly
                currentNodeNeighbors = getUnvisitedNeighborsForThisNode( currentNode, "solution" );
                nameOfNextNode = getRandomNum( currentNodeNeighbors.size() );

                //Push node onto stack.
                stack.push(currentNode);

                //Make chosen cell the current cell and mark as visited.
                currentNode = currentNodeNeighbors.get(nameOfNextNode);
                currentNode.setThisNodeAsVisitedBySolutionFinder();
                currentNode.setThisNodeAsPartOfSolution();

                //theCurrentNode is the endNode mark as end node.
                if ( currentNode.getName().equals( theEndingNode.getName() ) )
                {
                    endNodeFound = true;
                }

            } else if ( !stack.isEmpty() ) {
                currentNode.setThisNodeAsNoLongerApartOfSolution();
                currentNode = stack.pop();
            }
        }
    }

    /**
     * Prints out the maze. If the given boolean is true this method will print out the maze with the nodes that were
     * visisted by the createSpanningTree method with an A. If the given boolean is false this method will print out the
     * maze with the nodes that were marked as part of the solution by the solution method with a plus.
     *
     * @param theDebugOrNot The boolean deciding whether or not to show the maze with the nodes that have been visited
     *                      by the createSpanningTree method as A's or as +'s with the node that has been visited by the
     *                      solution method. True will show the nodes as A's, false will show
     *                      the maze with +'s for the nodes that are a part of the solution path.
     */
    private void displayWithOrWithoutSolution( boolean theDebugOrNot )
    {
        Node array[][] = myGraph.getGraph();

        if ( theDebugOrNot )
        {
            for ( int row = 0; row < myWidth; row++ )
            {
                for ( int col = 0; col < myDepth; col++ )
                {
                    //Print tops of all nodes on this row.
                    //System.out.print( "X " );
                    myGeneratedMazeAsAString = myGeneratedMazeAsAString + "X ";
                    array[ row ][ col ].printTopWall();
                    //System.out.print( "X " );
                    myGeneratedMazeAsAString = myGeneratedMazeAsAString + "X ";
                }
                //System.out.print( "<br />" );
                myGeneratedMazeAsAString = myGeneratedMazeAsAString + "<br />";

                for ( int col = 0; col < myDepth; col++ )
                {
                    //Then print middles of all nodes on this row.
                    array[ row ][ col ].printMiddleWalls();
                }
                //System.out.print( "<br />" );
                myGeneratedMazeAsAString = myGeneratedMazeAsAString + "<br />";
                for ( int col = 0; col < myDepth; col++ )
                {
                    //Then print bottoms of all nodes on this row.
                    //System.out.print( "X " );
                    myGeneratedMazeAsAString = myGeneratedMazeAsAString + "X ";
                    array[ row ][ col ].printBottomWall();
                    //System.out.print( "X " );
                    myGeneratedMazeAsAString = myGeneratedMazeAsAString + "X ";
                }
                //System.out.print( "\n" );
                myGeneratedMazeAsAString = myGeneratedMazeAsAString + "<br />";
            }
            //System.out.println();
            myGeneratedMazeAsAString = myGeneratedMazeAsAString + "<br />";
        }
        else
        {
            for ( int row = 0; row < myWidth; row++ )
            {
                for ( int col = 0; col < myDepth; col++ )
                {
                    //Print tops of all nodes on this row.
                    //System.out.print( "X " );
                    myGeneratedMazeAsAString = myGeneratedMazeAsAString + "X ";
                    array[ row ][ col ].printTopWall();
                    //System.out.print( "X " );
                    myGeneratedMazeAsAString = myGeneratedMazeAsAString + "X ";
                }
                //System.out.print( "<br>" );
                myGeneratedMazeAsAString = myGeneratedMazeAsAString + "<br />";

                for ( int col = 0; col < myDepth; col++ )
                {
                    //Then print middles of all nodes on this row.
                    array[ row ][ col ].printMiddleWallsForSolution();
                }
                //System.out.print( "<br>" );
                myGeneratedMazeAsAString = myGeneratedMazeAsAString + "<br />";
                for ( int col = 0; col < myDepth; col++ )
                {
                    //Then print bottoms of all nodes on this row.
                    //System.out.print( "X " );
                    myGeneratedMazeAsAString = myGeneratedMazeAsAString + "X ";
                    array[ row ][ col ].printBottomWall();
                    //System.out.print( "X " );
                    myGeneratedMazeAsAString = myGeneratedMazeAsAString + "X ";
                }
                //System.out.print( "<br>" );
                myGeneratedMazeAsAString = myGeneratedMazeAsAString + "<br />";
            }
            //System.out.println();
            myGeneratedMazeAsAString = myGeneratedMazeAsAString + "<br />";

        }

    }

    /**
     * This method calls the displayWithOrWithoutSolution method with false as the given value for the
     * displayWithOrWithoutSolution method, printing out the maze with +'s for nodes in the solution path.
     */
    public void display()
    {
        displayWithOrWithoutSolution( false );

    }


    public class Node    //Help creating graph node from linkedGraph code given in class files.
    {
        /**Name of the Node.*/
        private String myName;

        /**List that holds the adjacent nodes to this node.*/
        private List< Node > myNeighborNodes;

        /**boolean showing whether this Node has been visited by the createSpanningTree method.*/
        private boolean myVisited;

        /**WallNodes connected to this node.*/
        private WallNode left, right, top, bottom;

        /**boolean showing that this Node is the start or the end node of the maze.*/
        private boolean myIsThisStartNode, myIsThisEndNode;

        /**boolean showing this Node wall is broken for the starting or ending node.*/
        private boolean myNodeWallIsBroken;

        /**boolean showing if this node is a part of the solution path.*/
        private boolean myPartOfSolutionNode;

        /**boolean showing if this node was visited by the solution method.*/
        private boolean myVisitedBySolution;

        /**
         * Constructor setting the name of the Node to the given String.
         * @param theName The name of the Node.
         */
        public Node (final String theName )
        {
            myName = theName;
            myNeighborNodes = new ArrayList<>();
            myVisited = false;
            left = null;
            right = null;
            top = null;
            bottom = null;
            myIsThisEndNode = false;
            myIsThisStartNode = false;
            myNodeWallIsBroken = false;
            myPartOfSolutionNode = false;
            myVisitedBySolution = false;
        }

        /**
         * Returns list of neighbors of the Node.
         * @return List of adjacent nodes.
         */
        public List < Node > getNeighbors ()
        {
            return myNeighborNodes;
        }

        /**
         * Returns name of this Node.
         * @return Name of the Node.
         */
        public String getName ()
        {
            return myName;
        }

        /**
         * Sets this Node as visited by the createSpanningTree method.
         * @param theSeenBoolean True to mean it was visited by the createSpanningTree method. False if not visited.
         */
        public void setVisited ( boolean theSeenBoolean )
        {
            myVisited = theSeenBoolean;
        }

        /**
         * Returns true if this Node was visited by the createSpanningTree method. False if it was not visited.
         * @return True if visited, false if not.
         */
        public boolean getVisited ()
        {
            return myVisited;
        }

        /**
         * Returns list of all walls that are joining two Nodes.
         * @return List of walls joining two Nodes.
         */
        private ArrayList< WallNode > getListOfWalls()
        {
            ArrayList< WallNode > list = new ArrayList<>();

            if ( left != null )
            {
                list.add( left );
            }
            if ( right != null )
            {
                list.add( right );
            }
            if ( top != null )
            {
                list.add( top );
            }
            if ( bottom != null )
            {
                list.add( bottom );
            }
            return list;
        }

        /**
         * Sets the wall between this Node and the given node as broken.
         * @param theWallName The name of the Node to break this wall with.
         */
        public void breakWallAssociatedWithThisNode( String theWallName )
        {
            ArrayList< WallNode > list = getListOfWalls();
            for ( WallNode wallNode : list )
                if ( theWallName.equals( wallNode.getNameOfWall() ) ) {
                    //If names are the same break this wall.
                    wallNode.breakThisWall();
                    break;
                }
        }

        /**
         * Sets this Node to the given wall and on the given side.
         * @param theWallName The wall to this Node to.
         * @param theSide Which side to set this Node on.
         */
        public void setThisNodeToThisWall( String theWallName, String theSide )
        {
            //Create wall between this node and the given node.
            //The correct wall should point at the given node.
            if ( left == null && theSide.equals( "left" ) )
                left = new WallNode( theWallName );
            else if ( right == null && theSide.equals( "right" ) )
                right = new WallNode( theWallName );
            else if ( top == null && theSide.equals( "top" ) )
                top  = new WallNode( theWallName );
            else if ( bottom == null && theSide.equals( "bottom" ) )
                bottom = new WallNode( theWallName );
        }

        /**
         * Return true if this Node is connected to the given Node. False if it is not connected.
         * @param theNode The node to check if this node is connected to it.
         * @return True if this node and the given node are connected. False if they are not connected.
         */
        public boolean isThisNodeConnectedToThisNode( Node theNode )
        {
            boolean theseNodesAreConnected = false;
            ArrayList< WallNode > list = getListOfWalls();
            for ( WallNode wallNode : list )
            {
                if ( wallNode.getNameOfWall().equals( theNode.getName() ) && wallNode.isThisWallBroken() )
                {
                    theseNodesAreConnected = true;
                }
            }
            return theseNodesAreConnected;
        }

        /**
         * Returns string with each node and its adjacent nodes.
         * @return String of node with adjacent nodes.
         */
        public String toStringWithNeighbors()
        {
            //Print out node name and neighbors.

            StringBuilder nodeAsString = new StringBuilder();

            nodeAsString.append( "{ " );
            nodeAsString.append( "[" );
            nodeAsString.append( myName );
            nodeAsString.append( "] " );


            for ( Node myNeighborNode : myNeighborNodes ) {
                if (myNeighborNode != null) {
                    nodeAsString.append(myNeighborNode.getName());
                    nodeAsString.append(",");
                }
            }

            nodeAsString.delete( nodeAsString.length() - 1, nodeAsString.length() );

            nodeAsString.append( " }" );

            return nodeAsString.toString();
        }

        /**
         * Prints top of this node to console.
         */
        public void printTopWall()
        {
            myNodeWallIsBroken = false;
            if ( ( isThisEndNode() && isThisNodeATop() && !myNodeWallIsBroken ) || ( isThisTheStartNode() && isThisNodeATop() && !myNodeWallIsBroken ) )
            {
                //System.out.print( "  " );
                myGeneratedMazeAsAString = myGeneratedMazeAsAString + "  ";
                myNodeWallIsBroken = true;
            }
            else
            {
                printOutThisNode( top );
            }
        }

        /**
         * Prints middle of this node to the console.
         */
        public void printMiddleWalls()
        {
            if ( ( isThisEndNode() && isThisNodeALeft() && !myNodeWallIsBroken )
                    || ( isThisTheStartNode() && isThisNodeALeft() && !myNodeWallIsBroken ) )
            {
                //System.out.print( "  " );
                myGeneratedMazeAsAString = myGeneratedMazeAsAString + "  ";
                myNodeWallIsBroken = true;
            }
            else
            {
                printOutThisNode( left );
            }

            if ( anyBrokenWalls() && !myPartOfSolutionNode )
            {
                //System.out.print( "A " );
                myGeneratedMazeAsAString = myGeneratedMazeAsAString + "A ";
            }
            else
            {
                //System.out.print( "  " );
                myGeneratedMazeAsAString = myGeneratedMazeAsAString + "  ";
            }

            if ( ( isThisEndNode() && isThisNodeARight() && !myNodeWallIsBroken )
                    || ( isThisTheStartNode() && isThisNodeARight() && !myNodeWallIsBroken ) )
            {
                //System.out.print( "  " );
                myGeneratedMazeAsAString = myGeneratedMazeAsAString + "  ";
                myNodeWallIsBroken = true;
            }
            else
            {
                printOutThisNode( right );
            }
        }

        /**
         * Prints bottom of this node to console.
         */
        public void printBottomWall()
        {
            if ( ( isThisEndNode() && isThisNodeABottom() && !myNodeWallIsBroken ) || ( isThisTheStartNode() && isThisNodeABottom() && !myNodeWallIsBroken ) )
            {
                //System.out.print( "  " );
                myGeneratedMazeAsAString = myGeneratedMazeAsAString + "  ";
                myNodeWallIsBroken = true;
            }
            else
            {
                printOutThisNode( bottom );
            }
        }

        /**
         * Prints middle of this node to console for the maze showing the solution path.
         */
        public void printMiddleWallsForSolution()
        {
            if ( ( isThisEndNode() && isThisNodeALeft() && !myNodeWallIsBroken )
                    || ( isThisTheStartNode() && isThisNodeALeft() && !myNodeWallIsBroken ) )
            {
                //System.out.print( "  " );
                myGeneratedMazeAsAString = myGeneratedMazeAsAString + "  ";
                myNodeWallIsBroken = true;
            }
            else
            {
                printOutThisNode( left );
            }

            if ( myPartOfSolutionNode )
            {
                //System.out.print( "+ " );
                myGeneratedMazeAsAString = myGeneratedMazeAsAString + "+ ";
            }
            else
            {
                //System.out.print( "  " );
                myGeneratedMazeAsAString = myGeneratedMazeAsAString + "  ";
            }

            if ( ( isThisEndNode() && isThisNodeARight() && !myNodeWallIsBroken )
                    || ( isThisTheStartNode() && isThisNodeARight() && !myNodeWallIsBroken ) )
            {
                //System.out.print( "  " );
                myGeneratedMazeAsAString = myGeneratedMazeAsAString + "  ";
                myNodeWallIsBroken = true;
            }
            else
            {
                printOutThisNode( right );
            }
        }

        /**
         * Returns true if any of this Nodes wall are broken. False if none of this nodes walls are broken.
         * @return True if walls of this Node are broken, false if none of this nodes walls are broken.
         */
        private boolean anyBrokenWalls()
        {
            ArrayList< WallNode > list = getListOfWalls();
            boolean thereIsABrokenWall = false;

            for ( WallNode node : list )
            {
                if ( node.isThisWallBroken() )
                {
                    thereIsABrokenWall = true;
                    break;
                }
            }
            return thereIsABrokenWall;
        }

        /**
         * Returns true if this is the start Node, false if not the start node.
         * @return True if this is the start Node, false if not the start node.
         */
        public boolean isThisTheStartNode()
        {
            return myIsThisStartNode;
        }

        /**
         * Returns true if this is the end node, false if not the end node.
         * @return True if this is the end node, false if not the end node.
         */
        public boolean isThisEndNode()
        {
            return myIsThisEndNode;
        }

        /**
         * Sets this node to be the start node.
         */
        public void setThisAsStartNode()
        {
            myIsThisStartNode = true;
        }

        /**
         * Sets this node to be the end node.
         */
        public void setThisAsEndNode()
        {
            myIsThisEndNode = true;
        }

        /**
         * Checks to see if this node is on top of the maze. Returns true if it is, and false if it is not.
         * @return True if node is on top of maze, false if not on top.
         */
        public boolean isThisNodeATop()
        {
            boolean isThisATop = false;
            if ( top == null )
            {
                isThisATop = true;
            }
            return isThisATop;
        }

        /**
         * Returns true if this node is on the right side of the maze, false if it is not.
         * @return True if node is on the right side of maze, false if not on the right side.
         */
        public boolean isThisNodeARight()
        {
            boolean isThisARight = false;
            if ( right == null )
            {
                isThisARight = true;
            }
            return isThisARight;
        }

        /**
         * Returns true if this node is on the left of the maze, false if not on the left.
         * @return True if node is on the left of maze, false if not on the left of maze.
         */
        public boolean isThisNodeALeft()
        {
            boolean isThisALeft = false;
            if ( left == null )
            {
                isThisALeft = true;
            }
            return isThisALeft;
        }

        /**
         * Returns true if this node is on the bottom of the maze, false if not on the bottom.
         * @return True if this node is on the bottom, false if not on the bottom of maze.
         */
        public boolean isThisNodeABottom()
        {
            boolean isThisABottom = false;
            if ( bottom == null )
            {
                isThisABottom = true;
            }
            return isThisABottom;
        }

        /**
         * Returns true if this node is a corner or an edge of the maze, false otherwise.
         * @return True if corner or edge, false if not a corner or edge.
         */
        public boolean isThisACornerOrEdge()
        {
            boolean aCornerOrEdge = false;
            //If corner
            if ( bottom == null && right == null )
            {
                aCornerOrEdge = true;
            }
            else if ( bottom == null && left == null )
            {
                aCornerOrEdge = true;
            }
            else if ( left == null && top == null )
            {
                aCornerOrEdge = true;
            }
            else if ( right == null && top == null )
            {
                aCornerOrEdge = true;
            }

            //If edge
            if ( isThisNodeATop() && !isThisNodeABottom() && !isThisNodeALeft() && !isThisNodeARight() )
            {
                aCornerOrEdge = true;
            }
            else if ( !isThisNodeATop() && isThisNodeABottom() && !isThisNodeALeft() && !isThisNodeARight() )
            {
                aCornerOrEdge = true;
            }
            else if ( !isThisNodeATop() && !isThisNodeABottom() && isThisNodeALeft() && !isThisNodeARight() )
            {
                aCornerOrEdge = true;
            }
            else if ( !isThisNodeATop() && !isThisNodeABottom() && !isThisNodeALeft() && isThisNodeARight() )
            {
                aCornerOrEdge = true;
            }
            return aCornerOrEdge;
        }

        /**
         * Prints out the given node.
         * @param theNode The node to print out.
         */
        private void printOutThisNode( WallNode theNode )
        {
            if ( theNode != null && theNode.isThisWallBroken() )
            //If wall is broken and not null.
            {
                //System.out.print( "  " );
                myGeneratedMazeAsAString = myGeneratedMazeAsAString + "  ";
            }
            else
            //If wall is not broken or node is null.
            {
                //System.out.print( "X " );
                myGeneratedMazeAsAString = myGeneratedMazeAsAString + "X ";
            }
        }

        /**
         * Sets this node to be a part of the solution path.
         */
        public void setThisNodeAsPartOfSolution()
        {
            myPartOfSolutionNode = true;
        }

        /**
         * Removes this node from the solution path.
         */
        public void setThisNodeAsNoLongerApartOfSolution()
        {
            myPartOfSolutionNode = false;
        }

        /**
         * Sets this node as visited by the solution method.
         */
        public void setThisNodeAsVisitedBySolutionFinder()
        {
            myVisitedBySolution = true;
        }

        /**
         * Returns true if this node was visited by the solution method, false if not visited.
         * @return True if visited by the solution method, false if not visited.
         */
        public boolean visitedBySolutionFinder()
        {
            return myVisitedBySolution;
        }
    }


    /**
     * The graph class creates a graph of n * m dimensions.
     */
    public class Graph // Got help on the graph from the linkedGraph and MatrixGraph code given in class files.
    {
        /**
         * Number of rows.
         */
        private int myNumRows;

        /**
         * Number of columns.
         */
        private int myNumColumns;

        /**
         * Map of the nodes in this graph.
         */
        private Map< String, Node > myNodes;

        /**
         * Array of the nodes in this graph.
         */
        private Node[][] myArray;

        /**
         * Constructor that sets the size of the graph and calls the method to create the graph.
         * @param theNumRows int number of rows of the graph.
         * @param theNumColumns int number of columns of the graph.
         */
        public Graph( int theNumRows, int theNumColumns )
        {
            setVariables( theNumRows, theNumColumns );
            createGraph();
        }

        /**
         * Sets the starting values for the fields of this method.
         * @param theNumRows int number of rows of the graph.
         * @param theNumColumns int number of columns of the graph.
         */
        private void setVariables( final int theNumRows, final int theNumColumns )
        {
            myNumRows = theNumRows;
            myNumColumns = theNumColumns;
            myNodes = new HashMap<>();
            myArray = new Node[ myNumRows ][ myNumColumns ];
        }

        /**
         * Creates graph of nodes using a 2d array.
         */
        private void createGraph()
        {
            //Create nodes.
            int row, col, name;
            name = 0;
            for ( row = 0; row < myNumRows; row++ )
            {
                for ( col = 0; col < myNumColumns; col++ )
                {
                    myArray[ row ][ col ] = new Node( "" + ( name ) );
                    name++;
                }
            }

            setNeighbors();

            //Add all elements of array to a map.
            Node currentNode;
            for ( row = 0; row < myNumRows; row++ )
            {
                for ( col = 0; col < myNumColumns; col++ )
                {
                    currentNode = myArray[ row ][ col ];
                    myNodes.put( currentNode.getName(), currentNode );
                }
            }
        }

        /**
         * Connects each node with its adjacent nodes.
         */
        private void setNeighbors()
        {

            int row, col;
            for ( row = 0; row < myNumRows; row++ )
            {
                for ( col = 0; col < myNumColumns; col++ )
                {
                    //If the neighbor we are looking at is not null and is within the range of the array.
                    // Add as a neighbor.

                    //Try to add four neighbors.

                    //Right
                    int right = col + 1;
                    if ( right < myNumColumns && right >= 0 && myArray[ row ][ right ] != null )
                    {
                        myArray[ row ][ col ].getNeighbors().add( myArray [ row ][ right ] );
                        myArray[ row ][ col ].setThisNodeToThisWall( myArray[ row ][ right ].getName(), "right" );
                    }

                    //Left
                    int left = col - 1;
                    if ( left < myNumColumns && left >= 0 && myArray[ row ][ left ] != null )
                    {
                        myArray[ row ][ col ].getNeighbors().add( myArray [ row ][ left ] );
                        myArray[ row ][ col ].setThisNodeToThisWall( myArray[ row ][ left ].getName(), "left" );
                    }

                    //Bottom
                    int bottom = row + 1;
                    if ( bottom < myNumRows && bottom >= 0 && myArray[ bottom ][ col ] != null )
                    {
                        myArray[ row ][ col ].getNeighbors().add( myArray [ bottom ][ col ] );
                        myArray[ row ][ col ].setThisNodeToThisWall( myArray[ bottom ][ col ].getName(), "bottom" );
                    }

                    //Top
                    int top = row - 1;
                    if ( top < myNumRows && top >= 0 && myArray[ top ][ col ] != null )
                    {
                        myArray[ row ][ col ].getNeighbors().add( myArray [ top ][ col ] );
                        myArray[ row ][ col ].setThisNodeToThisWall( myArray[ top ][ col ].getName(), "top" );
                    }
                }

            }
        }

        /**
         * Returns String representing the graph.
         * @return String of the graph.
         */
        public String toString()
        {
            StringBuilder graphAsString = new StringBuilder();

            int row, col;

            graphAsString.append( "[ " );

            for ( row = 0; row < myNumRows; row++ )
            {
                if ( row > 0 )
                {
                    graphAsString.append( "<br />" );
                }
                for ( col = 0; col < myNumColumns; col++ )
                {
                    if ( myArray[ row ][ col ] != null )
                    {
                        graphAsString.append( myArray[ row ][ col ].toStringWithNeighbors() );

                    }
                }

            }

            graphAsString.append( " ]<br />" );

            return graphAsString.toString();
        }

        /**
         * Returns the graph as a 2d array.
         * @return 2d Node array of the graph.
         */
        public Node[][] getGraph()
        {
            return myArray;
        }

        /**
         * Returns Map of the graph. With Keys as String and Values as Nodes.
         * @return Map of the graph.
         */
        public Map < String, Node > getMap()
        {
            return myNodes;
        }
    }

    /**
     * Class that holds information about a wall between nodes. The wall will hold the name of the node it is next to,
     * which for each Node will have the name of the adjacent node as the name of the wall between them. And this
     * wallNode holds information about whether this wallNode has been broken.
     */
    public class WallNode
    {
        /**Name of wall.*/
        private String myWallName; //Wall name will be same as node that it is against.

        /**boolean showing whether this wall is broken.*/
        private boolean myIsThisWallBroken;

        /**
         * Constructor that sets the wall to the given String theName and sets the walls as not broken.
         * @param theName The name of the wall.
         */
        public WallNode( String theName )
        {
            myWallName = theName;
            myIsThisWallBroken = false;
        }

        /**
         * Returns true if this wall is broken, and false if the wall is not broken.
         * @return True if the wall is broken, false if the wall is not broken.
         */
        public boolean isThisWallBroken()
        {
            return myIsThisWallBroken;
        }

        /**Breaks this wall.*/
        public void breakThisWall()
        {
            myIsThisWallBroken = true;
        }

        /**
         * Returns name of the wall.
         * @return Name of wall.
         */
        public String getNameOfWall()
        {
            return myWallName;
        }
    }




    /**
     * Returns String of the maze.
     * @return String of the maze.
     */
    public String toString()
    {
        return myGraph.toString();
    }

}
