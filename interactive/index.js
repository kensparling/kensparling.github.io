let currentVersion = 1;

function loadNewVersion(version) {
  $.get(`./v${version}.html`, (data) => {
    $('#content').html(data);
    formatPage();
  });
}

function formatPage() {
  // Find all HR tags within the content area
  const hrElements = $('#content hr');
  
  // If we found HR elements
  if (hrElements.length > 0) {
    // First, handle elements before the first HR tag
    const firstHr = hrElements[0];
    
    // Create a div for the first page
    const firstPageDiv = $('<div class="page"></div>');
    
    // Insert the div at the beginning of content
    $('#content').prepend(firstPageDiv);
    
    // Get all elements before the first HR but NOT the page div we just created
    let currentElement = firstPageDiv.next();
    while (currentElement.length && !currentElement.is(firstHr)) {
      // Skip style and meta tags
      if (!currentElement.is('style, meta')) {
        // Move this element into our page div (maintains order)
        const nextElement = currentElement.next();
        currentElement.detach().appendTo(firstPageDiv);
        currentElement = nextElement;
      } else {
        currentElement = currentElement.next();
      }
    }
    
    // Process remaining HR tags
    for (let i = 1; i < hrElements.length; i++) {
      const currentHr = hrElements[i];
      const prevHr = hrElements[i-1];
      
      // Create a new page div after the previous HR
      const pageDiv = $('<div class="page"></div>');
      $(prevHr).after(pageDiv);
      
      // Get all elements between this HR and the previous HR
      let element = pageDiv.next();
      while (element.length && !element.is(currentHr)) {
        // Skip style and meta tags
        if (!element.is('style, meta')) {
          // Move this element into our page div (maintains order)
          const nextElement = element.next();
          element.detach().appendTo(pageDiv);
          element = nextElement;
        } else {
          element = element.next();
        }
      }
    }
    
    // Handle the last HR tag - wrap everything after it in a page div
    const lastHr = hrElements[hrElements.length - 1];
    const lastPageDiv = $('<div class="page"></div>');
    $(lastHr).after(lastPageDiv);
    
    // Move all elements after the last HR into the last page div
    let lastElement = lastPageDiv.next();
    while (lastElement.length) {
      // Skip style and meta tags
      if (!lastElement.is('style, meta')) {
        // Move this element into our page div
        const nextElement = lastElement.next();
        lastElement.detach().appendTo(lastPageDiv);
        lastElement = nextElement;
      } else {
        lastElement = lastElement.next();
      }
    }
  }
}

$(document).ready(() => {
  loadNewVersion(currentVersion);
  let lastLoaded = 'top';
  const OFFSET = 5;
  
  $(window).scroll(() => {
    if ((window.innerHeight + window.scrollY + OFFSET) >= document.body.offsetHeight) {
      if (lastLoaded === 'top') {
        currentVersion++;
        loadNewVersion(currentVersion);
        lastLoaded = 'bottom';
      }
    } else if (window.scrollY <= 0 + OFFSET + window.innerHeight) {
      if (lastLoaded === 'bottom') {
        currentVersion++;
        loadNewVersion(currentVersion);
        lastLoaded = 'top';
      }
    }
  });
});
