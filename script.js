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

// Global tracking variable to prevent unnecessary screen re-renders
var currentMonthTracked = -1;

// --- VISUAL CALENDAR ENGINE ---
function drawCalendarGrid(year, month, todayDate) {
  var gridContainer = document.querySelector("#calendarGridContainer");
  if (!gridContainer) return;

  // Clear any existing content inside the frame
  gridContainer.innerHTML = "";

  // 1. Create a modern CSS Grid element
  var gridWrapper = document.createElement("div");
  gridWrapper.style.display = "grid";
  gridWrapper.style.gridTemplateColumns = "repeat(7, 1fr)";
  gridWrapper.style.gap = "8px";
  gridWrapper.style.marginTop = "12px";

  // 2. Inject Day Headers (Sunday through Saturday)
  var dayLabels = ["S", "M", "T", "W", "T", "F", "S"];
  dayLabels.forEach(function(dayName) {
    var label = document.createElement("div");
    label.innerText = dayName;
    label.style.color = "#555"; // Subtle dim color for header text
    label.style.fontWeight = "bold";
    label.style.textAlign = "center";
    label.style.fontSize = "11px";
    gridWrapper.appendChild(label);
  });

  // 3. Calculate calendar grid specifications
  var totalDays = new Date(year, month + 1, 0).getDate();
  var startingDay = new Date(year, month, 1).getDay();

  // 4. Inject empty structural spaces for off-month padding blocks
  for (var i = 0; i < startingDay; i++) {
    var emptyCell = document.createElement("div");
    gridWrapper.appendChild(emptyCell);
  }

  // 5. Generate and stamp out actual calendar day buttons
  for (var day = 1; day <= totalDays; day++) {
    var dayCell = document.createElement("div");
    dayCell.innerText = day;
    dayCell.style.textAlign = "center";
    dayCell.style.padding = "6px 0";
    dayCell.style.fontSize = "13px";
    dayCell.style.color = "#b3b3b3";
    dayCell.style.borderRadius = "6px";
    dayCell.style.fontFamily = "monospace";

    // Highlight your target current active day matching real-world clocks
    if (day === todayDate) {
      dayCell.style.backgroundColor = "#ff3b30"; // Clean warrior crimson accent tag
      dayCell.style.color = "#ffffff";
      dayCell.style.fontWeight = "bold";
      dayCell.style.boxShadow = "0 0 8px rgba(255, 59, 48, 0.4)";
    }

    gridWrapper.appendChild(dayCell);
  }

  // Mount the newly rendered engine block directly onto your app frame
  gridContainer.appendChild(gridWrapper);
}

// --- SYSTEM TIME TRACKING ENGINE ---
setInterval(function () {
  var now = new Date();
  
  // Grab standard UI nodes
  var topBarCalendar = document.querySelector("#calendarOpen");
  var windowCalendar = document.querySelector("#calendarContent");
  var mainClock = document.querySelector("#clockElement");

  // Keep live time and string fields firing every second smoothly
  if (topBarCalendar) topBarCalendar.innerHTML = now.toLocaleDateString();
  if (windowCalendar) windowCalendar.innerHTML = now.toDateString();
  if (mainClock) mainClock.innerHTML = now.toLocaleTimeString();

  var currentYear = now.getFullYear();
  var currentMonth = now.getMonth();
  var todayDate = now.getDate();

  // GATEWAY GATEKEEPER: Only rebuild the layout if it hasn't been built yet, or if the month changes.
  if (currentMonth !== currentMonthTracked) {
    currentMonthTracked = currentMonth;
    drawCalendarGrid(currentYear, currentMonth, todayDate);
  }
}, 1000);

