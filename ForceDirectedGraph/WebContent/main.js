color_dict = {
			
			"IAFSE" : "#660066",
			"CLAS": "#006600",
			"GIOS": "#006699",
			"CONHI":"#800000",
			"CHS":"#ffcc00",
			"CISA":"#b2df8a",
			"LAW":"#fdbf6f",
			"ARTS":"#fb9a99",
			"PUBSRV":"#cab2d6",
			"MLFTC":"#a6cee3",
			"EVPP":"#ffff99",
			"WPC": "#b15928",
			
			"OBF":"#8dd3c7",
			"ISTL":"#ffffb3",
			"BDI":"#bebada",
			"SFIS":"#fb8072",
			"HIDA":"#80b1d3",
			"EXEC_ADMIN":"#fdb462",
			"BARRETT":"#b3de69",
			"EOSS":"#fccde5",
			"WCJMC":"#d9d9d9",
			"OKED":"#bc80bd",
			"UCOLLEGE":"#ccebc5",
			"LIB":"#ffed6f",
			
			"GSECURITY":"#bf812d",
			"THUNDERBIRD":"#f6e8c3",
			"PUBLIC_AFFAIRS":"#c7eae5",
			"ONLINE":"#80cdc1",
			"UTO":"#01665e"

		
	}
	
	var nodes = [];
	
	  sigma.classes.graph.addMethod('neighbors', function(nodeId) {
	    var k,
	        neighbors = {},
	        index = this.allNeighborsIndex[nodeId] || {};

	    for (k in index)
	      neighbors[k] = this.nodesIndex[k];

	    return neighbors;
	  });
	
	  sigma.settings.labelThreshold  = 20;

	  sigma.parsers.gexf(
	    'lovely.gexf',
	    {
	      container: 'graph-container'
	    },
	    function(s) {
	    
	      s.graph.nodes().forEach(function(n) {
	    	
	    	n.color = color_dict[n.attributes.group];
	        n.originalColor = n.color;
	        nodes.push(n.label);
	        
	       
	      });
	      
	      s.graph.edges().forEach(function(e) {
	    	e.color = "#dec894";
	        e.originalColor = e.color;
	      });
	      
	      var maxNodeSize = s.settings('maxNodeSize');
	      maxNodeSize = maxNodeSize + 10;
	      s.settings('maxNodeSize', maxNodeSize);
	      s.refresh();
	      complete();
	      
	      function complete(){
	    	  
	    	  $( "#name" ).autocomplete({
	               source: nodes
	            });
	    	  
	    }
	      
	      
	      function displayNeighbors(node){
	    	  
	    	  	var nodeId = node.id;
	            toKeep = s.graph.neighbors(nodeId);
	        toKeep[nodeId] = node;

	        s.graph.nodes().forEach(function(n) {
	          if (toKeep[n.id]){
	        	
	            n.color = n.originalColor;
	          }
	          else
	            n.color = '#eee';
	        });

	        s.graph.edges().forEach(function(e) {
	          if (toKeep[e.source] && toKeep[e.target])
	            e.color = e.originalColor;
	          else
	            e.color = '#eee';
	        });
	        
	     
	        s.refresh(); 
	    	  
	      }
	      
	      s.bind('clickNode', function(e) {
	    	  displayNeighbors(e.data.node);
	      });

	     
	      s.bind('clickStage', function(e) {
	        s.graph.nodes().forEach(function(n) {
	          n.color = n.originalColor;
	        });

	        s.graph.edges().forEach(function(e) {
	          e.color = e.originalColor;
	        });


	        s.refresh();
	      });
	      
	      
	      $("#submit").on("click", function(){
	  		var name = $("input:text").val();
	  		var nodes = s.graph.nodes();
	  		nodes.forEach(function(n){
	  			if(n.label == name){
	  				console.log(n.label);
	  				displayNeighbors(n);
	  				
	  			}
	  			})
	  		
	  		});
	     
	      $('#name').keydown(function(event){ 
	    	    var keyCode = (event.keyCode ? event.keyCode : event.which);   
	    	    if (keyCode == 13) {
	    	        $('#submit').trigger('click');
	    	    }
	    	});
	   
	    }
	  );
	
	  

	
	
	
	
	
	
	
	
	
	
	