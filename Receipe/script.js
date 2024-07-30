document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('authForm');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const authTitle = document.getElementById('authTitle');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const content = document.getElementById('content');
    const addRecipeBtn = document.getElementById('addRecipeBtn');
    const recipeForm = document.getElementById('recipeForm');
    const recipeFormTitle = document.getElementById('recipeFormTitle');
    const recipeTitleInput = document.getElementById('recipeTitle');
    const recipeCategoryInput = document.getElementById('recipeCategory');
    const recipeInstructionsInput = document.getElementById('recipeInstructions');
    const recipeImageInput = document.getElementById('recipeImage');
    const saveRecipeBtn = document.getElementById('saveRecipeBtn');
    const cancelRecipeBtn = document.getElementById('cancelRecipeBtn');
    const searchInput = document.getElementById('searchInput');
    const recipesDiv = document.getElementById('recipes');

    let users = JSON.parse(localStorage.getItem('users')) || {};
    let currentUser = localStorage.getItem('currentUser') || null;
    let isEditing = false;
    let currentEditingIndex = null;

    function showAuthForm(mode) {
        authForm.style.display = 'block';
        authTitle.textContent = mode === 'login' ? 'Login' : 'Sign Up';
        authSubmitBtn.textContent = mode === 'login' ? 'Login' : 'Sign Up';
    }

    function hideAuthForm() {
        authForm.style.display = 'none';
        usernameInput.value = '';
        passwordInput.value = '';
    }

    function updateAuthButtons() {
        if (currentUser) {
            loginBtn.style.display = 'none';
            signupBtn.style.display = 'none';
            logoutBtn.style.display = 'inline';
            content.style.display = 'block';
            displayRecipes();
        } else {
            loginBtn.style.display = 'inline';
            signupBtn.style.display = 'inline';
            logoutBtn.style.display = 'none';
            content.style.display = 'none';
        }
    }

    function handleAuthSubmit() {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (authTitle.textContent === 'Login') {
            if (users[username] && users[username].password === password) {
                currentUser = username;
                localStorage.setItem('currentUser', currentUser);
                hideAuthForm();
                updateAuthButtons();
            } else {
                alert('Invalid username or password');
            }
        } else {
            if (!users[username]) {
                users[username] = { password, recipes: [] };
                localStorage.setItem('users', JSON.stringify(users));
                currentUser = username;
                localStorage.setItem('currentUser', currentUser);
                hideAuthForm();
                updateAuthButtons();
            } else {
                alert('Username already exists');
            }
        }
    }

    function handleLogout() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateAuthButtons();
    }

    function showRecipeForm(editMode = false, recipeIndex = null) {
        isEditing = editMode;
        currentEditingIndex = recipeIndex;
        recipeFormTitle.textContent = isEditing ? 'Edit Recipe' : 'Add Recipe';
        recipeForm.style.display = 'block';

        if (isEditing) {
            const recipe = users[currentUser].recipes[recipeIndex];
            recipeTitleInput.value = recipe.title;
            recipeCategoryInput.value = recipe.category;
            recipeInstructionsInput.value = recipe.instructions;
        } else {
            recipeTitleInput.value = '';
            recipeCategoryInput.value = '';
            recipeInstructionsInput.value = '';
            recipeImageInput.value = '';
        }
    }

    function hideRecipeForm() {
        recipeForm.style.display = 'none';
        recipeTitleInput.value = '';
        recipeCategoryInput.value = '';
        recipeInstructionsInput.value = '';
        recipeImageInput.value = '';
    }

    function saveRecipe() {
        const title = recipeTitleInput.value;
        const category = recipeCategoryInput.value;
        const instructions = recipeInstructionsInput.value;
        const image = recipeImageInput.files[0] ? URL.createObjectURL(recipeImageInput.files[0]) : '';

        const newRecipe = { title, category, instructions, image };

        if (isEditing) {
            users[currentUser].recipes[currentEditingIndex] = newRecipe;
        } else {
            users[currentUser].recipes.push(newRecipe);
        }

        localStorage.setItem('users', JSON.stringify(users));
        displayRecipes();
        hideRecipeForm();
    }

    function editRecipe(index) {
        showRecipeForm(true, index);
    }

    function deleteRecipe(index) {
        if (confirm('Are you sure you want to delete this recipe?')) {
            users[currentUser].recipes.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            displayRecipes();
        }
    }

    function displayRecipes() {
        recipesDiv.innerHTML = '';
        const searchQuery = searchInput.value.toLowerCase();
        const userRecipes = users[currentUser].recipes;

        userRecipes
            .filter(recipe => recipe.title.toLowerCase().includes(searchQuery) || recipe.category.toLowerCase().includes(searchQuery))
            .forEach((recipe, index) => {
                const recipeDiv = document.createElement('div');
                recipeDiv.className = 'recipe';

                const recipeImg = document.createElement('img');
                recipeImg.src = recipe.image;

                const recipeInfo = document.createElement('div');

                const recipeTitle = document.createElement('h3');
                recipeTitle.textContent = recipe.title;

                const recipeCategory = document.createElement('p');
                recipeCategory.textContent = `Category: ${recipe.category}`;

                const recipeInstructions = document.createElement('p');
                recipeInstructions.textContent = recipe.instructions;

                const recipeActions = document.createElement('div');
                recipeActions.className = 'recipe-actions';

                const editBtn = document.createElement('button');
                editBtn.className = 'editBtn';
                editBtn.textContent = 'Edit';
                editBtn.onclick = () => editRecipe(index);

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'deleteBtn';
                deleteBtn.textContent = 'Delete';
                deleteBtn.onclick = () => deleteRecipe(index);

                recipeActions.appendChild(editBtn);
                recipeActions.appendChild(deleteBtn);

                recipeInfo.appendChild(recipeTitle);
                recipeInfo.appendChild(recipeCategory);
                recipeInfo.appendChild(recipeInstructions);

                recipeDiv.appendChild(recipeImg);
                recipeDiv.appendChild(recipeInfo);
                recipeDiv.appendChild(recipeActions);

                recipesDiv.appendChild(recipeDiv);
            });
    }

    loginBtn.addEventListener('click', () => showAuthForm('login'));
    signupBtn.addEventListener('click', () => showAuthForm('signup'));
    logoutBtn.addEventListener('click', handleLogout);
    authSubmitBtn.addEventListener('click', handleAuthSubmit);
    addRecipeBtn.addEventListener('click', () => showRecipeForm(false));
    saveRecipeBtn.addEventListener('click', saveRecipe);
    cancelRecipeBtn.addEventListener('click', hideRecipeForm);
    searchInput.addEventListener('input', displayRecipes);

    updateAuthButtons();
});
