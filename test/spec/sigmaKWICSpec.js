(function () {
  'use strict';

  describe('Variation.js', function () {
    describe('Instantiation', function () {
      it('should push kw array to nodes', function () {
        expect(g.nodes).to.have.length(kws.length + 1 );
      });
    });
  });
})();
