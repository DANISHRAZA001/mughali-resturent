const fs = require('fs');

class Recipe {
    constructor(name, category, ingredients, steps, imagePath, videoPath, rating, review) {
        this.name = name;
        this.category = category;
        this.ingredients = ingredients;
        this.steps = steps;
        this.imagePath = imagePath;
        this.videoPath = videoPath;
        this.rating = rating;
        this.review = review;
    }

    toString() {
        return `${this.name} (Category: ${this.category})`;
    }
}

class RecipeApp {
    constructor() {
        this.recipes = [];
        this.loadRecipes();
    }

    addRecipe(recipe) {
        this.recipes.push(recipe);
        this.saveRecipes();
    }

    deleteRecipe(name) {
        const index = this.recipes.findIndex(r => r.name.toLowerCase() === name.toLowerCase());
        if (index !== -1) {
            this.recipes.splice(index, 1);
            this.saveRecipes();
            console.log('Recipe deleted successfully.');
        } else {
            console.log('Recipe not found.');
        }
    }

    editRecipe(name, newRecipe) {
        const index = this.recipes.findIndex(r => r.name.toLowerCase() === name.toLowerCase());
        if (index !== -1) {
            this.recipes[index] = newRecipe;
            this.saveRecipes();
            console.log('Recipe edited successfully.');
        } else {
            console.log('Recipe not found.');
        }
    }

    viewRecipesByCategory(category) {
        console.log(`Recipes under category '${category}':`);
        const filteredRecipes = this.recipes.filter(r => r.category.toLowerCase() === category.toLowerCase());
        if (filteredRecipes.length === 0) {
            console.log('No recipes found in this category.');
        } else {
            filteredRecipes.forEach(recipe => console.log(recipe.toString()));
        }
    }

    searchRecipe(keyword) {
        console.log(`Search results for '${keyword}':`);
        const searchResults = this.recipes.filter(r => 
            r.name.toLowerCase().includes(keyword.toLowerCase()) || 
            r.ingredients.some(ing => ing.toLowerCase().includes(keyword.toLowerCase()))
        );
        if (searchResults.length === 0) {
            console.log('No recipes found.');
        } else {
            searchResults.forEach(recipe => console.log(recipe.toString()));
        }
    }

    rateAndReviewRecipe(name, rating, review) {
        const recipe = this.recipes.find(r => r.name.toLowerCase() === name.toLowerCase());
        if (recipe) {
            recipe.rating = rating;
            recipe.review = review;
            this.saveRecipes();
            console.log('Rating and review updated.');
        } else {
            console.log('Recipe not found.');
        }
    }

    shareRecipe(name) {
        const recipe = this.recipes.find(r => r.name.toLowerCase() === name.toLowerCase());
        if (recipe) {
            console.log('Sharing recipe:');
            console.log(recipe.toString());
        } else {
            console.log('Recipe not found.');
        }
    }

    saveRecipes() {
        const data = this.recipes.map(recipe => 
            `${recipe.name}|${recipe.category}|${recipe.ingredients.join(',')}|${recipe.steps.join(',')}|${recipe.imagePath}|${recipe.videoPath}|${recipe.rating}|${recipe.review}`
        ).join('\n');
        fs.writeFileSync('recipes.txt', data, 'utf8');
    }

    loadRecipes() {
        if (fs.existsSync('recipes.txt')) {
            const data = fs.readFileSync('recipes.txt', 'utf8');
            const lines = data.split('\n');
            this.recipes = lines.map(line => {
                const parts = line.split('|');
                return new Recipe(
                    parts[0],
                    parts[1],
                    parts[2].split(','),
                    parts[3].split(','),
                    parts[4],
                    parts[5],
                    parseFloat(parts[6]),
                    parts[7]
                );
            });
        }
    }
}

const readlineSync = require('readline-sync');

function createRecipe() {
    const name = readlineSync.question('Enter the name of the recipe: ');
    const category = readlineSync.question('Enter the category of the recipe: ');
    const ingredients = readlineSync.question('Enter the ingredients (comma separated): ').split(',').map(i => i.trim());
    const steps = readlineSync.question('Enter the steps (comma separated): ').split(',').map(s => s.trim());
    const imagePath = readlineSync.question('Enter the path to the image: ');
    const videoPath = readlineSync.question('Enter the path to the video: ');
    return new Recipe(name, category, ingredients, steps, imagePath, videoPath, 0, '');
}

function main() {
    const recipeApp = new RecipeApp();

    while (true) {
        console.log('\nRecipe App');
        console.log('1. Add Recipe');
        console.log('2. Edit Recipe');
        console.log('3. Delete Recipe');
        console.log('4. View Recipes by Category');
        console.log('5. Search Recipes');
        console.log('6. Rate and Review Recipe');
        console.log('7. Share Recipe');
        console.log('8. Exit');
        const option = readlineSync.question('Choose an option: ');

        switch (option) {
            case '1':
                const newRecipe = createRecipe();
                recipeApp.addRecipe(newRecipe);
                break;
            case '2':
                const editName = readlineSync.question('Enter the name of the recipe to edit: ');
                const editedRecipe = createRecipe();
                recipeApp.editRecipe(editName, editedRecipe);
                break;
            case '3':
                const deleteName = readlineSync.question('Enter the name of the recipe to delete: ');
                recipeApp.deleteRecipe(deleteName);
                break;
            case '4':
                const category = readlineSync.question('Enter the category: ');
                recipeApp.viewRecipesByCategory(category);
                break;
            case '5':
                const keyword = readlineSync.question('Enter the keyword to search: ');
                recipeApp.searchRecipe(keyword);
                break;
            case '6':
                const rateName = readlineSync.question('Enter the name of the recipe to rate and review: ');
                const rating = parseFloat(readlineSync.question('Enter your rating (0-5): '));
                const review = readlineSync.question('Enter your review: ');
                recipeApp.rateAndReviewRecipe(rateName, rating, review);
                break;
            case '7':
                const shareName = readlineSync.question('Enter the name of the recipe to share: ');
                recipeApp.shareRecipe(shareName);
                break;
            case '8':
                return;
            default:
                console.log('Invalid option.');
                break;
        }
    }
}

main();
