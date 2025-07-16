import "./App.css";
import { useEffect, useState } from "react";
import { Search, Filter, Clock, Users, TrendingUp } from "lucide-react";
const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [selectedDiet, setSelectedDiet] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [error, setError] = useState(null);

  const cuisines = [
    "all",
    "african",
    "asian",
    "american",
    "british",
    "cajun",
    "caribbean",
    "chinese",
    "eastern european",
    "european",
    "french",
    "german",
    "greek",
    "indian",
    "irish",
    "italian",
    "japanese",
    "korean",
    "latin american",
    "mediterranean",
    "mexican",
    "middle eastern",
    "nordic",
    "southern",
    "spanish",
    "thai",
    "vietnamese",
  ];

  const diets = [
    "all",
    "gluten free",
    "ketogenic",
    "vegetarian",
    "lacto vegetarian",
    "ovo vegetarian",
    "vegan",
    "pescetarian",
    "paleo",
    "primal",
    "low FODMAP",
    "whole 30",
  ];

  const types = [
    "all",
    "main course",
    "side dish",
    "dessert",
    "appetizer",
    "salad",
    "bread",
    "breakfast",
    "soup",
    "beverage",
    "sauce",
    "marinade",
    "fingerfood",
    "snack",
    "drink",
  ];

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=50&addRecipeInformation=true&addRecipeNutrition=true&fillIngredients=true&sort=healthiness`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const json = await response.json();
        setList(json.results);
        setFilteredList(json.results);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching recipes:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllRecipes();
  }, []);

  useEffect(() => {
    let filtered = list;
    if (searchTerm) {
      filtered = filtered.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCuisine && selectedCuisine !== "all") {
      filtered = filtered.filter(
        (recipe) =>
          recipe.cuisines &&
          recipe.cuisines.some(
            (cuisines) =>
              cuisines.toLowerCase() === selectedCuisine.toLowerCase()
          )
      );
    }

    if (selectedDiet && selectedDiet !== "all") {
      filtered = filtered.filter(
        (recipe) =>
          recipe.diets &&
          recipe.diets.some(
            (diets) => diets.toLowerCase() === selectedDiet.toLowerCase()
          )
      );
    }

    if (selectedType && selectedType !== "all") {
      filtered = filtered.filter(
        (recipe) =>
          recipe.dishTypes &&
          recipe.dishTypes.some(
            (type) => type.toLowerCase() === selectedType.toLowerCase()
          )
      );
    }
    setFilteredList(filtered);
  }, [searchTerm, selectedCuisine, selectedDiet, selectedType, list]);

  const calculateStats = () => {
    if (list.length === 0)
      return {
        totalRecipes: 0,
        avgReadyTime: 0,
        avgCalories: 0,
        avgHealthScore: 0,
      };

    const totalRecipes = list.length;
    const avgReadyTime = Math.round(
      list.reduce((sum, recipe) => sum + (recipe.readyInMinutes || 0), 0) /
        totalRecipes
    );

    const avgCalories = Math.round(
      list.reduce((sum, recipe) => {
        const calories =
          recipe.nutrition?.nutrients?.find((n) => n.name === "Calories")
            ?.amount || 0;
        return sum + calories;
      }, 0) / totalRecipes
    );

    const avgHealthScore = Math.round(
      list.reduce((sum, recipe) => sum + (recipe.healthScore || 0), 0) /
        totalRecipes
    );

    return {
      totalRecipes,
      avgReadyTime,
      avgCalories,
      avgHealthScore,
    };
  };
  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading delicious recipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Error loading recipes</p>
          <p className="mt-2">{error}</p>
          <p className="mt-4 text-sm text-gray-600">
            Please check your API key and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🍳 Reciptify
          </h1>
          <p className="text-xl text-gray-600">
            Find the best recipes below! 🥘
          </p>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.totalRecipes}
            </h3>
            <p className="text-gray-600">Total Recipes</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.avgReadyTime}
            </h3>
            <p className="text-gray-600">Avg Cook Time (min)</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.avgCalories}
            </h3>
            <p className="text-gray-600">Avg Calories/Serving</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.avgHealthScore}
            </h3>
            <p className="text-gray-600">Avg Health Score/Serving</p>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Cuisine Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
              >
                {cuisines.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine === "all"
                      ? "All Cuisines"
                      : cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Diet Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedDiet}
                onChange={(e) => setSelectedDiet(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
              >
                {diets.map((diet) => (
                  <option key={diet} value={diet}>
                    {diet === "all"
                      ? "All Diets"
                      : diet.charAt(0).toUpperCase() + diet.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type === "all"
                      ? "All Types"
                      : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredList.length} of {list.length} recipes
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.length > 0 ? (
            filteredList.slice(0, 12).map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {recipe.title}
                  </h3>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {recipe.readyInMinutes || "N/A"} min
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {recipe.servings || "N/A"} servings
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {recipe.cuisines &&
                        recipe.cuisines.slice(0, 2).map((cuisine, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                          >
                            {cuisine}
                          </span>
                        ))}
                    </div>

                    <div className="text-right">
                      {recipe.healthScore && (
                        <div className="mb-1">
                          <span className="text-xs text-gray-500">
                            Health Score
                          </span>
                          <div className="text-sm font-semibold text-green-600">
                            {recipe.healthScore}/100
                          </div>
                        </div>
                      )}

                      {recipe.nutrition?.nutrients?.find(
                        (n) => n.name === "Calories"
                      ) && (
                        <div>
                          <span className="text-xs text-gray-500">
                            Calories/Serving
                          </span>
                          <div className="text-sm font-semibold text-blue-600">
                            {Math.round(
                              recipe.nutrition.nutrients.find(
                                (n) => n.name === "Calories"
                              ).amount
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {recipe.summary && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                      {recipe.summary.replace(/<[^>]*>/g, "").slice(0, 100)}...
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                No recipes found matching your criteria.
              </p>
              <p className="text-gray-400 mt-2">
                Try adjusting your search or filter settings.
              </p>
            </div>
          )}
        </div>

        {/* Show more button if there are more results */}
        {filteredList.length > 12 && (
          <div className="text-center mt-8">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
              Load More Recipes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
