const { test, before, describe } = require('node:test');
const assert = require('node:assert');

// Adjust this if your API is hosted elsewhere or on a different port.
const BASE_URL = 'http://localhost:3000/api';

/**
 * Helper to get the current user's balance.
 * @param {string} authToken - The user's JWT.
 * @returns {Promise<number>} The user's balance.
 */
const getUserBalance = async (authToken) => {
    const res = await fetch(`${BASE_URL}/balance`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
    });
    const data = await res.json();
    return data.balance;
};

describe('Doubling Game API', async () => {
    let username;
    let password;
    let token;

    before(() => {
        username = `testuser_${Date.now()}`;
        password = 'password123';
        console.log(`\n--- Starting tests for user: ${username} ---`);
    });

    describe('Authentication', () => {
        test('should register a new user successfully', async () => {
            const res = await fetch(`${BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            assert.strictEqual(res.status, 201, 'Registration should return 201 Created');
            const data = await res.json();
            assert.ok(data.id, 'Response should contain a user ID');
        });

        test('should log in the new user and get a token', async () => {
            const res = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            assert.strictEqual(res.status, 200, 'Login should return 200 OK');
            const data = await res.json();
            assert.ok(data.token, 'Response should contain a JWT token');
            token = data.token;
        });
    });

    describe('Initial User State', () => {
        test('should fetch the initial balance for a new user (GET /api/balance)', async () => {
            const balance = await getUserBalance(token);
            assert.strictEqual(typeof balance, 'number', 'Balance should be a number');
            // Assuming new users start with a balance of 1000. Adjust if this value is different.
            assert.strictEqual(balance, 10000, 'New user initial balance should be 10000');
            console.log(`\nInitial balance check successful. Balance: ${balance}`);
        });

        test('should fetch an empty list of rounds for a new user (GET /api/rounds)', async () => {
            const res = await fetch(`${BASE_URL}/rounds`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            assert.strictEqual(res.status, 200, 'Fetching rounds list should be successful');
            const data = await res.json();
            console.log(data);
            assert.ok(Array.isArray(data.rounds), 'Response should contain a "rounds" array');
            assert.strictEqual(data.rounds.length, 0, 'New user should have no rounds');
            console.log('Initial rounds list check successful. Found 0 rounds.');
        });
    });

    describe('Gameplay Scenarios', () => {
        let winWinClaimCovered = false;
        let lossCovered = false;

        test('should cover both a winning streak and a loss scenario by repeating rounds', async () => {
            const maxRounds = 30; // Safety break to prevent infinite loops

            for (let i = 1; i <= maxRounds && (!winWinClaimCovered || !lossCovered); i++) {
                console.log(`\n--- Starting Game Round #${i} ---`);
                const initialBet = 100;

                // 1. Start a new round
                const balanceBefore = await getUserBalance(token);
                const roundRes = await fetch(`${BASE_URL}/rounds`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ initialBet }),
                });
                assert.strictEqual(roundRes.status, 201, `Round #${i}: Starting round should be successful`);
                const roundId = (await roundRes.json()).round.id;
                const balanceAfterBet = await getUserBalance(token);
                assert.strictEqual(balanceAfterBet, balanceBefore - initialBet, `Round #${i}: Balance should decrease by initial bet`);

                // 2. First Bet
                const bet1Res = await fetch(`${BASE_URL}/rounds/${roundId}/bet`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ betSymbol: 'HIGH' }),
                });
                const bet1Data = await bet1Res.json();

                if (!bet1Data.bet.correct && !lossCovered) {
                    // --- LOSS SCENARIO ---
                    console.log(`Round #${i}: Achieved LOSS scenario.`);
                    lossCovered = true;

                    // Verify round is closed
                    const closedRoundRes = await fetch(`${BASE_URL}/rounds/${roundId}`, { headers: { 'Authorization': `Bearer ${token}` } });
                    const closedRoundData = await closedRoundRes.json();
                    assert.strictEqual(closedRoundData.stateOpen, false, 'Round should be closed after a loss');

                    // Verify betting on a closed round is forbidden
                    const betOnClosedRes = await fetch(`${BASE_URL}/rounds/${roundId}/bet`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ betSymbol: 'HIGH' }),
                    });
                    assert.strictEqual(betOnClosedRes.status, 400, 'Betting on a closed round should fail');
                    continue; // Move to the next round
                }

                if (bet1Data.bet.correct && !winWinClaimCovered) {
                    // Potential Win-Win-Claim. Let's try a second bet.
                    console.log(`Round #${i}: First bet was a WIN. Attempting second bet...`);

                    // 3. Second Bet
                    const bet2Res = await fetch(`${BASE_URL}/rounds/${roundId}/bet`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ betSymbol: 'HIGH' }),
                    });
                    const bet2Data = await bet2Res.json();

                    if (bet2Data.bet.correct) {
                        // --- WIN-WIN-CLAIM SCENARIO ---
                        console.log(`Round #${i}: Second bet was a WIN. Achieved WIN-WIN-CLAIM scenario.`);
                        winWinClaimCovered = true;

                        // 4. Claim
                        const balanceBeforeClaim = await getUserBalance(token);
                        const claimRes = await fetch(`${BASE_URL}/rounds/${roundId}/claim`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        });
                        assert.strictEqual(claimRes.status, 200, 'Claiming should be successful');
                        const claimData = await claimRes.json();
                        assert.ok(claimData.roundWin > 0, 'roundWin should be greater than 0');

                        // Verify the round is now closed by fetching it again
                        const finalRoundStateRes = await fetch(`${BASE_URL}/rounds/${roundId}`, {
                            headers: { 'Authorization': `Bearer ${token}` },
                        });
                        const finalRoundStateData = await finalRoundStateRes.json();
                        assert.strictEqual(finalRoundStateData.stateOpen, false, 'Round should be closed after claiming');

                        const balanceAfterClaim = await getUserBalance(token);
                        assert.strictEqual(balanceAfterClaim, balanceBeforeClaim + claimData.roundWin, 'Balance should increase by the claimed amount');
                        console.log(`Claimed ${claimData.roundWin}. Balance increased to ${balanceAfterClaim}.`);
                        continue; // Move to the next round
                    }
                }
            }

            // Final check to ensure both scenarios were eventually covered
            assert.ok(winWinClaimCovered, 'The "Win-Win-Claim" scenario was not covered within the loop limit.');
            assert.ok(lossCovered, 'The "Loss" scenario was not covered within the loop limit.');
        });
    });
});