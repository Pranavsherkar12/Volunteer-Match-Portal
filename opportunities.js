//  fetch opportunities by category filter
async function fetchOpportunities(category = '') {
    try {
        const url = category ? `http://localhost:3200/opportunities?category=${category}` : 'http://localhost:3200/opportunities';
        const response = await fetch(url);

        if (!response.ok) throw new Error('Failed to fetch opportunities');

        const opportunities = await response.json();
        displayOpportunities(opportunities);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('opportunities-container').innerHTML = "<p><b><center>Error loading opportunities</center><b></p>";
    }
}

// function to display opportunities as cards
function displayOpportunities(opportunities) {
    const container = document.getElementById('opportunities-container');
    container.innerHTML = ''; // Clear existing content

    opportunities.forEach(opportunity => {
        const card = document.createElement('div');
        card.className = 'col-md-4';

        card.innerHTML = `
        <div class="card shadow-sm">
            <img src="Img/${opportunity.image}" class="card-img-top" >
            <div class="card-body">
                <h5 class="card-title">${opportunity.title}</h5>
                <p class="card-text">${opportunity.description}</p>
                <div class="d-flex justify-content-between"> <!-- Add flex container -->
                    <button class="btn btn-primary me-3" onclick="openEditModal(${opportunity.id}, '${opportunity.title}', '${opportunity.description}', '${opportunity.category}', '${opportunity.location}', '${opportunity.date}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteOpportunity(${opportunity.id})">Delete</button>
                </div>
            </div>
        </div>
        `;
    
        container.appendChild(card);
    });
}

// function to open the edit modal and populate it with current data
function openEditModal(id, title, description, category, location, date) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-title').value = title;
    document.getElementById('edit-description').value = description;
    document.getElementById('edit-category').value = category;
    document.getElementById('edit-location').value = location;
    document.getElementById('edit-date').value = date;
    new bootstrap.Modal(document.getElementById('editModal')).show();
}

// function to submit the updated opportunity data
async function updateOpportunity() {
    const id = document.getElementById('edit-id').value;
    const data = {
        title: document.getElementById('edit-title').value,
        description: document.getElementById('edit-description').value,
        category: document.getElementById('edit-category').value,
        location: document.getElementById('edit-location').value,
        date: document.getElementById('edit-date').value,
    };

    try {
        const response = await fetch(`http://localhost:3200/update-opportunity/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Opportunity updated successfully');
            fetchOpportunities();  // Refresh the list
        } else {
            const result = await response.json();
            alert(result.message || 'Error updating opportunity');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error updating opportunity');
    }
}

// Function to delete an opportunity by ID
async function deleteOpportunity(id) {
    try {
        const response = await fetch(`http://localhost:3200/delete-opportunity/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Opportunity deleted successfully');
            fetchOpportunities();  // Fetch updated list of opportunities
        } else {
            const result = await response.json();
            alert(result.message || 'Error deleting opportunity');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting opportunity');
    }
}

// fetch by categories 
async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:3200/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');

        const categories = await response.json();
        const categorySelect = document.getElementById('categoryInput');

        // Clear existing options except "All"
        categorySelect.innerHTML = '<option value="">All</option>';

   
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Call fetchCategories and fetchOpportunities once on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    fetchOpportunities();
});

// Trigger category filtering when the dropdown changes
const categoryInput = document.getElementById('categoryInput');
categoryInput.addEventListener('change', () => {
    const category = categoryInput.value;
    fetchOpportunities(category);
});



