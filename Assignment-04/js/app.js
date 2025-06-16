// 1) Grab the <input type="text"> and <button type="submit">
const searchInput = document.querySelector('input[type="text"]');
const searchButton = document.querySelector('button[type="submit"]');
const resultDiv = document.getElementById('result');

// 2) Listen for click on "Search"
searchButton.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent form from reloading page
  const foodName = searchInput.value.trim();
  if (foodName) {
    fetchFoodData(foodName);
  }
});

// 3) Fetch from TheMealDB API (search endpoint)
async function fetchFoodData(foodName) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    resultDiv.innerHTML = ''; // Clear previous results
    resultDiv.className = 'row mt-4'; // Use Bootstrap row
    displayMeals(data.meals);
  } catch (err) {
    resultDiv.innerHTML = `<p class="text-danger">Something went wrong. Please try again.</p>`;
  }
}

// 4) Display meals as Bootstrap cards
function displayMeals(meals) {
  if (!meals) {
    resultDiv.innerHTML += `<p class="text-warning">No recipes found for "${searchInput.value}"</p>`;
    return;
  }

  meals.forEach((meal) => {
    const card = `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}" style="height: 200px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${meal.strMeal}</h5>
            <p class="card-text">
              ${meal.strInstructions.substring(0, 100)}…
            </p>
            <a
              href="https://www.themealdb.com/meal/${meal.idMeal}"
              target="_blank"
              class="btn btn-warning mt-auto"
            >
              View Recipe
            </a>
          </div>
        </div>
      </div>
    `;
    resultDiv.innerHTML += card;
  });
}

// ✅ 5) Load random meals on page load
window.addEventListener('DOMContentLoaded', () => {
  fetchRandomMeals(7); // Show 6 random meals
});

// 6) Fetch multiple random meals
async function fetchRandomMeals(count) {
  resultDiv.innerHTML = '';
  resultDiv.className = 'row mt-4';

  for (let i = 0; i < count; i++) {
    try {
      const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await res.json();
      displayMeals(data.meals); // Append each random meal
    } catch (err) {
      console.error('Error loading random meal:', err);
    }
  }
}
