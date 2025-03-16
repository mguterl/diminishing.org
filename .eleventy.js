module.exports = function(eleventyConfig) {
  // Copy the "assets" directory to the output
  eleventyConfig.addPassthroughCopy("src/assets");
  
  // Copy `src/css/` to `_site/css/`
  eleventyConfig.addPassthroughCopy("src/css");
  
  // Add a shortcode for the current year
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Add CNAME file to output
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });
  
  // Set custom directories for input, output, includes, and data
  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};