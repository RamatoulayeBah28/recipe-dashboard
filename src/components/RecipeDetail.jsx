import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Clock,
  Users,
  ArrowLeft,
  Heart,
  Star,
  ChefHat,
  Utensils,
  DollarSign,
} from "lucide-react";

const API_KEY = import.meta.env.VITE_API_KEY;

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=true`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch recipe details");
        }
        const data = await response.json();
        setRecipe(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching recipe details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRecipeDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Error loading recipe details</p>
          <p className="mt-2">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getNutrientValue = (nutrientName) => {
    return (
      recipe.nutrition?.nutrients?.find((n) => n.name === nutrientName)
        ?.amount || 0
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-800">Recipe Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipe Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {recipe.title}
                </h2>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{recipe.readyInMinutes || "N/A"} minutes</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span>{recipe.servings || "N/A"} servings</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Star className="h-5 w-5 mr-2" />
                    <span>{recipe.healthScore || "N/A"}/100 health score</span>
                  </div>
                  {recipe.spoonacularScore && (
                    <div className="flex items-center text-gray-600">
                      <Heart className="h-5 w-5 mr-2" />
                      <span>
                        {Math.round(recipe.spoonacularScore)}/100 popularity
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.cuisines?.map((cuisine, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
                    >
                      {cuisine}
                    </span>
                  ))}
                  {recipe.diets?.map((diet, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                    >
                      {diet}
                    </span>
                  ))}
                  {recipe.dishTypes?.map((type, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>

                {/* Summary */}
                {recipe.summary && (
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      About This Recipe
                    </h3>
                    <div
                      className="text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: recipe.summary }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            {recipe.extendedIngredients &&
              recipe.extendedIngredients.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <ChefHat className="h-6 w-6 mr-2" />
                    Ingredients
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {recipe.extendedIngredients.map((ingredient, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-700"
                      >
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 flex-shrink-0"></span>
                        <span>{ingredient.original}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Instructions */}
            {recipe.analyzedInstructions &&
              recipe.analyzedInstructions.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Utensils className="h-6 w-6 mr-2" />
                    Instructions
                  </h3>
                  {recipe.analyzedInstructions.map(
                    (instruction, instructionIndex) => (
                      <div key={instructionIndex}>
                        {instruction.name && (
                          <h4 className="text-lg font-medium text-gray-700 mb-2">
                            {instruction.name}
                          </h4>
                        )}
                        <ol className="space-y-3">
                          {instruction.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex">
                              <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                                {step.number}
                              </span>
                              <span className="text-gray-700 leading-relaxed">
                                {step.step}
                              </span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )
                  )}
                </div>
              )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Nutrition Information */}
            {recipe.nutrition && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Nutrition Facts
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Calories</span>
                    <span className="font-semibold">
                      {Math.round(getNutrientValue("Calories"))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Protein</span>
                    <span className="font-semibold">
                      {Math.round(getNutrientValue("Protein"))}g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carbs</span>
                    <span className="font-semibold">
                      {Math.round(getNutrientValue("Carbohydrates"))}g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fat</span>
                    <span className="font-semibold">
                      {Math.round(getNutrientValue("Fat"))}g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fiber</span>
                    <span className="font-semibold">
                      {Math.round(getNutrientValue("Fiber"))}g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sugar</span>
                    <span className="font-semibold">
                      {Math.round(getNutrientValue("Sugar"))}g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sodium</span>
                    <span className="font-semibold">
                      {Math.round(getNutrientValue("Sodium"))}mg
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Recipe Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Recipe Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Health Score</span>
                  <span className="font-semibold text-green-600">
                    {recipe.healthScore || "N/A"}/100
                  </span>
                </div>
                {recipe.spoonacularScore && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Popularity</span>
                    <span className="font-semibold text-blue-600">
                      {Math.round(recipe.spoonacularScore)}/100
                    </span>
                  </div>
                )}
                {recipe.pricePerServing && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost per Serving</span>
                    <span className="font-semibold text-green-600 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {(recipe.pricePerServing / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Servings</span>
                  <span className="font-semibold">
                    {recipe.servings || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ready Time</span>
                  <span className="font-semibold">
                    {recipe.readyInMinutes || "N/A"} min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prep Time</span>
                  <span className="font-semibold">
                    {recipe.preparationMinutes || "N/A"} min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cook Time</span>
                  <span className="font-semibold">
                    {recipe.cookingMinutes || "N/A"} min
                  </span>
                </div>
              </div>
            </div>

            {/* Equipment */}
            {recipe.equipment && recipe.equipment.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Equipment Needed
                </h3>
                <ul className="space-y-2">
                  {recipe.equipment.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
