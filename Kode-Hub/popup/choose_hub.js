
const hidePage = `body > :not(.beastify-image) {
    display: none;
  }`;

/**
 * Listen for clicks on the buttons, and send the message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {
    /**
     * Below are pre-determined course websites that will show up as tabs. A long term goal for this project is to allow users to enter their 
     * course websites and be able to modify (add, delete, or edit) these links. 
     * These are links make up our "hub"
     */
    function hubNameToURL(hubName) {
      switch (hubName) {
        case "Leetcode":
          return "https://leetcode.com/";
        case "CourseWebsite":
          return "https://cs.nyu.edu/~joannakl/ossd_s23/";
        case "Course-Github":
          return "https://github.com/ossd-s23/";
      }
    }

    /**
     * Send a "kodehub" message to the content script in the active tab.
     */
    function kodehub(tabs) {
      browser.tabs.insertCSS({ code: hidePage }).then(() => {
        let url = hubNameToURL(e.target.textContent);
        console.log(url);
        browser.tabs.sendMessage(tabs[0].id, {
          command: "kodehub",
          baseURL: url,
        });
      });
    }


    /**
     * if there is any errors, log it into the console
     */
    function reportError(error) {
      console.error(`Could not KodeHub: ${error}`);
    }

    /**
     * Get the active tab,
     * then call "kodeHub()"
     */
    
    browser.tabs
    .query({ active: true, currentWindow: true })
    .then(kodehub)
    .catch(reportError);

  });
}

/**
 * In case of errors, show the popup's error message
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute KodeHub content script: ${error.message}`);
}

/**
 * When the popup loads, the content script will be loaded into the active tab, and then add the click handler
 */
browser.tabs
  .executeScript({ file: "/content_scripts/kodehub.js" })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
