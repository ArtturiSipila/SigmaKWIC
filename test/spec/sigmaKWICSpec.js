(function () {
  'use strict';

  function reinstantiateSigma() {
    
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
        mouseWheelEnabled: false,  //disable mouse wheel zooming
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
  }

  describe('SigmaKWIC.js', function () {
    describe('Instantiation', function () {
      it('should push kw array to nodes', function () {
        expect(g.nodes).to.have.length(kws.length + 1);
      });

      describe('Goo renderer', function () {

        /*
                beforeEach(function () {
                  //init values
                  g.nodes.forEach(function (n) {
                    delete n.color;
                  });
         //console.log("g.nodes: ", g.nodes);
                  reinstantiateSigma();
                });
                console.log("g.nodes: ", g.nodes);
                console.log("nodes: ", sigmaInstance.graph.nodes());
                
                it('should add edge color properties if they do not exists', function () {
                  sigmaInstance.graph.nodes().should.not.all.have.property('color');
                });
                */
      
      
        /*
          it('should modify color values correctly when edgeColor:"source"', function () {
            sigmaInstance.settings.edgeColor = 'source';
            sigmaInstance.refresh();
          
          console.log("sigmaInstance.graph ",sigmaInstance.graph.edges());
            sigmaInstance.graph.nodes().should.all.have.property('color', '#333');
            
            //expect(sigmaInstance.graph.nodes()[1].color).not.to.equal('#FFFFFF');
            //expect(sigmaInstance.graph.nodes()[sigmaInstance.graph.nodes().length - 1].color).not.to.equal('#FFFFFF');
  
        });
        */


      });
    });
    describe('Animation', function () {
      it('modify values when animating', function () {
          
        //init values
        sigmaInstance.graph.nodes().forEach(function (n) {
          n.x = 0;
          n.y = 0;
          n.size = 0;
        });
        sigmaInstance.refresh();

        prefix = 'circular_';
        toggleAnimation(function () {

          expect(g.nodes[1].x).not.to.equal(0);
          expect(g.nodes[3].x).not.to.equal(0);
          expect(g.nodes[g.nodes.length - 1].x).not.to.equal(0);

          expect(g.nodes[2].y).not.to.equal(0);
          expect(g.nodes[4].y).not.to.equal(0);
          expect(g.nodes[g.nodes.length - 1].y).not.to.equal(0);

          expect(g.nodes[5].size).not.to.equal(0);
          expect(g.nodes[6].size).not.to.equal(0);
          expect(g.nodes[g.nodes.length - 1].size).not.to.equal(0);
        });

      });
      it('modify color values when animating when nodeColorByPosition is true', function () {
        
        //init values
        g.nodes.forEach(function (n) {
          n.color = "#FFFFFF";
          n.x = Math.random();
          n.y = Math.random();
        });

        prefix = 'circular_';
        nodeColorByPosition = true;

        reinstantiateSigma();

        toggleAnimation(function () {
          expect(sigmaInstance.graph.nodes()[1].color).not.to.equal('#FFFFFF');
          expect(sigmaInstance.graph.nodes()[sigmaInstance.graph.nodes().length - 1].color).not.to.equal('#FFFFFF');
        });

      });
    });

    describe('Click event', function () {
      it('should change layout when keyword node clicked', function () {
        sigmaInstance.dispatchEvent('click', {});
        //var topicNode = sigmaInstance.graph.nodes("topicNode");
        var kwNode = sigmaInstance.graph.nodes()[1];
        if (kwNode !== null) {
          // create fake data object
          var fakeData = {
            node: kwNode
          };
          
           // simulate async call w/ setTimeout
          //setTimeout(function(){
        
            // dispatch event to renderer
            //console.log("renderer ",sigmaInstance.renderers[0]);
            sigmaInstance.renderers[0].dispatchEvent('clickNode', fakeData);
            //this is not working for some reason
            
            sigmaInstance.renderers[0].dispatchEvent('overNode', fakeData);
            //}, 1000);
          
        }
      });
    });


  });
})();
