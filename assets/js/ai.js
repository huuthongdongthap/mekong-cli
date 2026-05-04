/**
 * MekongAI - AI Services Frontend Wrapper
 * Provides unified interface to interact with Mekong's AI services
 */

class MekongAI {
  private static baseUrl: string = '/api/v1'; // Cloudflare Workers base URL
  private static apiKey: string | null = null;

  /**
   * Initialize the MekongAI client with API key
   * @param apiKey - Optional API key, can be retrieved from environment
   */
  static init(apiKey?: string) {
    this.apiKey = apiKey || localStorage.getItem('mekong_api_key');
  }

  /**
   * Generate product listings using AI
   * @param productInfo - Product information to generate listing for
   * @param targetPlatform - Target platform for the listing (SHOPEE, TIKTOK, etc.)
   * @param targetLanguage - Target language (EN, VI, ZH, JA)
   * @returns Generated listing data
   */
  static async generateListings(
    productInfo: {
      name_vi: string;
      description_vi: string;
      category: string;
      certifications?: string[];
      weight?: number;
      province?: string;
    },
    targetPlatform: string,
    targetLanguage: string = 'EN'
  ): Promise<{
    title: string;
    description: string;
    bullet_points: string[];
    keywords: string[];
    hashtags: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/ai/listing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({
          product_info: productInfo,
          target_platform: targetPlatform,
          target_language: targetLanguage
        })
      });

      if (!response.ok) {
        throw new Error(`AI Listing Generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating listings:', error);
      throw error;
    }
  }

  /**
   * Analyze product images using AI
   * @param imageBase64 - Base64 encoded image data
   * @param mimeType - MIME type of the image
   * @returns Image analysis results
   */
  static async analyzeImage(
    imageBase64: string,
    mimeType: string
  ): Promise<{
    overall_score: number;
    meets_shopee: boolean;
    meets_amazon: boolean;
    meets_alibaba: boolean;
    issues: string[];
    suggestions: string[];
    auto_tags: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/ai/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({
          image_base64: imageBase64,
          mime_type: mimeType
        })
      });

      if (!response.ok) {
        throw new Error(`AI Image Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }

  /**
   * Generate social media content using AI
   * @param productDetails - Product details for content creation
   * @param platform - Target platform (FACEBOOK, TIKTOK, ZALO, SHOPEEFEED)
   * @returns Generated content data
   */
  static async generateContent(
    productDetails: {
      name: string;
      description: string;
      category: string;
      price: number;
      target_audience: string;
    },
    platform: string
  ): Promise<{
    caption: string;
    hashtags: string[];
    cta: string;
    best_time: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/ai/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({
          product_details: productDetails,
          platform: platform
        })
      });

      if (!response.ok) {
        throw new Error(`AI Content Generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

  /**
   * Get AI-powered pricing suggestions
   * @param productInfo - Product information for pricing
   * @param competitorData - Competitor pricing data
   * @param salesHistory - Sales history for the product
   * @returns Pricing recommendations
   */
  static async suggestPrice(
    productInfo: {
      name: string;
      category: string;
      cost: number;
      target_margin: number;
      brand_prestige?: string;
    },
    competitorData: {
      platform: string;
      competitors: {
        name: string;
        price: number;
        rating: number;
        sales_volume: number;
      }[];
    },
    salesHistory: {
      last_30_days_sales: number;
      avg_monthly_sales: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    }
  ): Promise<{
    suggested_price: number;
    min_price: number;
    max_price: number;
    reasoning: string;
    confidence: number;
    action: 'recommend_adjustment' | 'maintain_current' | 'promote_aggressively' | 'investigate';
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/ai/pricing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({
          product_info: productInfo,
          competitor_data: competitorData,
          sales_history: salesHistory
        })
      });

      if (!response.ok) {
        throw new Error(`AI Pricing suggestion failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error suggesting price:', error);
      throw error;
    }
  }

  /**
   * Get demand forecasting for inventory planning
   * @param historicalSales - Historical sales data
   * @param weeksToForecast - Number of weeks to forecast ahead
   * @returns Forecasting results
   */
  static async getDemandForecast(
    historicalSales: { date: string; quantity: number }[],
    weeksToForecast: number = 4
  ): Promise<{
    weekly_avg: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    forecast: number[];
    recommended_stock: number;
    confidence: number;
  }> {
    try {
      // Note: Demand forecasting endpoint needs to be implemented on the backend
      // For now, we'll make a call to the pricing endpoint as a placeholder
      // This would need to be added to the Cloudflare Workers backend separately
      const response = await fetch(`${this.baseUrl}/ai/pricing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({
          historical_sales: historicalSales,
          weeks_to_forecast: weeksToForecast
        })
      });

      if (!response.ok) {
        throw new Error(`Demand forecasting failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting demand forecast:', error);
      throw error;
    }
  }
}

// Make MekongAI available globally
declare global {
  interface Window {
    MekongAI: typeof MekongAI;
  }
}

if (typeof window !== 'undefined') {
  window.MekongAI = MekongAI;
}

export default MekongAI;