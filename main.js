// Toggle visibility of project content
const toggleButton = document.querySelector('#toggle-button');
const projectContent = document.querySelector('#projects-content');

toggleButton.addEventListener('click', () => {
    if (projectContent.style.display === 'none' || projectContent.style.display === '') {
        projectContent.style.display = 'block';
        toggleButton.textContent = 'Hide Project Details';
    } else {
        projectContent.style.display = 'none';
        toggleButton.textContent = 'Show Project Details';
    }
});

// Navigate to assignment2.html when the button is clicked
const assignment2Button = document.querySelector('#assignment2');

assignment2Button.addEventListener('click', () => {
    window.location.href = 'assignment2.html'; // Redirect to assignment2.html
});

// Navigate to assignment3.html when the button is clicked
const assignment3Button = document.querySelector('#assignment3');

assignment3Button.addEventListener('click', () => {
    window.location.href = 'assignment3.html'; // Redirect to assignment3.html
});

// Image sources for each project
const images = {
    'volt-legacy': ['images/volt1.png', 'images/volt2.png', 'images/volt3.png', 'images/volt4.png', 'images/volt5.png'],
    'controlled-chaos': ['images/chaos1.jpg', 'images/chaos2.png', 'images/chaos3.jpg']
};

// Counters to track the current image for each project
const imageCounters = {
    'volt-legacy': 0,
    'controlled-chaos': 0
};

// Function to show the previous image
function prevImage(project) {
    imageCounters[project] = (imageCounters[project] - 1 + images[project].length) % images[project].length;
    document.getElementById(`${project}-img`).src = images[project][imageCounters[project]];
}
  
// Function to show the next image
function nextImage(project) {
    imageCounters[project] = (imageCounters[project] + 1) % images[project].length;
    document.getElementById(`${project}-img`).src = images[project][imageCounters[project]];
}
