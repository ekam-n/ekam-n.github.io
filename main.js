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
