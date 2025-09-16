// MetaMask Connector Script
window.addEventListener('DOMContentLoaded', async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed. Please install MetaMask to use this application.');
        return;
    }

    // Add a visible connect button
    const connectButton = document.createElement('button');
    connectButton.id = 'metamask-connect';
    connectButton.className = 'btn-primary';
    connectButton.innerHTML = '<i class="fas fa-wallet"></i> Connect MetaMask';
    connectButton.style.position = 'fixed';
    connectButton.style.top = '10px';
    connectButton.style.right = '10px';
    connectButton.style.zIndex = '9999';
    document.body.appendChild(connectButton);

    // Connect to MetaMask when the button is clicked
    connectButton.addEventListener('click', async () => {
        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Connected accounts:', accounts);
            
            if (accounts.length > 0) {
                connectButton.innerHTML = `<i class="fas fa-check-circle"></i> Connected: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
                connectButton.style.backgroundColor = '#4CAF50';
                
                // Reload the page to initialize the application with the connected account
                window.location.reload();
            }
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            alert('Error connecting to MetaMask: ' + error.message);
        }
    });

    // Try to connect automatically
    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            console.log('Already connected to account:', accounts[0]);
            connectButton.innerHTML = `<i class="fas fa-check-circle"></i> Connected: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
            connectButton.style.backgroundColor = '#4CAF50';
        }
    } catch (error) {
        console.error('Error checking MetaMask connection:', error);
    }
});
