document.addEventListener('DOMContentLoaded', async () => {
    const fetchWorkouts = async () => {
        try {
            const workouts = await apiFetch('/workouts');
            const list = document.getElementById('workoutsList');
            list.innerHTML = '';
            
            if(workouts.length === 0) {
                list.innerHTML = '<p style="color: var(--text-light);">No activity logged yet.</p>';
                return;
            }

            workouts.forEach(workout => {
                const div = document.createElement('div');
                div.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px;";
                const date = new Date(workout.createdAt).toLocaleDateString();
                
                div.innerHTML = `
                    <div style="display: flex; gap: 1rem; align-items: center;">
                        <div style="background-color: rgba(78,205,196,0.1); color: var(--accent); width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <i class="fa-solid fa-person-running"></i>
                        </div>
                        <div>
                            <h4 style="margin: 0;">${workout.type}</h4>
                            <p style="margin: 0; font-size: 0.85rem; color: var(--text-light);">${workout.duration} mins • ${date}</p>
                        </div>
                    </div>
                    <div>
                        <h4 style="margin: 0; color: var(--text-dark);">${workout.caloriesBurned} kcal</h4>
                    </div>
                `;
                list.appendChild(div);
            });
        } catch (err) {
            console.error(err);
        }
    };

    fetchWorkouts();

    document.getElementById('addWorkoutForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const type = document.getElementById('workoutType').value;
        const duration = parseInt(document.getElementById('workoutDuration').value);
        const caloriesBurned = parseInt(document.getElementById('workoutCalories').value);

        try {
            await apiFetch('/workouts', {
                method: 'POST',
                body: JSON.stringify({ type, duration, caloriesBurned })
            });
            document.getElementById('addWorkoutForm').reset();
            fetchWorkouts();
        } catch (err) {
            alert(err.message);
        }
    });
});