// --- WINDOW DRAGGING ENGINE ---
function dragElement(element) {
  if (!element) return;
  
  var initialX = 0, initialY = 0, currentX = 0, currentY = 0;

  var headerElement = document.getElementById(element.id + "header");
  if (headerElement) {
    headerElement.onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = dragMove;
  }

  function dragMove(e) {
    e = e || window.event;
    e.preventDefault();
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    
    var newTop = element.offsetTop - currentY;
    var newLeft = element.offsetLeft - currentX;
    
    if (newTop < topBarHeight) {
      newTop = topBarHeight;
    }
    
    element.style.top = newTop + "px";
    element.style.left = newLeft + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// --- WINDOW MANAGEMENT ---
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

// UNIFIED APP OPENER
function handleIconTap(element) {
  // 1. Highlight the desktop icon visually
  selectIcon(element);
  
  // 2. Read which app this icon is supposed to open
  var appId = element.getAttribute("data-app");
  
  // 3. Safety Catch: If it's Coffee Minder but missing the data-app attribute
  if (!appId && element.id === "coffeeMinderIcon") {
    appId = "coffeeMinder";
  }

  // 4. Find the window and open it using your OS engine
  var appWindow = document.querySelector("#" + appId);
  if (appWindow) {
    // Special check: ensure display matches what the CSS expects (flex vs block)
    if(appId === "coffeeMinder") {
        appWindow.style.display = "block";
        biggestIndex++;
        appWindow.style.zIndex = biggestIndex;
        topBar.style.zIndex = biggestIndex + 1;
    } else {
        openWindow(appWindow);
    }
  }
}

// --- QUEST LOG / SIDEBAR CONTENT ---
function addToSidebar(contentType, index) {
  var sidebar = document.querySelector("#" + contentType + "-list");
  if (!sidebar) return;
  
  var item = logContent[contentType][index];
  
  var newDiv = document.createElement("div");
  newDiv.style.cssText = "padding: 12px; border-radius: 8px; cursor: pointer; background-color: #2a2a2a; margin-bottom: 8px; border-left: 3px solid #cc0000;";
  
  newDiv.innerHTML = `
    <p style="margin: 0; color: #ffffff; font-weight: 700; font-size: 14px;">${item.title}</p>
    <p style="font-size: 11px; margin: 0; color: #999;">${item.date}</p>
  `;
  
  newDiv.addEventListener("click", function() {
    displayContent(contentType, index);
  });
  
  sidebar.appendChild(newDiv);
}

function displayContent(contentType, index) {
  var detailPane = document.querySelector("#" + contentType + "-detail");
  if (!detailPane) return;
  
  var item = logContent[contentType][index];
  
  detailPane.innerHTML = `
    <h3 style="color: #ffffff; margin-top: 0; margin-bottom: 8px; font-size: 18px;">${item.title}</h3>
    <p style="font-size: 11px; color: #999; margin: 0 0 16px 0;">${item.date}</p>
    <div style="color: #e0e0e0; font-size: 13px; line-height: 1.6;">
      ${item.content}
    </div>
  `;
}

function populateContentCategory(contentType) {
  var sidebar = document.querySelector("#" + contentType + "-list");
  if (sidebar) sidebar.innerHTML = "";
  
  var detailPane = document.querySelector("#" + contentType + "-detail");
  if (detailPane) detailPane.innerHTML = "";
  
  var items = logContent[contentType];
  if (items) {
    for (let i = 0; i < items.length; i++) {
      addToSidebar(contentType, i);
    }
    if (items.length > 0) {
      displayContent(contentType, 0);
    }
  }
}

var sidebarItems = document.querySelectorAll(".sidebar-item");
sidebarItems.forEach(function(item) {
  item.addEventListener("click", function() {
    var contentId = this.getAttribute("data-content");
    
    sidebarItems.forEach(function(i) {
      i.style.backgroundColor = "#2a2a2a";
      i.style.color = "#ccc";
    });
    
    this.style.backgroundColor = "#cc0000";
    this.style.color = "#fff";
    
    var contentSections = document.querySelectorAll(".content-section");
    contentSections.forEach(function(section) {
      section.style.display = "none";
    });
    
    var selectedContent = document.getElementById(contentId + "-content");
    if (selectedContent) {
      selectedContent.style.display = "flex";
      populateContentCategory(contentId);
    }
  });
});

var abbarItems = document.querySelectorAll(".abbar-item");
abbarItems.forEach(function(item) {
  item.addEventListener("click", function() {
    var contentId = this.getAttribute("data-content");
    
    abbarItems.forEach(function(i) {
      i.style.backgroundColor = "#2a2a2a";
      i.style.color = "#ccc";
      i.classList.remove("active");
    });
    
    this.style.backgroundColor = "#cc0000";
    this.style.color = "#fff";
    this.classList.add("active");
    
    var abContentSections = document.querySelectorAll(".abcontent-section");
    abContentSections.forEach(function(section) {
      section.style.display = "none";
    });
    
    var selectedContent = document.getElementById(contentId + "-content");
    if (selectedContent) {
      selectedContent.style.display = "block"; 
    }
  });
});

window.addEventListener("DOMContentLoaded", function() {
  populateContentCategory("logs");
});

// --- POMODORO TIMER ENGINE ---
var timerInterval;
var timeLeft = 1500; // 25 minutes
var isPaused = true;

function updateDisplay() {
    var minutes = Math.floor(timeLeft / 60);
    var seconds = timeLeft % 60;
    var displayElement = document.querySelector("#timerDisplay");
    if (displayElement) {
        displayElement.innerHTML = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }
}

function startTimer() {
    if (isPaused) {
        isPaused = false;
        timerInterval = setInterval(function() {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timerInterval);
                isPaused = true;
                alert("Training Complete, Warrior!");
            }
        }, 1000);
    }
}

