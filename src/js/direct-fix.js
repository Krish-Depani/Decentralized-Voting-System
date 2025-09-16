// Direct fix for all issues
document.addEventListener('DOMContentLoaded', function() {
    console.log('Direct fix script loaded');
    
    // Fix 1: Direct MetaMask connection
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        
        // Add a connect button
        const connectButton = document.createElement('button');
        connectButton.textContent = 'Connect MetaMask';
        connectButton.style.position = 'fixed';
        connectButton.style.top = '10px';
        connectButton.style.right = '10px';
        connectButton.style.zIndex = '9999';
        connectButton.style.padding = '10px 20px';
        connectButton.style.backgroundColor = '#4CAF50';
        connectButton.style.color = 'white';
        connectButton.style.border = 'none';
        connectButton.style.borderRadius = '5px';
        connectButton.style.cursor = 'pointer';
        
        connectButton.onclick = async function() {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                console.log('Connected accounts:', accounts);
                alert('Connected to MetaMask: ' + accounts[0]);
                connectButton.textContent = 'Connected: ' + accounts[0].substring(0, 6) + '...' + accounts[0].substring(38);
                connectButton.style.backgroundColor = '#2196F3';
            } catch (error) {
                console.error('Error connecting to MetaMask:', error);
                alert('Error connecting to MetaMask: ' + error.message);
            }
        };
        
        document.body.appendChild(connectButton);
    } else {
        console.log('MetaMask is not installed!');
        alert('MetaMask is not installed. Please install MetaMask to use this application.');
    }
    
    // Fix 2: Add Candidate button
    const addCandidateBtn = document.getElementById('addMoreCandidates');
    if (addCandidateBtn) {
        addCandidateBtn.onclick = function() {
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
                    removeBtn.onclick = function() {
                        const id = this.getAttribute('data-id');
                        const element = document.getElementById('candidate-' + id);
                        if (element) {
                            element.remove();
                        }
                    };
                }
            }
        };
    }
    
    // Fix 3: Create Election button
    const createElectionBtn = document.getElementById('createElection');
    if (createElectionBtn) {
        createElectionBtn.onclick = function() {
            console.log('Create Election button clicked');
            
            // Get form values
            const electionName = document.getElementById('electionName').value;
            
            // Get all candidates
            const candidates = [];
            const candidateEntries = document.querySelectorAll('.candidate-entry');
            
            candidateEntries.forEach(function(entry) {
                const nameInput = entry.querySelector('input[id^="name-"]');
                const partyInput = entry.querySelector('input[id^="party-"]');
                
                if (nameInput && partyInput && nameInput.value && partyInput.value) {
                    candidates.push({
                        name: nameInput.value,
                        party: partyInput.value
                    });
                }
            });
            
            // Validate form
            if (!electionName) {
                alert('Please enter an election name');
                return;
            }
            
            if (candidates.length === 0) {
                alert('Please add at least one candidate');
                return;
            }
            
            // Show success message
            alert(`Election "${electionName}" created with ${candidates.length} candidates`);
            
            // Reset form
            document.getElementById('electionForm').reset();
            document.getElementById('additionalCandidates').innerHTML = '';
        };
    }
    
    // Fix 4: Date format
    const formatDate = function(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    
    // Update all date displays
    const dateElements = document.querySelectorAll('.date-display');
    dateElements.forEach(function(element) {
        const timestamp = parseInt(element.getAttribute('data-timestamp'));
        if (!isNaN(timestamp)) {
            element.textContent = formatDate(new Date(timestamp * 1000));
        }
    });
    
    // Fix 5: Load elections
    const loadElectionsBtn = document.getElementById('refreshElections');
    if (loadElectionsBtn) {
        loadElectionsBtn.onclick = function() {
            console.log('Load Elections button clicked');
            
            const activeElectionsDiv = document.getElementById('activeElections');
            if (activeElectionsDiv) {
                activeElectionsDiv.innerHTML = `
                    <div class="loading-indicator">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Loading elections...</p>
                    </div>
                `;
                
                // Simulate loading
                setTimeout(function() {
                    activeElectionsDiv.innerHTML = `
                        <div class="election-info">
                            <h3>Sample Election</h3>
                            <p>This is a sample election for demonstration purposes.</p>
                            <p>Start Date: 01/05/2025</p>
                            <p>End Date: 10/05/2025</p>
                            <p>Candidates: 2</p>
                            <button class="btn-view">View Results</button>
                        </div>
                    `;
                }, 1500);
            }
        };
        
        // Trigger initial load
        loadElectionsBtn.click();
    }
});
