import { api } from './index';

// Simple test function to verify API services are working
export const testApiServices = async () => {
  console.log('🧪 Testing API Services...');
  
  try {
    // Test food service
    console.log('📋 Testing Food Service...');
    const foods = await api.food.getAllFoods();
    console.log(`✅ Food Service: ${foods.data?.length || 0} foods loaded`);
    
    // Test categories
    console.log('📂 Testing Categories...');
    const categories = await api.food.getCategories();
    console.log(`✅ Categories: ${categories.data?.length || 0} categories found`);
    
    console.log('🎉 All API services are working correctly!');
    return true;
  } catch (error) {
    console.error('❌ API test failed:', error);
    return false;
  }
};

// Export for use in other parts of the app
export default testApiServices;