Array.prototype.contains = function (elem) {
	for (var i in this) {
		if (this[i] == elem) return true;
	}
	return false;
}

color_dict = {
	"IAFSE": "#660066",
	"CLAS": "#006600",
	"GIOS": "#006699",
	"CONHI": "#800000",
	"CHS": "#ffcc00",
	"CISA": "#b2df8a",
	"LAW": "#fdbf6f",
	"ARTS": "#fb9a99",
	"PUBSRV": "#cab2d6",
	"MLFTC": "#a6cee3",
	"EVPP": "#ffff99",
	"WPC": "#b15928",

	"OBF": "#8dd3c7",
	"ISTL": "#ffffb3",
	"BDI": "#bebada",
	"SFIS": "#fb8072",
	"HIDA": "#80b1d3",
	"EXEC_ADMIN": "#fdb462",
	"BARRETT": "#b3de69",
	"EOSS": "#fccde5",
	"WCJMC": "#d9d9d9",
	"OKED": "#bc80bd",
	"UCOLLEGE": "#ccebc5",
	"LIB": "#ffed6f",

	"GSECURITY": "#bf812d",
	"THUNDERBIRD": "#f6e8c3",
	"PUBLIC_AFFAIRS": "#c7eae5",
	"ONLINE": "#80cdc1",
	"UTO": "#01665e"
}


function complete() {
	$("#name").autocomplete({
		source: nodes
	});
}

function complete_department() {
	$("#name").autocomplete({
		source: departments
	});
}

function displayFacultyConnections(department, s) {
	var nodeId = department;
	toKeep = s.graph.neighbors(nodeId);
	toKeep[nodeId] = department;
	console.log(toKeep);

	s.graph.nodes().forEach(function (n) {
		if (toKeep[n.id])
			n.color = n.originalColor;
		else
			n.color = '#eee';
	});

	s.graph.edges().forEach(function (e) {
		if (toKeep[e.source] && toKeep[e.target])
			e.color = e.originalColor;
		else
			e.color = '#eee';
	});
	s.refresh();
}

function displayNeighbors(node, s) {
	var nodeId = node.id;
	toKeep = s.graph.neighbors(nodeId);
	toKeep[nodeId] = node;

	s.graph.nodes().forEach(function (n) {
		if (toKeep[n.id])
			n.color = n.originalColor;
		else
			n.color = '#eee';
	});

	s.graph.edges().forEach(function (e) {
		if (toKeep[e.source] && toKeep[e.target])
			e.color = e.originalColor;
		else
			e.color = '#eee';
	});
	s.refresh();
}

var nodes = [];				// Reference all nodes in graph.
var departments = [];	// Reference all departments for search queries.
/** 
 * Graph model provides public access to nodes & edges arrays, 
 * but also maintains more indexes accessible only from its methods.
 * Therefore, binding function to event to gain access index of every neighbors for each node.
 * 
 * Add a method to the graph model that returns an
 * object with every neighbors of a node inside.
 */
sigma.classes.graph.addMethod('neighbors', function (nodeId) {
	console.log(this);
	var k,
		neighbors = {},
		index = this.allNeighborsIndex[nodeId] || {};
	console.log(index);
	for (k in index) {
		neighbors[k] = this.nodesIndex[k];
		console.log(k);
	}
	return neighbors;
});

sigma.settings.labelThreshold = 20;



sigma.parsers.gexf(
	'./lovely.gexf',
	{
		container: 'graph-container'
	},
	/**
	 * This function will be executed when the graph is displayed, 
	 * with "s" the related sigma instance.
	 * 
	 * First assign appropriate color based on grouping of node/faculty.
	 * Save this into our nodes array.
	 * @param {Sigma Instance} s 
	 */
	function (s) {	// Iterate each node.
		s.graph.nodes().forEach(function (n) {	// For each node, assign coloring based on group category/

			n.color = color_dict[n.attributes.group];
			n.originalColor = n.color;
			nodes.push(n.label);	// Store into array of nodes.
			// If we haven't added the group to set of attributes.
			if (!departments.contains(n.attributes.group))
				departments.push(n.attributes.group);
		});

		console.log(departments);
		// Set coloring for edge connections.
		s.graph.edges().forEach(function (e) {
			e.color = "#dec894";
			e.originalColor = e.color;
		});
		// Specifying radius/max size of nodes.
		var maxNodeSize = s.settings('maxNodeSize');
		maxNodeSize = maxNodeSize + 10;
		s.settings('maxNodeSize', maxNodeSize);	// Set max node size settings to graph instance.
		// Since the data has been modified, we need to
		// call the refresh method to make the colors
		// update effective.
		s.refresh();
		complete();
		// complete_department();

		s.bind('clickNode', function (e) {
			displayNeighbors(e.data.node, s);
		});

		// When the stage is clicked, we just color each
		// node and edge with its original color.
		s.bind('clickStage', function (e) {
			s.graph.nodes().forEach(function (n) {
				n.color = n.originalColor;
			});
			s.graph.edges().forEach(function (e) {
				e.color = e.originalColor;
			});
			s.refresh();
		});


		$("#submit").on("click", function () {
			var name = $("input:text").val();
			var nodes = s.graph.nodes();
			nodes.forEach(function (n) {
				// Matching search for faculty name
				if (n.label == name) {
					console.log("NODE", n);
					displayNeighbors(n, s);
				}
				// Matching search for faculty department.
				if (n.attributes.group == name) {
					console.log(n.attributes.group);
					displayFacultyConnections(n.attributes.graph, s);
					// displayNeighbors(n, s);
				}
			})
		});

		$('#name').keydown(function (event) {
			var keyCode = (event.keyCode ? event.keyCode : event.which);
			if (keyCode == 13) {
				$('#submit').trigger('click');
			}
		});

	}
);













