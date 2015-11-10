"use strict"
var i,
    sigmaInstance,
    o,
    g = {
      nodes: [],
      edges: []
    },
    L = 10,
    step = 0,
    topic = 'my topic',
    kws = [
      {keyword: 'dolor', phrases: ['Lorem ipsum','sit amet']},
      {keyword: 'sed', phrases: ['consectetur adipiscing elit,', 'do eiusmod','tempor incididunt']},
      {keyword: 'minim',phrases: ['Ut enim ad','veniam, quis nostrud exercitation']},
      {keyword: 'reprehenderit', phrases: ['Duis aute irure dolor in', 'in voluptate velit esse']},
      {keyword: 'fugiat', phrases: ['cillum dolore eu', 'nulla pariatur']},
      {keyword: 'natus', phrases: ['Sed ut perspiciatis unde omnis iste', 'error']},
      {keyword: 'voluptatem', phrases: ['Nemo enim', 'ipsam', 'quia voluptas', 'sit aspernatur',  'aut odit']},
      {keyword: 'exercitationem', phrases: ['quis nostrum', 'ullam corporis']},
      {keyword: 'commodi', phrases: ['nisi ut aliquid ex ea', 'consequatur?']},
      {keyword: 'quam', phrases: ['velit esse', 'nihil molestiae consequatur']}
      ],
   kw_size = 0.9,
   nodeHighlightColor = '#FF0000'
      

// Generate a random graph:

g.nodes.push({
  id: 'topicNode',
  label: topic,
  x: 0,
  y: 4,
  circular_x: 0.5,
  circular_y: 0.5,
  grid_x: 0,
  grid_y: 4,
  original_grid_x: 0,
  original_grid_y: 0,
  size: 1,
  circular_size: 1,
  grid_size: 1,
  color: '#888',
  circular_color: '#888',
  grid_color: '#888',
  selected: true,
  type: 'goo'
});


for (i = 0; i < kws.length; i++) {
  o = {
    id: 'kw_' + i,
    label: kws[i].keyword,
    keyword: kws[i].keyword,
    phrases: kws[i].phrases,
    circular_x: L * Math.cos(Math.PI * 2 * i / kws.length - Math.PI / 2),
    circular_y: L * Math.sin(Math.PI * 2 * i / kws.length - Math.PI / 2),
    circular_size: kw_size,
    circular_color: '#8A1264',
    grid_x: 2,
    original_grid_x: 2,
    grid_y: i,
    grid_size: kw_size,
    grid_color: '#ccc',
    selected: false,
    type: 'goo'
  };
  
  ['x', 'y', 'size', 'color'].forEach(function(val) {
    o[val] = o['grid_' + val];
  });
  
  console.log(o);
  g.nodes.push(o);
}