function pauseTimer() {
    isPaused = true;
    clearInterval(timerInterval);
}

function resetTimer() {
    pauseTimer();
    timeLeft = 1500;
    updateDisplay();
}

// --- COFFEE MINDER ENGINE ---
var gargoyleState = 0; 
var coffeeTimer = null;
var TIME_UNTIL_CRACKED = 2700000;  
var TIME_UNTIL_CRUMBLED = 3600000; 

function initCoffeeMinder() {
  var refillBtn = document.querySelector("#refillButton");
  if (!refillBtn) return;

  refillBtn.addEventListener("click", resetCoffeeMinder);
  startMinderTimers();
  updateMinderUI();
}

function startMinderTimers() {
  clearTimeout(coffeeTimer);

  coffeeTimer = setTimeout(function() {
    gargoyleState = 1;
    updateMinderUI();

    coffeeTimer = setTimeout(function() {
      gargoyleState = 2;
      updateMinderUI();
    }, TIME_UNTIL_CRUMBLED - TIME_UNTIL_CRACKED);

  }, TIME_UNTIL_CRACKED);
}

function updateMinderUI() {
  var container = document.querySelector("#gargoyleContainer");
  var statusText = document.querySelector("#minderStatus");
  var btn = document.querySelector("#refillButton");

  if (!container || !statusText) return;

  if (gargoyleState === 0) {
    container.innerHTML = '<img src="gargoyle_happy.png">'; 
    statusText.innerHTML = "He's alive. All systems are go. Keep the Coffee flowing!";
    statusText.style.color = "#4cd964"; 
    btn.innerHTML = "Top Off Elixir";

  } else if (gargoyleState === 1) {
    container.innerHTML = '<img src="gargoyle_cracked.png">'; 
    statusText.innerHTML = "Warning: Are you getting tired? The Gargoyle's stone is cracking.";
    statusText.style.color = "#ffcc00"; 
    btn.innerHTML = "Pour Dark Elixir";

  } else if (gargoyleState === 2) {
    container.innerHTML = '<img src="gargoyle_crumbled.png">'; 
    statusText.innerHTML = "CRITICAL FAIL! The stone has shattered. REFILL COFFEE CUP IMMEDIATELY!";
    statusText.style.color = "#ff3b30"; 
    btn.innerHTML = "RESTORE GARGOYLE";
  }
}

