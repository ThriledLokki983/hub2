import React, { useState } from 'react';
import { useApi } from './';

// This is a demonstration component showing how to use the new useApi hook
const ApiDemo = () => {
  const [formData, setFormData] = useState({ title: '', description: '' });

  // Example of using the hook for GET request
  const recipeApi = useApi({
    endpoint: '/recipes',
    method: 'GET',
    cache: true,
  });

  // Using the 'get' method from the hook with optional parameters
  const { data: recipes, isLoading, error } = recipeApi.get({ limit: 10 });

  // Example of using the hook for POST request
  const createRecipeApi = useApi({
    endpoint: '/recipes',
    method: 'POST',
    url: '/recipes', // URL to invalidate after successful mutation
  });

  // Using the 'post' method returns a mutation function
  const { mutate: createRecipe, isPending } = createRecipeApi.post();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRecipe(formData);
  };

  // Example with file upload
  const uploadImageApi = useApi({
    endpoint: '/recipes/upload-image',
    method: 'POST',
    isFile: true,
  });

  const { mutate: uploadImage } = uploadImageApi.post();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('image', e.target.files[0]);
      uploadImage(formData);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as any).message}</div>;

  return (
    <div>
      <h2>Recipes List</h2>
      <ul>
        {recipes?.map((recipe: any) => (
          <li key={recipe.id}>{recipe.title}</li>
        ))}
      </ul>

      <h2>Create New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Recipe'}
        </button>
      </form>

      <h2>Upload Image</h2>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
};

export default ApiDemo;