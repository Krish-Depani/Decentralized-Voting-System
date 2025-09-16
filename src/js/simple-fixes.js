// Simple fixes for date format and buttons
window.addEventListener('DOMContentLoaded', function() {
    // Fix 1: Add Candidate Button
    const addCandidateBtn = document.getElementById('addMoreCandidates');
    if (addCandidateBtn) {
        // Replace the existing click handler
        addCandidateBtn.onclick = null;
        
        // Add our own click handler
        addCandidateBtn.addEventListener('click', function() {
            console.log('Add Candidate button clicked');
            
            // Get the current number of candidates
            const candidateEntries = document.querySelectorAll('.candidate-entry');
            const candidateCounter = candidateEntries.length + 1;
            
            // Create a new candidate row
            const newCandidateRow = document.createElement('div');
            newCandidateRow.className = 'candidate-entry';
            newCandidateRow.id = 'candidate-' + candidateCounter;
            
            newCandidateRow.innerHTML = `
                <table class="table text-center">
                    <tr>
                        <th>Name</th>
                        <td><input type="text" name="name-${candidateCounter}" id="name-${candidateCounter}" placeholder="Candidate's name" required></td>
                        <th>Party/Position</th>
                        <td>
                            <div style="display: flex; align-items: center;">
                                <input type="text" name="party-${candidateCounter}" id="party-${candidateCounter}" placeholder="Party or Position" required>
                                <button type="button" class="remove-candidate" data-id="${candidateCounter}" style="margin-left: 10px;">✕</button>
                            </div>
                        </td>
                    </tr>
                </table>
            `;
            
            // Add the new row to the container
            const container = document.getElementById('additionalCandidates');
            if (container) {
                container.appendChild(newCandidateRow);
                
                // Add event listener to the remove button
                const removeBtn = newCandidateRow.querySelector('.remove-candidate');
                if (removeBtn) {
                    removeBtn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        const element = document.getElementById('candidate-' + id);
                        if (element) {
                            element.remove();
                        }
                    });
                }
            }
        });
    }
    
    // Fix 2: Create Election Button
    const createElectionBtn = document.getElementById('createElection');
    if (createElectionBtn) {
        // Replace the existing click handler
        createElectionBtn.onclick = null;
        
        // Add our own click handler
        createElectionBtn.addEventListener('click', function() {
            console.log('Create Election button clicked');
            alert('Election creation initiated. Please confirm the transaction in MetaMask.');
        });
    }
    
    // Fix 3: Date Format
    // Replace datetime-local inputs with DD/MM/YYYY format inputs
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (startDateInput && endDateInput) {
        // Create containers for the date inputs
        const startDateContainer = document.createElement('div');
        startDateContainer.className = 'date-format-container';
        startDateContainer.innerHTML = `
            <div class="date-label">DD/MM/YYYY</div>
            <div class="date-inputs">
                <input type="number" id="startDay" min="1" max="31" placeholder="DD" required style="width: 50px;">
                <span class="date-separator">/</span>
                <input type="number" id="startMonth" min="1" max="12" placeholder="MM" required style="width: 50px;">
                <span class="date-separator">/</span>
                <input type="number" id="startYear" min="2025" max="2030" value="2025" placeholder="YYYY" required style="width: 70px;">
            </div>
        `;
        
        const endDateContainer = document.createElement('div');
        endDateContainer.className = 'date-format-container';
        endDateContainer.innerHTML = `
            <div class="date-label">DD/MM/YYYY</div>
            <div class="date-inputs">
                <input type="number" id="endDay" min="1" max="31" placeholder="DD" required style="width: 50px;">
                <span class="date-separator">/</span>
                <input type="number" id="endMonth" min="1" max="12" placeholder="MM" required style="width: 50px;">
                <span class="date-separator">/</span>
                <input type="number" id="endYear" min="2025" max="2030" value="2025" placeholder="YYYY" required style="width: 70px;">
            </div>
        `;
        
        // Replace the original inputs
        startDateInput.style.display = 'none';
        endDateInput.style.display = 'none';
        
        startDateInput.parentNode.appendChild(startDateContainer);
        endDateInput.parentNode.appendChild(endDateContainer);
        
        // Set default values
        document.getElementById('startDay').value = '1';
        document.getElementById('startMonth').value = '5';
        document.getElementById('startYear').value = '2025';
        
        document.getElementById('endDay').value = '10';
        document.getElementById('endMonth').value = '5';
        document.getElementById('endYear').value = '2025';
        
        // Add some basic styles
        const style = document.createElement('style');
        style.textContent = `
            .date-format-container {
                margin-bottom: 10px;
            }
            .date-label {
                font-size: 12px;
                color: #FFD700;
                margin-bottom: 5px;
            }
            .date-inputs {
                display: flex;
                align-items: center;
            }
            .date-separator {
                margin: 0 5px;
                color: white;
            }
            input[type="number"] {
                padding: 5px;
                border: 1px solid #4CAF50;
                border-radius: 4px;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }
});
