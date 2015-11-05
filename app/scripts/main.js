/**
 * This is a basic example on how to instantiate sigma. A random graph is
 * generated and stored in the "graph" variable, and then sigma is instantiated
 * directly with the graph.
 *
 * The simple instance of sigma is enough to make it render the graph on the on
 * the screen, since the graph is given directly to the constructor.
 */
var i,
    s,
    g = {
      nodes: [],
      edges: []
    },
    //dom,
    topic = 'my topic'
    kws = [
      {keyword: 'dolor', context_before: 'Lorem ipsum', context_after: 'sit amet'},
      {keyword: 'sed', context_before: 'consectetur adipiscing elit,', context_after: 'do eiusmod tempor incididunt'},
      {keyword: 'minim', context_before: 'Ut enim ad', context_after: 'veniam, quis nostrud exercitation'},
      {keyword: 'reprehenderit', context_before: '. Duis aute irure dolor in', context_after: 'in voluptate velit esse'},
      {keyword: 'fugiat', context_before: 'cillum dolore eu', context_after: 'nulla pariatur'},
      {keyword: 'natus', context_before: 'Sed ut perspiciatis unde omnis iste', context_after: 'error'},
      {keyword: 'voluptatem', context_before: 'Nemo enim ipsam', context_after: 'quia voluptas sit aspernatur aut odit'},
      {keyword: 'exercitationem', context_before: 'quis nostrum', context_after: 'ullam corporis'},
      {keyword: 'commodi', context_before: 'nisi ut aliquid ex ea', context_after: 'consequatur?'},
      {keyword: 'quam', context_before: 'velit esse', context_after: 'nihil molestiae consequatur'}
      ];
      

// Generate a random graph:
g.nodes.push({
  id: 'topicNode',
   label: topic,
   x: 0,
   y: 0.5,
   size: 1,
   color: '#888',
   type: 'goo'
});


for (i = 0; i < kws.length; i++)
  g.nodes.push({
    id: 'kw_' + i,
    label: kws[i].keyword,
    x: 0.1+Math.random()*0.9,
    y: Math.random(),
    size: Math.random(),
    color: '#666',
    type: 'goo'
  });


for (i = 0; i < kws.length; i++)
  g.edges.push({
    id: 'edge_' + i,
    source: 'topicNode',
    target: 'kw_' + i,
    size: Math.random()*0.9,
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


 
  
  /*
    dom.addEventListener('click', function(e) {
      console.log("clicked: ",e);
    });
    */
  
  /*
  dom.addEventListener('click', function(e) {
    // Find neighbors:
    var x,
        y,
        p,
        id,
        neighbors;

    x = sigma.utils.getX(e) - dom.offsetWidth / 2;
    y = sigma.utils.getY(e) - dom.offsetHeight / 2;

    p = c.cameraPosition(x, y);
    x = p.x;
    y = p.y;

    neighbors = s.graph.nodes().filter(function(n) {
      return (Math.sqrt(
        Math.pow(n.x - x, 2) +
        Math.pow(n.y - y, 2)
      ) - n.size) < radius;
    });

    if (!spaceMode)
      s.graph.addNode({
        id: (id = (++nId) + ''),
        size: nodeRadius,
        x: x + Math.random() / 10,
        y: y + Math.random() / 10,
        dX: 0,
        dY: 0,
        type: 'goo'
      });

    neighbors.forEach(function(n) {
      if (!spaceMode)
        s.graph.addEdge({
          id: (++eId) + '',
          source: id,
          target: n.id,
          type: 'goo'
        });
      else
        s.graph.dropNode(n.id);
    });
  }, false);
  dom.addEventListener('mousemove', function(e) {
    mouseX = sigma.utils.getX(e);
    mouseY = sigma.utils.getY(e);
  }, false);
  dom.addEventListener('DOMMouseScroll', function(e) {
    radius *= sigma.utils.getDelta(e) < 0 ? 1 / wheelRatio : wheelRatio;
  }, false);
  dom.addEventListener('mousewheel', function(e) {
    radius *= sigma.utils.getDelta(e) < 0 ? 1 / wheelRatio : wheelRatio;
  }, false);
  document.addEventListener('keydown', function(e) {
    spaceMode = (e.which == 32) ? true : spaceMode;
  });
  document.addEventListener('keyup', function(e) {
    spaceMode = e.which == 32 ? false : spaceMode;
  });
})();
*/
// Instantiate sigma:
s = new sigma({
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
    nodesPowRatio: 1,
    edgesPowRatio: 1,
    defaultEdgeColor: '#333',
    defaultNodeColor: '#333',
    edgeColor: 'default',
    
    doubleClickEnabled: false,
    minEdgeSize: 0.5,
    maxEdgeSize: 4,
    enableEdgeHovering: true,
    edgeHoverColor: '#222',
    defaultEdgeHoverColor: '#222',
    edgeHoverSizeRatio: 5,
    edgeHoverExtremities: true,
  }
});

/**
   * EVENTS BINDING:
   * ***************
   */
  //console.log("dom: ",dom)
  
  // Bind the events:
s.bind('overNode outNode clickNode doubleClickNode rightClickNode', function(e) {
  console.log(e.type, e.data.node.label, e.data.captor);
  e.data.node.label = 'asdasdasdas';
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
//dom = document.querySelector('#graph-container canvas:last-child');
