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
    topic = 'my topic',
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
      {keyword: 'quam', context_before: 'velit esse', context_after: 'nihil molestiae consequatur'},
      ];

// Generate a random graph:
g.nodes.push({
  id: 'topicNode',
   label: topic,
   x: 0,
   y: 0.5,
   size: 1,
   color: '#888'
});

for (i = 0; i < kws.length; i++)
  g.nodes.push({
    id: 'kw_' + i,
    label: kws[i].keyword,
    x: 0.1+Math.random()*0.9,
    y: Math.random(),
    size: Math.random()*0.5,
    color: '#666'
  });


for (i = 0; i < kws.length; i++)
  g.edges.push({
    id: 'edge_' + i,
    source: 'topicNode',
    target: 'kw_' + i,
    size: Math.random(),
    color: '#ccc'
  });

// Instantiate sigma:
s = new sigma({
  graph: g,
  container: 'graph-container',
  settings: {
    labelThreshold: 0   //always show labels
  }
});
