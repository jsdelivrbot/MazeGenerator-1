<p>
Please input the width and height for the maze you want created and solved:
</p>

<!--Grab maze width and height from user-->
Width: <input type="text" name="width" value="5" id="width">
<br>
Height: <input type="text" name="height" value="5" id="height">
<br>
<br>
<input id="submitButton" type="submit" value="Submit" onclick="createMaze()">
<br>
<br>
<pre id="target"></pre>

<p>
This was created using the JSweet Transpiler.
</p>

<script type="text/javascript" src="/target/js/Maze.js"></script>
<script>
	function createMaze() {
        	var width = parseInt(document.getElementById("width").value);
        	var height = parseInt(document.getElementById("height").value);
        	var maze = new Maze(width, height, false);
       	 	var mazeAsString = maze.getGeneratedMazeAsString();
        	document.getElementById("target").innerHTML = mazeAsString;
	}
</script>


