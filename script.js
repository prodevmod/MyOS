// Global variables
var welcomeScreen = document.querySelector("#welcome");
var welcomeScreenClose = document.querySelector("#welcomeclose");
var selectedIcon = undefined;
var welcomeScreenOpen = document.querySelector("#welcomeopen");
var biggestIndex = 1;
var topBar = document.querySelector("#top");
var topBarHeight = 60; // Approximate height of top bar

// Content data structure
var logContent = {
  logs: [
    {
      title: "Welcome",
      date: "06/23/2026",
      content: `
        <p contenteditable="true">
          Welcome to your quest log, brave warrior.
        </p>
      `
    },
    {
      title: "The Dragon",
      date: "06/15/2026",
      content: `
        <p contenteditable="true">
          A great dragon with scales of gold, breathing ancient fire. Its wings span mountains.
        </p>
      `
    },
    {
      title: "The Kraken",
      date: "06/10/2026",
      content: `
        <p contenteditable="true">
          A leviathan of the deep. Tentacles thick as oak, eyes that pierce through darkness.
        </p>
      `
    },
    {
      title: "The Phoenix",
      date: "06/05/2026",
      content: `
        <p contenteditable="true">
          A bird of eternal flame, born from ashes. It rises anew with each rebirth.
        </p>
      `
    }
  ],
  quests: [
    {
      title: "Moonhollow",
      date: "06/20/2026",
      content: `
        <p contenteditable="true">
          I found the lost treasure of Moonhollow. After three days through cursed ruins, I discovered a crystalline orb holding ancient memories of the realm.
        </p>
      `
    },
    {
      title: "Thornhaven Siege",
      date: "06/12/2026",
      content: `
        <p contenteditable="true">
          The goblins sieged Thornhaven. We cut their supply lines and forced them to retreat. The town was saved without further bloodshed.
        </p>
      `
    }
  ]
};

//Time Tracking Function
setInterval(function () {
  document.querySelector("#timeElement").innerHTML = new Date().toLocaleString();
}, 1000);

// Define a function called `dragElement` that makes an HTML element draggable.
function dragElement(element) {
  if (!element) return;
  
  // Set up variables to keep track of the element's position.
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  // Check if there is a special header element associated with the draggable element.
  var headerElement = document.getElementById(element.id + "header");
  if (headerElement) {
    // If present, assign the `dragMouseDown` function to the header's `onmousedown` event.
    headerElement.onmousedown = startDragging;
  } else {
    // If not present, assign the function directly to the draggable element's `onmousedown` event.
    element.onmousedown = startDragging;
  }

  // Define the `startDragging` function to capture the initial mouse position and set up event listeners.
  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    // Get the mouse cursor position at startup.
    initialX = e.clientX;
    initialY = e.clientY;
    // Set up event listeners for mouse movement and mouse button release.
    document.onmouseup = stopDragging;
    document.onmousemove = dragMove;
  }

  // Define the `dragMove` function to calculate the new position of the element based on mouse movement.
  function dragMove(e) {
    e = e || window.event;
    e.preventDefault();
    // Calculate the new cursor position.
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    // Update the element's new position by modifying its `top` and `left` CSS properties.
    var newTop = element.offsetTop - currentY;
    var newLeft = element.offsetLeft - currentX;
    
    // Prevent window from going above the top bar
    if (newTop < topBarHeight) {
      newTop = topBarHeight;
    }
    
    element.style.top = newTop + "px";
    element.style.left = newLeft + "px";
  }

  // Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

if (welcomeScreenClose) {
  welcomeScreenClose.addEventListener("click", function() {
    closeWindow(welcomeScreen);
  });
}

if (welcomeScreenOpen) {
  welcomeScreenOpen.addEventListener("click", function() {
    openWindow(welcomeScreen);
  });
}

function closeWindow(element) {
  if (element) {
    element.style.display = "none";
  }
}

function openWindow(element) {
  if (element) {
    element.style.display = "flex";
    biggestIndex++;
    element.style.zIndex = biggestIndex;
    topBar.style.zIndex = biggestIndex + 1;
  }
}

function addWindowTapHandling(element) {
  if (element) {
    element.addEventListener("mousedown", () => {
      handleWindowTap(element);
    });
  }
}

function handleWindowTap(element) {
  if (element) {
    biggestIndex++;
    element.style.zIndex = biggestIndex;
    topBar.style.zIndex = biggestIndex + 1;
    deselectIcon(selectedIcon);
  }
}

function selectIcon(element) {
  if (selectedIcon) {
    selectedIcon.classList.remove("selected");
  }
  element.classList.add("selected");
  selectedIcon = element;
}

function deselectIcon(element) {
  if (element) {
    element.classList.remove("selected");
  }
}

function handleIconTap(element) {
  selectIcon(element);
  var appId = element.getAttribute("data-app");
  var appWindow = document.querySelector("#" + appId);
  if (appWindow) {
    openWindow(appWindow);
  }
}

