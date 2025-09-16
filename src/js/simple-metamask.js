// Simple MetaMask connector
window.addEventListener('DOMContentLoaded', function() {
    // Create connect button
    const connectBtn = document.createElement('button');
    connectBtn.textContent = 'Connect MetaMask';
    connectBtn.style.position = 'fixed';
    connectBtn.style.top = '10px';
    connectBtn.style.right = '10px';
    connectBtn.style.zIndex = '9999';
    connectBtn.style.padding = '10px 15px';
    connectBtn.style.backgroundColor = '#4CAF50';
    connectBtn.style.color = 'white';
    connectBtn.style.border = 'none';
    connectBtn.style.borderRadius = '5px';
    connectBtn.style.cursor = 'pointer';
    
    // Add click handler
    connectBtn.addEventListener('click', async function() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request account access
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                console.log('Connected to MetaMask:', accounts[0]);
                connectBtn.textContent = 'Connected: ' + accounts[0].substring(0, 6) + '...' + accounts[0].substring(38);
                connectBtn.style.backgroundColor = '#2196F3';
                
                // Refresh page to update interface
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (error) {
                console.error('Error connecting to MetaMask:', error);
                alert('Error connecting to MetaMask: ' + error.message);
            }
        } else {
            alert('MetaMask is not installed. Please install MetaMask to use this application.');
        }
    });
    
    // Add to page
    document.body.appendChild(connectBtn);
});
