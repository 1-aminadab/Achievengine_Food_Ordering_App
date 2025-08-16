import { api } from './index';

// Simple test function to verify API services are working
export const testApiServices = async () => {
  console.log('🧪 Testing API Services...');
  
  try {
    // Test food service
    const foods = await api.food.getAllFoods();
    
    // Test categories
    const categories = await api.food.getCategories();
    
    return true;
  } catch (error) {
    return false;
  }
};

// Export for use in other parts of the app
export default testApiServices;