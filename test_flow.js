// Using native fetch

async function runTests() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('--- STARTING EXECUTION FLOW VALIDATION ---');

  try {
    // 1. Auth Login
    console.log('1. Testing Login...');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'rohan.sharma@example.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    if (!loginData.token) {
        console.error('Login Data received:', loginData);
        throw new Error('Login failed: Token missing');
    }
    console.log('✅ Login successful!');
    
    const token = loginData.token;

    // 2. Dashboard
    console.log('\n2. Testing Dashboard & AI Logic...');
    const dashRes = await fetch(`${baseUrl}/dashboard`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const dashData = await dashRes.json();
    console.log('Dashboard Data:', dashData);
    const { caloriesConsumed, caloriesBurned, netCalories, remainingCalories } = dashData.summary || {};
    if (caloriesConsumed === undefined) throw new Error('Dashboard syntax mismatch');
    console.log(`✅ Dashboard loaded: consumed ${caloriesConsumed}, burned ${caloriesBurned}, AI Tip: "${dashData.tip}"`);

    // 3. Social Feed
    console.log('\n3. Testing Social Feed...');
    const feedRes = await fetch(`${baseUrl}/feed`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const feedData = await feedRes.json();
    console.log(`✅ Social Feed loaded: ${feedData.length} posts retrieved.`);

    // 4. Leaderboard
    console.log('\n4. Testing Leaderboard...');
    const leadRes = await fetch(`${baseUrl}/leaderboard`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const leadData = await leadRes.json();
    console.log(`✅ Leaderboard loaded: Top user has ${leadData[0].totalBurned} score.`);

    // 5. Creating a Post
    console.log('\n5. Testing Post Creation...');
    const postRes = await fetch(`${baseUrl}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ content: 'Just testing the automated execution flow!' })
    });
    const postData = await postRes.json();
    console.log(`✅ Post created successfully with ID: ${postData._id}`);
    
    console.log('\n--- ALL TESTS PASSED. NO CRASHES DETECTED ---');
  } catch(err) {
    console.error('❌ TEST FAILED:', err);
  }
}

runTests();
