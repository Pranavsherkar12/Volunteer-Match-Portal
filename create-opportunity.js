// document.getElementById('opportunityForm').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     // Validation for title, description, and category
//     const title = document.getElementById('title').value.trim();
//     const description = document.getElementById('description').value.trim();
//     const category = document.getElementById('category').value.trim();
//     const location = document.getElementById('location').value.trim();
//     const date = document.getElementById('date').value;

//     // Title should be at least 3 characters
//     if (title.length < 3) {
//         alert("Title must be at least 3 characters long.");
//         return;
//     }

//     // Description should have at least 5 words
//     const wordCount = description.split(/\s+/).filter(word => word.length > 0).length;
//     if (wordCount < 5) {
//         alert("Description must contain at least 5 words.");
//         return;
//     }

//     // Category should be at least 3 characters
//     if (category.length < 3) {
//         alert("Category must be at least 3 characters long.");
//         return;
//     }

//     // Check that the date is in the future
//     const selectedDate = new Date(date);
//     const currentDate = new Date();
//     if (selectedDate <= currentDate) {
//         alert("Please enter a future date for the opportunity.");
//         return;
//     }

//     // If all validation passes, create data object
//     const data = { title, description, category, location, date };

//     // Submit the form data to the server
//     try {
//         const response = await fetch('http://localhost:3200/create-opportunity', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(data),
//         });

//         const result = await response.json();
//         if (response.ok) {
//             alert(result.message);
//             document.getElementById('opportunityForm').reset(); // Clear the form
//         } else {
//             alert(`Error: ${result.message}`);
//         }
//     } catch (error) {
//         console.error('Error submitting opportunity:', error);
//     }
// });


document.getElementById('opportunityForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get the isUpdate value to know if we are creating or updating
    const isUpdate = document.getElementById('isUpdate').value === 'true';

    // Validation
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value.trim();
    const date = document.getElementById('date').value;

    // Validate title, description, and category based on minimum length
    if (title.length < 5) {
        alert("Title must be at least 3 characters long.");
        return;
    }
    if (description.split(" ").length < 5) {
        alert("Description must contain at least 5 words.");
        return;
    }
    if (category.length < 3) {
        alert("Category must be at least 3 characters long.");
        return;
    }

    // Check that the date is in the future
    const selectedDate = new Date(date);
    const currentDate = new Date();
    if (selectedDate <= currentDate) {
        alert("Please enter a future date for the opportunity.");
        return; 
    }

    // Create data object
    const data = {
        title,
        description,
        category,
        location: document.getElementById('location').value,
        date,
    };

    // Submit the form data to the server
    try {
        const endpoint = isUpdate ? 'http://localhost:3200/update-opportunity' : 'http://localhost:3200/create-opportunity';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            document.getElementById('opportunityForm').reset(); // Clears form
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error submitting opportunity:', error);
    }
});
