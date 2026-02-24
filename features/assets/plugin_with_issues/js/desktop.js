(function () {
  // This code uses internal APIs that should be detected
  const data = cybozu.data;
  console.log(data);

  // This code uses internal CSS selectors that should be detected
  document.querySelector(".gaia-argoui-button");
  document.querySelector(".ocean-ui-dialog");
})();
