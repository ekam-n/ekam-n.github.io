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

// Navigate to visualizations.html when the button is clicked
const visualizationsButton = document.querySelector('#visualizations');

visualizationsButton.addEventListener('click', () => {
    window.location.href = 'visualizations.html'; // Redirect to visualizations.html
});
