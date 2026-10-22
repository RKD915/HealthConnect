document.addEventListener('DOMContentLoaded', async () => {
    const fetchMeals = async () => {
        try {
            const meals = await apiFetch('/meals');
            const list = document.getElementById('mealsList');
            list.innerHTML = '';
            
            if(meals.length === 0) {
                list.innerHTML = '<p style="color: var(--text-light);">No meals tracked yet.</p>';
                return;
            }

            meals.forEach(meal => {
                const div = document.createElement('div');
                div.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px;";
                const date = new Date(meal.createdAt).toLocaleDateString();
                
                div.innerHTML = `
                    <div style="display: flex; gap: 1rem; align-items: center;">
                        <div style="background-color: rgba(255,107,107,0.1); color: var(--primary); width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <i class="fa-solid fa-cookie-bite"></i>
                        </div>
                        <div>
                            <h4 style="margin: 0;">${meal.name} <span style="font-size: 0.8rem; font-weight: 400; color: white; background: var(--primary); padding: 0.1rem 0.4rem; border-radius: 12px; margin-left: 0.5rem;">${meal.type}</span></h4>
                            <p style="margin: 0; font-size: 0.85rem; color: var(--text-light);">${date}</p>
                        </div>
                    </div>
                    <div>
                        <h4 style="margin: 0; color: var(--text-dark);">${meal.calories} kcal</h4>
                    </div>
                `;
                list.appendChild(div);
            });
        } catch (err) {
            console.error(err);
        }
    };

    fetchMeals();

    document.getElementById('addMealForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('mealName').value;
        const calories = parseInt(document.getElementById('mealCalories').value);
        const type = document.getElementById('mealType').value;

        try {
            await apiFetch('/meals', {
                method: 'POST',
                body: JSON.stringify({ name, calories, type })
            });
            document.getElementById('addMealForm').reset();
            fetchMeals();
        } catch (err) {
            alert(err.message);
        }
    });
});
