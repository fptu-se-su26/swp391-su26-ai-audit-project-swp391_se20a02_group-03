// Simple Node.js script to run blackbox tests against the API
const baseUrl = 'http://localhost:5242/api';

async function runTests() {
    console.log('--- Starting BlackBox Tests ---');
    try {
        console.log('\n[1] Testing GET /Courts (List Courts)...');
        const courtsResponse = await fetch(`${baseUrl}/Courts`);
        const courtsResult = await courtsResponse.json();
        
        if (courtsResponse.ok && Array.isArray(courtsResult.data)) {
            console.log(`✅ Success. Found ${courtsResult.data.length} courts.`);
        } else {
            console.log(`❌ Failed. Expected array, got:`, courtsResult);
        }

        console.log('\n[2] Testing GET /Matches/available (List Open Matches)...');
        const matchesResponse = await fetch(`${baseUrl}/Matches/available`);
        const matchesResult = await matchesResponse.json();
        
        if (matchesResponse.ok) {
            console.log(`✅ Success. Available matches fetched.`);
        } else {
            console.log(`❌ Failed. HTTP ${matchesResponse.status}`);
        }
        
        // Note: For fully testing POST/PUT actions, we need Auth tokens. 
        // A complete E2E would log in and execute state changes.
        // For this audit validation script, basic connectivity is checked.
        
        console.log('\n--- BlackBox Tests Completed ---');
    } catch (err) {
        console.error('Error during BlackBox Tests:', err);
    }
}

runTests();
