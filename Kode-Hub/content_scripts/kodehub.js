(() => {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  /**
   * Given a URL to a beast image, remove all existing beasts, then
   * create and style an IMG node pointing to
   * that image, then insert the node into the document.
   */
  function redirectPage(baseURL) {
    
    window.location = baseURL;
  }

  /**
   * Remove every beast from the page.
   */
  function removeExistingPage() {
    window.location = "https://www.google.com/";
  }

  /**
   * Listen for messages from the background script.
   * Call "insertBeast()" or "removeExistingBeasts()".
   */
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "kodehub") {
      redirectPage(message.baseURL);
    } else if (message.command === "reset") {
      removeExistingPage();
    }
  });
})();

