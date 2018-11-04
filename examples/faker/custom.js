const pd = require('probability-distributions');

function customFaker (numOfSamples) {
  let len = Math.abs(numOfSamples);
  let endIndex = len - 1;
  let currentIndex = -1;
  
  function PrecomputedSamples(numOfSamples) {
    this.numOfSamples = numOfSamples;
    this.samples = {};
    
    PrecomputedSamples.prototype.init = () => {
      this.samples.height = pd.rnorm(this.numOfSamples, 172, 4.5 );
      this.samples.weight = pd.rnorm(this.numOfSamples, 72, 7 );
    }
    this.init();
  }

  let precomputedSamples = new PrecomputedSamples(len);
  
  let samples = {
    get next() {
      if (currentIndex == endIndex) {
        currentIndex = -1;
      } 
      ++currentIndex;
      return this; 
    },
    height(options) {
      return precomputedSamples.samples.height[currentIndex];
    },
    weight(options) {
      return precomputedSamples.samples.weight[currentIndex];
    }
  }
  return () => samples;
}

module.exports = customFaker;
