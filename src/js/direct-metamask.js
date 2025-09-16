// Direct MetaMask connector script
window.addEventListener('DOMContentLoaded', async function() {
    console.log('Direct MetaMask connector loaded');
    
    // Create a prominent connect button
    const connectButton = document.createElement('button');
    connectButton.textContent = 'Connect MetaMask';
    connectButton.style.position = 'fixed';
    connectButton.style.top = '20px';
    connectButton.style.right = '20px';
    connectButton.style.zIndex = '9999';
    connectButton.style.padding = '12px 20px';
    connectButton.style.backgroundColor = '#4CAF50';
    connectButton.style.color = 'white';
    connectButton.style.border = 'none';
    connectButton.style.borderRadius = '5px';
    connectButton.style.cursor = 'pointer';
    connectButton.style.fontWeight = 'bold';
    connectButton.style.fontSize = '16px';
    connectButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    
    // Add click handler
    connectButton.addEventListener('click', async function() {
        try {
            // Check if MetaMask is installed
            if (typeof window.ethereum === 'undefined') {
                alert('MetaMask is not installed. Please install MetaMask to use this application.');
                return;
            }
            
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            if (accounts.length > 0) {
                console.log('Connected to MetaMask:', accounts[0]);
                
                // Update button
                connectButton.textContent = 'Connected: ' + accounts[0].substring(0, 6) + '...' + accounts[0].substring(38);
                connectButton.style.backgroundColor = '#2196F3';
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.style.position = 'fixed';
                successMessage.style.top = '80px';
                successMessage.style.right = '20px';
                successMessage.style.zIndex = '9999';
                successMessage.style.padding = '15px';
                successMessage.style.backgroundColor = 'rgba(76, 175, 80, 0.9)';
                successMessage.style.color = 'white';
                successMessage.style.borderRadius = '5px';
                successMessage.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                successMessage.textContent = 'Successfully connected to MetaMask!';
                document.body.appendChild(successMessage);
                
                // Remove success message after 3 seconds
                setTimeout(function() {
                    successMessage.style.opacity = '0';
                    successMessage.style.transition = 'opacity 0.5s';
                    setTimeout(function() {
                        document.body.removeChild(successMessage);
                    }, 500);
                }, 3000);
                
                // Update status in the UI
                const statusElement = document.getElementById('metamask-status');
                if (statusElement) {
                    statusElement.textContent = 'Connected to MetaMask: ' + accounts[0];
                    statusElement.style.color = '#4CAF50';
                }
                
                // Get network information
                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                let networkName = 'Unknown Network';
                
                switch (chainId) {
                    case '0x1':
                        networkName = 'Ethereum Mainnet';
                        break;
                    case '0x3':
                        networkName = 'Ropsten Testnet';
                        break;
                    case '0x4':
                        networkName = 'Rinkeby Testnet';
                        break;
                    case '0x5':
                        networkName = 'Goerli Testnet';
                        break;
                    case '0x539':
                        networkName = 'Ganache Local';
                        break;
                    default:
                        networkName = 'Local Network (' + chainId + ')';
                }
                
                const networkElement = document.getElementById('network-info');
                if (networkElement) {
                    networkElement.textContent = 'Connected to: ' + networkName;
                    networkElement.style.color = '#2196F3';
                }
            }
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            alert('Error connecting to MetaMask: ' + error.message);
        }
    });
    
    // Add button to page
    document.body.appendChild(connectButton);
    
    // Try to get accounts without prompting
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                console.log('Already connected to MetaMask:', accounts[0]);
                connectButton.textContent = 'Connected: ' + accounts[0].substring(0, 6) + '...' + accounts[0].substring(38);
                connectButton.style.backgroundColor = '#2196F3';
                
                // Update status in the UI
                const statusElement = document.getElementById('metamask-status');
                if (statusElement) {
                    statusElement.textContent = 'Connected to MetaMask: ' + accounts[0];
                    statusElement.style.color = '#4CAF50';
                }
            }
        } catch (error) {
            console.error('Error checking MetaMask connection:', error);
        }
    }
});
