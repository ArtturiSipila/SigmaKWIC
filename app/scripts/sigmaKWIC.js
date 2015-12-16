'use strict';
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
        { keyword: 'dolor', phrases: ['Lorem ipsum', 'sit amet'] },
        { keyword: 'sed', phrases: ['consectetur adipiscing elit,', 'do eiusmod', 'tempor incididunt', 'Nisi laboris do do', 'labore irure sunt non', 'ad consectetur qui deserunt'] },
        { keyword: 'minim', phrases: ['Ut enim ad', 'veniam, quis nostrud exercitation'] },
        { keyword: 'reprehenderit', phrases: ['Duis aute irure dolor in', 'in voluptate velit esse'] },
        { keyword: 'fugiat', phrases: ['cillum dolore eu', 'nulla pariatur'] },
        { keyword: 'natus', phrases: ['Sed ut perspiciatis unde omnis iste', 'error'] },
        { keyword: 'voluptatem', phrases: ['Nemo enim', 'ipsam', 'quia voluptas', 'sit aspernatur', 'aut odit'] },
        { keyword: 'exercitationem', phrases: ['quis nostrum', 'ullam corporis'] },
        { keyword: 'commodi', phrases: ['nisi ut aliquid ex ea', 'consequatur?'] },
        { keyword: 'quam', phrases: ['velit esse', 'nihil molestiae consequatur'] }
    ],
    kw_size = 0.9,
    nodeHighlightColor = '#B85959',
    nodeColorByPosition = false,
    phraseNodeXOffset = 0.75,
    phraseNodeYOffset = 1,
    phraseDisplayLimit = 5,
    prefix = 'circular_';  //the current view state, we start with 'circular' state

// Generate a random graph:
g.nodes.push({
    id: 'topicNode',
    node_type: 'topicNode',
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
    color: nodeHighlightColor,  //the topic node will be highlighted on init
    circular_color: nodeHighlightColor,
    grid_color: '#888',
    selected: true,
    type: 'goo'
});