for (i = 0; i < kws.length; i++)
  g.edges.push({
    id: 'edge_' + i,
    source: 'topicNode',
    target: 'kw_' + i,
    size: 0.8,
    color: '#ccc',
    type: 'goo'
  });


 /**
   * CUSTOM RENDERERS:
   * *****************
   */
  sigma.canvas.edges.goo = function(e, s, t, ctx, settings) {
    var color = e.color,
        p = settings('prefix') || '',
        edgeColor = settings('edgeColor'),
        defaultNodeColor = settings('defaultNodeColor'),
        defaultEdgeColor = settings('defaultEdgeColor'),
        v,
        d,
        p1 = 5 / 6,
        p2 = 1 / 6;

    if (!color)
      switch (edgeColor) {
        case 'source':
          color = s.color || defaultNodeColor;
          break;
        case 'target':
          color = t.color || defaultNodeColor;
          break;
        default:
          color = defaultEdgeColor;
          break;
      }

    d = Math.sqrt(Math.pow(t[p + 'x'] - s[p + 'x'], 2) + Math.pow(t[p + 'y'] - s[p + 'y'], 2));
    v = {
      x: (t[p + 'x'] - s[p + 'x']) / d,
      y: (t[p + 'y'] - s[p + 'y']) / d
    };

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(
      s[p + 'x'] + v.y * s[p + 'size'],
      s[p + 'y'] - v.x * s[p + 'size']
    );
    ctx.bezierCurveTo(
      s[p + 'x'] * p1 + t[p + 'x'] * p2 + v.y * e[p + 'size'],
      s[p + 'y'] * p1 + t[p + 'y'] * p2 - v.x * e[p + 'size'],
      t[p + 'x'] * p1 + s[p + 'x'] * p2 + v.y * e[p + 'size'],
      t[p + 'y'] * p1 + s[p + 'y'] * p2 - v.x * e[p + 'size'],
      t[p + 'x'] + v.y * t[p + 'size'],
      t[p + 'y'] - v.x * t[p + 'size']
    );
    ctx.lineTo(
      t[p + 'x'] - v.y * t[p + 'size'],
      t[p + 'y'] + v.x * t[p + 'size']
    );
    ctx.bezierCurveTo(
      t[p + 'x'] * p1 + s[p + 'x'] * p2 - v.y * e[p + 'size'],
      t[p + 'y'] * p1 + s[p + 'y'] * p2 + v.x * e[p + 'size'],
      s[p + 'x'] * p1 + t[p + 'x'] * p2 - v.y * e[p + 'size'],
      s[p + 'y'] * p1 + t[p + 'y'] * p2 + v.x * e[p + 'size'],
      s[p + 'x'] - v.y * s[p + 'size'],
      s[p + 'y'] + v.x * s[p + 'size']
    );
    ctx.closePath();
    ctx.fill();
  };

  sigma.canvas.nodes.goo = function(node, ctx, settings) {
    var prefix = settings('prefix') || '';

    ctx.fillStyle = node.color || settings('defaultNodeColor');
    ctx.beginPath();
    ctx.arc(
      node[prefix + 'x'],
      node[prefix + 'y'],
      node[prefix + 'size'],
      0,
      Math.PI * 2,
      true
    );
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(
      node[prefix + 'x'],
      node[prefix + 'y'],
      node[prefix + 'size'] * 0.5,
      0,
      Math.PI * 2,
      true
    );
    ctx.closePath();
    ctx.fill();
  };

// "methods have to be added before instances are created to make them available""
sigma.classes.graph.addMethod('getNodesCount', function() {
  return this.nodesArray.length;
});

// Instantiate sigma:
sigmaInstance = new sigma({
  id: 'mySigma',
  graph: g,
  renderer: {
    container: document.getElementById('graph-container'),
    type: 'canvas'
  },
  settings: {
    labelThreshold: 0,   //always show labels
    //autoRescale: false,
    mouseEnabled: true,
    touchEnabled: false,
    mouseWheelEnabled: false,  //disable mouse wheel zooming
    nodesPowRatio: 1,
    edgesPowRatio: 1,
    defaultEdgeColor: '#333',
    defaultNodeColor: '#333',
    edgeColor: 'default',
    doubleClickEnabled: false,
    //minEdgeSize: 0.5,
    //maxEdgeSize: 4,
    enableEdgeHovering: true,
    edgeHoverColor: '#222',
    defaultEdgeHoverColor: '#222',
    edgeHoverSizeRatio: 5,
    edgeHoverExtremities: true,
    
    animationsTime: 1000,
    sideMargin: 1,
    defaultLabelSize: 18,
    //font: "Lato"
    
  }
});

var prefix = 'circular_';
var toggleAnimation = function (callback) {

  sigma.plugins.animate(
    sigmaInstance,
    {
      x: prefix + 'x',
      y: prefix + 'y',
      size: prefix + 'size'
      //color: prefix + 'color'
    },
    {
      onComplete: function () {
        console.log("animation complete");
        if (callback) callback();
      }
    }
    );
};

var animatePhrases = function (callback) {

  sigma.plugins.animate(
    sigmaInstance,
    {
      x: prefix + 'x',
      y: prefix + 'y',      
    },
    {
      onComplete: function () {
        console.log("phrase animation complete");
        if (callback) callback();
      }
    }
    );
};



