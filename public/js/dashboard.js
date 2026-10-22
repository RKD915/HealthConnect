document.addEventListener('DOMContentLoaded', async () => {
    // Set Header Info
    const user = JSON.parse(localStorage.getItem('user'));
    if(user) {
        document.getElementById('userNameTop').innerText = user.name;
        document.getElementById('userInitial').innerText = user.name.charAt(0).toUpperCase();
    }
    
    document.getElementById('dateSubtitle').innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    try {
        const data = await apiFetch('/dashboard');
        
        const { caloriesConsumed, caloriesBurned, netCalories, remainingCalories } = data.summary;
        const dailyGoal = data.user.dailyCalorieGoal;

        document.getElementById('consumedVal').innerHTML = `${caloriesConsumed} <span style="font-size: 1rem; color: var(--text-light); font-weight: 400;">kcal</span>`;
        document.getElementById('burnedVal').innerHTML = `${caloriesBurned} <span style="font-size: 1rem; color: var(--text-light); font-weight: 400;">kcal</span>`;
        document.getElementById('netCaloriesVal').innerText = netCalories;
        document.getElementById('remCaloriesVal').innerText = remainingCalories;

        // Circular Progress calculation
        let progressPercent = 0;
        if(dailyGoal > 0) {
            progressPercent = (netCalories / dailyGoal) * 100;
        }
        if(progressPercent > 100) progressPercent = 100;
        if(progressPercent < 0) progressPercent = 0;

        const progressCircle = document.getElementById('calorieProgress');
        progressCircle.style.background = `conic-gradient(var(--primary) ${progressPercent * 3.6}deg, #f3f4f6 0deg)`;

        // AI Tip
        if(data.tip) {
            document.getElementById('aiTipContainer').style.display = 'flex';
            document.getElementById('aiTipText').innerText = data.tip;
        }

    } catch (err) {
        console.error("Dashboard error:", err);
    }
});
