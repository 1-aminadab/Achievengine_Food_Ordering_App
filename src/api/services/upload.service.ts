import { apiClient, handleApiResponse, handleApiError, ApiResponse } from '../config';
import type { UploadImageResponse } from '../types';

class UploadService {
  private readonly endpoint = '/upload';

  /**
   * Upload single image
   */
  async uploadImage(imageUri: string, fileName?: string): Promise<ApiResponse<UploadImageResponse>> {
    try {
      const formData = new FormData();
      
      // React Native FormData file format
      const imageFile = {
        uri: imageUri,
        type: 'image/jpeg',
        name: fileName || `image_${Date.now()}.jpg`,
      } as any;
      
      formData.append('image', imageFile);

      const response = await apiClient.post(`${this.endpoint}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data) => data, // Don't transform FormData
      });

      return handleApiResponse<UploadImageResponse>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Upload multiple images
   */
  async uploadImages(imageUris: string[]): Promise<ApiResponse<UploadImageResponse[]>> {
    try {
      const uploadPromises = imageUris.map((uri, index) => 
        this.uploadImage(uri, `image_${index}_${Date.now()}.jpg`)
      );

      const results = await Promise.all(uploadPromises);
      const uploadedImages = results.map((result: ApiResponse<UploadImageResponse>) => result.data);

      return {
        data: uploadedImages,
        success: true,
        message: `Successfully uploaded ${uploadedImages.length} images`
      };
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Delete uploaded image
   */
  async deleteImage(filename: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete(`${this.endpoint}/image/${filename}`);
      return handleApiResponse<void>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Get uploaded file URL
   */
  getFileUrl(filename: string): string {
    const baseUrl = apiClient.defaults.baseURL?.replace('/api', '') || 'http://localhost:3000';
    return `${baseUrl}/uploads/${filename}`;
  }

  /**
   * Test upload endpoint connection
   */
  async testUploadEndpoint(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get(`${this.endpoint}/test`);
      return handleApiResponse(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

export const uploadService = new UploadService();