toggleAnimation();
/**
   * EVENTS BINDING:
   * ***************
   */
  //console.log("dom: ",dom)
  
  // Bind the events:
 /*
s.bind('overNode outNode clickNode doubleClickNode rightClickNode', function(e) {
  console.log(e.type, e.data.node.label, e.data.captor);
});
s.bind('overEdge outEdge clickEdge doubleClickEdge rightClickEdge', function(e) {
  console.log(e.type, e.data.edge, e.data.captor);
});
s.bind('clickStage', function(e) {
  console.log(e.type, e.data.captor);
});
s.bind('doubleClickStage rightClickStage', function(e) {
  console.log(e.type, e.data.captor);
});
*/
var tempNodes = [];
sigmaInstance.bind('clickNode', function(e) {
  console.log(e);
  
     
        //common functionality regardless if the node is a topic or keyword
        sigmaInstance.graph.nodes().forEach(function (n) {
          
           //drop temp nodes if they exist
           tempNodes.forEach(function (tempNode) {
             if (n.id === tempNode.id) sigmaInstance.graph.dropNode(tempNode.id);
           }) 
          
            
             if (n.id === e.data.node.id) {
                n.color = nodeHighlightColor;       //use the highlight color
             }
             else {
                 n.color =   n[prefix + 'color'];   //use the normal color
             }
            
        });
  
  
  
  
  
  if (e.data.node.id === 'topicNode') {
     prefix = 'circular_';
     
     
     
    toggleAnimation(null);
  }
  else {
     prefix = 'grid_';
     
    //e.data.node.color = '#AA0000';
    console.log(e.data.node);
    
     
      
       if (!e.data.node.selected) {  //new selection
       
       var callback = null;
       
         
         
         sigmaInstance.graph.nodes().forEach(function (n) {
           // if (toKeep[n.id])
           //   n.color = n.originalColor;
           // else
           //  n.color = '#eee';
           //console.log(n);
         
           console.log("node is not selected")
           if (n.id === e.data.node.id) {
           
              callback = function() {
                
                console.log("animation callback!");
                
                //temporary nodes
                //var i=0;
                console.log("n: ",n);
                //n.phrases.forEach(function(val) {
                for(var i=0; i<n.phrases.length; i++) {
                  var temp = {
                      id: 'tempNode_'+i,
                      size: 1,
                      grid_size: 1,
                      x: n.grid_x,
                      y: n.grid_y,
                      grid_x: n.grid_x + 0.75,
                      grid_y: n.grid_y + + 0.5 + i*0.5,
                      label: n.phrases[i],
                      type: 'goo'
                    };
                    
                    tempNodes.push(temp);
                    sigmaInstance.graph.addNode(temp);
                    
                    sigmaInstance.graph.addEdge({
                      id: 'tempEdge_'+i,
                      source: temp.id,
                      target: n.id,
                      type: 'goo'
                    });
                    
                    if (i>5) break;
                };
              
             
                  
                  sigmaInstance.refresh(); 
                  animatePhrases(null);  //no animatePhrases callback
              };
             
             n.grid_x = n.original_grid_x + 0.5;
             
             n.selected = true;
           }
           else {
            
            
             //restore properties
             //n.grid_size = kw_size;
             //n.grid_x = n.original_grid_x;
            
           
             if (n.id !== 'tempNodeBefore' || n.id !== 'tempNodeAfter') {
              n.grid_x = -n.original_grid_x; 
             }
             //n.grid_size *= 0.5;
             n.selected = false; //unselect other nodes
           }


         });
       }
       else {  //already selected
         console.log("node was already selected");
         
       }
        
        // Since the data has been modified, we need to
        // call the refresh method to make the colors
        // update effective.
        if (!callback)
          sigmaInstance.refresh();
          
        toggleAnimation(callback);
        callback = null;
        
          // Start the ForceAtlas2 algorithm
          // (requires "sigma.forceatlas2.js" to be included)
        //sigmaInstance.startForceAtlas2();
        
        
  }
});


/*
sigmaInstance.bind('overNode', function(event) {
  console.log("overnodes");
    //console.log(sigmaInstance.graph.getNodesCount());
      
    
     });
     */
//dom = document.querySelector('#graph-container canvas:last-child');