// Function to add content to the sidebar dynamically
function addToSidebar(contentType, index) {
  var sidebar = document.querySelector("#" + contentType + "-list");
  if (!sidebar) return;
  
  var item = logContent[contentType][index];
  
  var newDiv = document.createElement("div");
  newDiv.style.cssText = "padding: 12px; border-radius: 8px; cursor: pointer; background-color: #2a2a2a; margin-bottom: 8px; border-left: 3px solid #cc0000;";
  
  newDiv.innerHTML = `
    <p style="margin: 0; color: #ffd700; font-weight: 700; font-size: 14px;">${item.title}</p>
    <p style="font-size: 11px; margin: 0; color: #999;">${item.date}</p>
  `;
  
  newDiv.addEventListener("click", function() {
    displayContent(contentType, index);
  });
  
  sidebar.appendChild(newDiv);
}

// Function to display content detail
function displayContent(contentType, index) {
  var detailPane = document.querySelector("#" + contentType + "-detail");
  if (!detailPane) return;
  
  var item = logContent[contentType][index];
  
  detailPane.innerHTML = `
    <h3 style="color: #ffd700; margin-top: 0; margin-bottom: 8px; font-size: 18px;">${item.title}</h3>
    <p style="font-size: 11px; color: #999; margin: 0 0 16px 0;">${item.date}</p>
    <div style="color: #e0e0e0; font-size: 13px; line-height: 1.6;">
      ${item.content}
    </div>
  `;
}

// Function to populate a content category
function populateContentCategory(contentType) {
  // Clear the sidebar
  var sidebar = document.querySelector("#" + contentType + "-list");
  if (sidebar) {
    sidebar.innerHTML = "";
  }
  
  // Clear the detail pane
  var detailPane = document.querySelector("#" + contentType + "-detail");
  if (detailPane) {
    detailPane.innerHTML = "";
  }
  
  // Add all items to sidebar
  var items = logContent[contentType];
  if (items) {
    for (let i = 0; i < items.length; i++) {
      addToSidebar(contentType, i);
    }
    // Display the first item by default
    if (items.length > 0) {
      displayContent(contentType, 0);
    }
  }
}

// Sidebar navigation handling
var sidebarItems = document.querySelectorAll(".sidebar-item");
sidebarItems.forEach(function(item) {
  item.addEventListener("click", function() {
    var contentId = this.getAttribute("data-content");
    
    // Remove active state from all items
    sidebarItems.forEach(function(i) {
      i.style.backgroundColor = "#2a2a2a";
      i.style.color = "#ccc";
    });
    
    // Set active state on clicked item
    this.style.backgroundColor = "#cc0000";
    this.style.color = "#fff";
    
    // Hide all content sections
    var contentSections = document.querySelectorAll(".content-section");
    contentSections.forEach(function(section) {
      section.style.display = "none";
    });
    
    // Show selected content section
    var selectedContent = document.getElementById(contentId + "-content");
    if (selectedContent) {
      selectedContent.style.display = "flex";
      // Populate the content for this category
      populateContentCategory(contentId);
    }
  });
});

var abbarItems = document.querySelectorAll(".abbar-item");

abbarItems.forEach(function(item) {
  item.addEventListener("click", function() {
    var contentId = this.getAttribute("data-content");
    
    // 1. Reset all tabs
    abbarItems.forEach(function(i) {
      i.style.backgroundColor = "#2a2a2a";
      i.style.color = "#ccc";
      i.classList.remove("active");
    });
    
    // 2. Highlight clicked tab
    this.style.backgroundColor = "#cc0000";
    this.style.color = "#fff";
    this.classList.add("active");
    
    // 3. Hide all sections
    var abContentSections = document.querySelectorAll(".abcontent-section");
    abContentSections.forEach(function(section) {
      section.style.display = "none";
    });
    
    // 4. Show the matching section
    var selectedContent = document.getElementById(contentId + "-content");
    if (selectedContent) {
      selectedContent.style.display = "block"; 
    }
  });
});


// Initialize content on page load
window.addEventListener("DOMContentLoaded", function() {
  populateContentCategory("logs");
});

// --- WINDOW & ICON INITIALIZATION ---

// 1. Wire up all desktop icons to open their respective apps
var desktopIcons = document.querySelectorAll(".desktop-icon");
desktopIcons.forEach(function(icon) {
  icon.addEventListener("click", function() { 
    handleIconTap(this);
  });
});

// 2. Initialize the window behaviors (dragging, tapping to bring to front)
function initializeWindow(elementName) {
  var screen = document.querySelector("#" + elementName);
  
  if (screen) {
    // 1. Initialize tapping and dragging behaviors
    addWindowTapHandling(screen);
    dragElement(screen);
    
    // 2. Dynamically find and initialize the close button
    var closeButton = document.querySelector("#" + elementName + "close");
    if (closeButton) {
      closeButton.addEventListener("click", function() {
        closeWindow(screen);
        
        // Deselect the desktop icon if this specific app is closed
        if (selectedIcon && selectedIcon.getAttribute("data-app") === elementName) {
          selectedIcon.classList.remove("selected");
          selectedIcon = undefined;
        }
      });
    }
  }
}

// 3. Initialize the windows that actually exist in your HTML
initializeWindow("welcome");
initializeWindow("sidequesttracker");
initializeWindow("aboutme");