function resetCoffeeMinder() {
  gargoyleState = 0;
  startMinderTimers();
  updateMinderUI();
}

// Kickstart Coffee Minder
initCoffeeMinder();

// Wire up the Coffee Minder specific Close Button
var coffeeCloseBtn = document.querySelector("#coffeeMinderClose");
if (coffeeCloseBtn) {
  coffeeCloseBtn.addEventListener("click", function() {
    document.querySelector("#coffeeMinder").style.display = "none";
  });
}
// --- MUSIC PLAYER ENGINE ---
var audio = document.getElementById("musicPlayerAudio");
var progress = document.getElementById("progress");
var playPauseBtn = document.getElementById("playPauseBtn");
var playPauseIcon = document.getElementById("playPauseIcon");

// Update slider visual fill
function updateSliderBackground() {
    var value = (progress.value / progress.max) * 100;
    progress.style.background = `linear-gradient(to right, #cc0000 ${value}%, #ffffff ${value}%)`;
}

// Sync audio progress
audio.onloadedmetadata = function() {
    progress.max = audio.duration;
};

audio.ontimeupdate = function() {
    progress.value = audio.currentTime;
    updateSliderBackground(); // Update the color fill
};

// Toggle Play/Pause
playPauseBtn.addEventListener("click", function() {
    if (audio.paused) {
        audio.play();
        playPauseIcon.src = "https://cdn-icons-png.flaticon.com/512/727/727242.png";
    } else {
        audio.pause();
        playPauseIcon.src = "https://cdn-icons-png.flaticon.com/512/727/727245.png";
    }
});

// Seek
progress.oninput = function() {
    audio.currentTime = progress.value;
    updateSliderBackground();
};

// --- FINAL INITIALIZATION WIRING ---

// 1. Desktop Icon Grid Setup
var desktopIcons = document.querySelectorAll(".desktop-icon");
desktopIcons.forEach(function(icon) {
  var iconName = icon.textContent.toLowerCase();
  var iconId = icon.id.toLowerCase();
  
  var isSingleClickApp = iconName.includes("calendar") || 
                         iconName.includes("welcome") || 
                         iconId.includes("calendar") || 
                         iconId.includes("welcome");

  if (isSingleClickApp) {
    icon.addEventListener("click", function() { 
      handleIconTap(this);
    });
  } else {
    icon.addEventListener("dblclick", function() { 
      handleIconTap(this);
    });
  }
});

// 2. Wire up the top bar date to open the calendar
var topBarDate = document.querySelector("#calendarOpen");
if (topBarDate) {
    topBarDate.addEventListener("click", function() {
        var calendarApp = document.querySelector("#calendar");
        if (calendarApp) openWindow(calendarApp);
    });
}

// 3. Wire up Timer buttons
var btnStart = document.querySelector("#startTimer");
var btnPause = document.querySelector("#pauseTimer");
var btnReset = document.querySelector("#resetTimer");
if (btnStart) btnStart.addEventListener("click", startTimer);
if (btnPause) btnPause.addEventListener("click", pauseTimer);
if (btnReset) btnReset.addEventListener("click", resetTimer);

// 4. Initialize drag/drop and close buttons for standard windows
function initializeWindow(elementName) {
  var screen = document.querySelector("#" + elementName);
  if (screen) {
    addWindowTapHandling(screen);
    dragElement(screen);
    
    var closeButton = document.querySelector("#" + elementName + "close");
    if (closeButton) {
      closeButton.addEventListener("click", function() {
        closeWindow(screen);
        if (selectedIcon && selectedIcon.getAttribute("data-app") === elementName) {
          selectedIcon.classList.remove("selected");
          selectedIcon = undefined;
        }
      });
    }
  }
}

// 5. Run window init loops
initializeWindow("welcome");
initializeWindow("sidequesttracker");
initializeWindow("aboutme");
initializeWindow("pomodoro");
initializeWindow("calendar");
initializeWindow("coffeeMinder");
initializeWindow("musicPlayer");
