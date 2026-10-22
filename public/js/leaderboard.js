document.addEventListener('DOMContentLoaded', async () => {
    try {
        const board = await apiFetch('/leaderboard');
        const list = document.getElementById('leaderboardList');
        list.innerHTML = '';
        
        board.forEach((entry, index) => {
            let rankClass = '';
            let rankIcon = '';
            if(index === 0) { rankClass = 'color: #fbbf24;'; rankIcon = '<i class="fa-solid fa-medal"></i>'; }
            else if(index === 1) { rankClass = 'color: #9ca3af;'; rankIcon = '<i class="fa-solid fa-medal"></i>'; }
            else if(index === 2) { rankClass = 'color: #b45309;'; rankIcon = '<i class="fa-solid fa-medal"></i>'; }
            else { rankClass = 'color: var(--text-light); font-weight: bold;'; rankIcon = `#${index + 1}`; }

            const div = document.createElement('div');
            div.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 1rem; border-bottom: 1px solid #e5e7eb;";
            
            div.innerHTML = `
                <div style="display: flex; gap: 1.5rem; align-items: center;">
                    <div style="${rankClass} font-size: 1.5rem; width: 30px; text-align: center;">${rankIcon}</div>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--secondary); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid var(--primary);">
                            ${entry.user ? entry.user.name.charAt(0) : 'U'}
                        </div>
                        <h3 style="margin: 0;">${entry.user ? entry.user.name : 'Unknown User'}</h3>
                    </div>
                </div>
                <div style="font-weight: bold; color: var(--accent); font-size: 1.25rem;">
                    ${entry.totalBurned} <span style="font-size: 0.9rem; color: var(--text-light); font-weight: normal;">kcal burned</span>
                </div>
            `;
            list.appendChild(div);
        });

    } catch(err) { console.error(err); }
});