for (i = 0; i < kws.length; i++) {
    o = {
        id: 'kw_' + i,
        node_type: 'keywordNode',
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

    // copy the animated properties to the current or actually values
    ['x', 'y', 'size', 'color'].forEach(function (val) {
        o[val] = o[prefix + val];
    });

    g.nodes.push(o);
};

for (i = 0; i < kws.length; i++) {
    g.edges.push({
        id: 'edge_' + i,
        source: 'topicNode',
        target: 'kw_' + i,
        size: 0.8,
        color: '#ccc',
        type: 'goo'
    });
};


/**
 * CUSTOM RENDERERS:
 * *****************
 */
sigma.canvas.edges.goo = function (e, s, t, ctx, settings) {
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

sigma.canvas.nodes.goo = function (node, ctx, settings) {
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
/*
sigma.classes.graph.addMethod('getNodesCount', function () {
    return this.nodesArray.length;
});
*/

// Instantiate sigma:
sigmaInstance = new sigma({
    //id: 'mySigma',  //id is not needed
    graph: g,
    renderer: {
        container: document.getElementById('graph-container'),
        type: 'canvas'
    },
    settings: {
        labelThreshold: 0,   //always show labels
        //autoRescale: false,
        mouseEnabled: true,
        touchEnabled: true,
        mouseWheelEnabled: true,  //disable mouse wheel zooming
        nodesPowRatio: 1,
        edgesPowRatio: 1,
        defaultEdgeColor: '#333',
        defaultNodeColor: '#333',
        edgeColor: 'default',
        doubleClickEnabled: false,
        //minEdgeSize: 0.5,
        //maxEdgeSize: 4,
        //minNodeSize: 1,
        maxNodeSize: 20,
        enableEdgeHovering: false,
        edgeHoverColor: '#222',
        defaultEdgeHoverColor: '#222',
        edgeHoverSizeRatio: 5,
        edgeHoverExtremities: true,
        animationsTime: 1000,
        sideMargin: 1,
        defaultLabelSize: 18
        //font: 'Lato'
    }
});

var moveCameraToNode = function (node, animate, ratio) {
    animate = (typeof animate === 'undefined') ? false : animate;
    ratio = (typeof ratio === 'undefined') ? 1 : ratio;
    
    var x_offset = 100;
    if (animate) {

        sigma.misc.animation.camera(
            sigmaInstance.camera,
            {
                x: node[sigmaInstance.camera.readPrefix + 'x'] + x_offset,
                y: node[sigmaInstance.camera.readPrefix + 'y'],
                ratio: ratio
            },
            { duration: sigmaInstance.settings('animationsTime') || 500 }
            );
    }
    else {
        sigmaInstance.cameras[0].goTo({ x: node['read_cam0:x'], y: node['read_cam0:y'], ratio: ratio })
    }
};

var toggleAnimation = function (callback) {
    //console.log("toggleAnimation");

    //calculate colors based on the new position
    if (nodeColorByPosition) {
        var conId = sigmaInstance.renderers[0].conradId;
        var nodesOnGraph = sigmaInstance.graph.nodes();
        var mapX = sigmaInstance.graph.nodes().map(function (o) {
            return o['renderer' + conId + ':x'];
        });

        var mapY = sigmaInstance.graph.nodes().map(function (o) {
            return o['renderer' + conId + ':y'];
        });

        var xMax = Math.max.apply(Math, mapX);
        var xMin = Math.min.apply(Math, mapX);
        var xRange = xMax - xMin;
        var yMax = Math.max.apply(Math, mapY);
        var yMin = Math.min.apply(Math, mapY);
        var yRange = yMax - yMin;


        for (var i = 0, x, y, z, a, b, c; i < nodesOnGraph.length; i++) {
            x = Math.pow((xMax - nodesOnGraph[i]['renderer' + conId + ':x']) / (xRange), 2) * 16;
            y = Math.pow((yMax - nodesOnGraph[i]['renderer' + conId + ':y']) / (yRange), 2) * 16;
            z = x + y / 2;

            a = Math.min(Math.round(x), 15).toString(16);
            b = Math.min(Math.round(y), 15).toString(16);
            c = Math.round((16 - x + z) / 2).toString(16); //out of various spatial conditions this worked out the best. You can play around with this.

            a = a + a;
            b = b + b;
            c = c + c;

            //console.log(a+b+a)
            nodesOnGraph[i].color = '#' + a + b + c
        }
        sigmaInstance.refresh();
    }

    sigma.plugins.animate(
        sigmaInstance,
        {
            x: prefix + 'x',
            y: prefix + 'y',
            size: prefix + 'size',
            //color: prefix + 'color'  currently animating the color will mess up the highlight logic
        },
        {
            onComplete: function () {
                //console.log("layout animation complete");
                if (callback) callback();
            }
        }
        );
};

var animatePhrases = function (callback) {
    //console.log("animate phrases");
    sigma.plugins.animate(
        sigmaInstance,
        {
            x: prefix + 'x',
            y: prefix + 'y',
            size: prefix + 'size'
        },
        {
            onComplete: function () {
                //console.log("phrase animation complete");
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

var phraseNodes = [];
sigmaInstance.bind('clickNode', function (e) {    
        
    if( e.data.node.node_type === 'phraseNode')  return;       
     
     var swapping = false;  //we are swapping between different phrases
    
    //common functionality regardless if the node is a topic or keyword
    sigmaInstance.graph.nodes().forEach(function (n) {

        // match the event node to graph nodes
        if (n.id === e.data.node.id) {
            n.color = nodeHighlightColor;       //use the highlight color
        }
        else {
            if (e.data.node.id === 'topicNode') {
                n.color = n['circular_color'];   //use the normal color
            }
            else {
                n.color = n['grid_color'];   //use the normal color
            }
            n.selected = false;  
        }
    });

    if (e.data.node.node_type === 'topicNode') {
        prefix = 'circular_';   //clicking a topic node will make a transition to circular layout
        
        //drop the existing phrase nodes 
        sigmaInstance.graph.nodes().forEach(function (n) {
            if (n.node_type === 'phraseNode') sigmaInstance.graph.dropNode(n.id);
        });
        phraseNodes = [];
        
        toggleAnimation(function() {
            moveCameraToNode(e.data.node, true, 1);
        });
    }
    else if( e.data.node.node_type === 'keywordNode') {                    //otherwise we have clicked a keyword node and we use the grid layout
        prefix = 'grid_';
       
    
       
        if (!e.data.node.selected || (phraseDisplayLimit < e.data.node.phrases.length && phraseNodes.length > 0)) {  //new selection (the event node is not selected) or we can swap the phrases

            
             var offset = 0;
            //swapping phrases is possible
            if (phraseDisplayLimit < e.data.node.phrases.length && phraseNodes.length > 0) {
                //if the last displayed node was the last node
                if (phraseNodes[phraseNodes.length-1].phrase_index === e.data.node.phrases.length-1 ) {
                    offset = 0;  //not needed but here we go
                }
                else {
                    offset = phraseNodes[phraseNodes.length-1].phrase_index + 1;  //the phrase after the last phrase index will be the offset for newly displayed phrases
               }
               
               //make sure this is not the first click to this node - otherwise it's not a swapping action
               if ( e.data.node.selected )
                    swapping = true;
               
            }


           //drop the existing phrase nodes 
            sigmaInstance.graph.nodes().forEach(function (n) {
                if (n.node_type === 'phraseNode') sigmaInstance.graph.dropNode(n.id);
            });
        
            var callback = null;

            sigmaInstance.graph.nodes().forEach(function (n) {

                if (n.id === e.data.node.id) {

                    //define the animation callback, phrase nodes will be added after the animation is done
                    callback = function () {
                        //before we push any new nodes to the array we'll clean it up
                        phraseNodes = [];
                            
                        //phrase nodes
                        var iteration = 0;
                        for (var i = offset; i < n.phrases.length; i++) {
                            
                            if (i >= offset+phraseDisplayLimit) break;
                            
                            var phraseNode = {
                                id: 'phraseNode_' + i,
                                node_type: 'phraseNode',
                                phrase_index: i,
                                size: 1,
                                grid_size: 0.75,
                                x: n.grid_x,
                                y: n.grid_y,
                                grid_x: n.grid_x + phraseNodeXOffset,
                                grid_y: n.grid_y + phraseNodeYOffset + iteration * phraseNodeYOffset,
                                label: n.phrases[i],
                                type: 'goo'
                            };

                            phraseNodes.push(phraseNode);
                            sigmaInstance.graph.addNode(phraseNode);

                            sigmaInstance.graph.addEdge({
                                id: 'phraseEdge_' + i,
                                source: phraseNode.id,
                                target: n.id,
                                size: 1,
                                grid_size: 0.1,
                                type: 'goo'
                            });

                            iteration++;
                        };

                        n.selected = true;           

                        sigmaInstance.refresh();
                        animatePhrases(function() {
                              moveCameraToNode( e.data.node, true, 1.2 );
                        });  //no animatePhrases callback
                    };

                    n.grid_x = n.original_grid_x + 0.5;

                }
                else {  //move other nodes to the opposite direction
                    n.grid_x = -n.original_grid_x;
                     n.selected = false;             //unselect other nodes
                }

            });
        }
        else {
            //we are doing nothing as this was a second click to the same node
        }

        // Since the data has been modified, we need to
        // call the refresh method to make the colors
        // update effective.
        if (!callback)
            sigmaInstance.refresh();

        //spaghetti-code warning!!

        //special case, we are swapping keywords
        if (swapping) {
            callback();
        }
        else {
            toggleAnimation(callback);    
        }
        
        
        callback = null;
    } 
    
});