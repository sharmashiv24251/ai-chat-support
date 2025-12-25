import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { websiteInfo } from "@/lib/constants/website";
import { getProductBySlug, products } from "@/lib/constants/products";

// Initialize Google GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Define function declarations for tools
const getWebsiteDataDeclaration: FunctionDeclaration = {
  name: "getWebsiteData",
  description:
    "Get website policies and general information about BuyHard. Use this when users ask about shipping, returns, warranty, payment methods, or general store information.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      infoType: {
        type: Type.STRING,
        description:
          "Type of information to retrieve: 'shipping', 'returns', 'warranty', 'general', or 'all'",
        enum: ["shipping", "returns", "warranty", "general", "all"],
      },
    },
    required: ["infoType"],
  },
};

const getProductDataDeclaration: FunctionDeclaration = {
  name: "getProductData",
  description:
    "Get detailed information about a specific product. Use this when users ask about product features, specifications, pricing, availability, or comparisons.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      productSlug: {
        type: Type.STRING,
        description: "The slug identifier of the product to get data for",
      },
    },
    required: ["productSlug"],
  },
};

const getAllProductsDeclaration: FunctionDeclaration = {
  name: "getAllProducts",
  description:
    "Get a complete catalog of all available products with their key details. Use this when users ask for recommendations, comparisons between products, what's available to buy, gift suggestions, or browsing options. Essential for home page interactions.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

// Function implementations
function getWebsiteData(infoType: string): string {
  switch (infoType) {
    case "shipping":
      return `Shipping Policy:\n${websiteInfo.shippingPolicy}`;
    case "returns":
      return `Return Policy:\n${websiteInfo.returnPolicy}`;
    case "warranty":
      return `Warranty Information:\n${websiteInfo.warrantyInfo}`;
    case "general":
      return `${websiteInfo.brandName} - ${websiteInfo.tagline}\n\n${websiteInfo.aiContext}`;
    case "all":
    default:
      return `${websiteInfo.brandName} - ${websiteInfo.tagline}

${websiteInfo.aiContext}

Shipping Policy:
${websiteInfo.shippingPolicy}

Return Policy:
${websiteInfo.returnPolicy}

Warranty Information:
${websiteInfo.warrantyInfo}

Stock Information:
${websiteInfo.stockInfo}`;
  }
}

function getProductData(productSlug: string): string {
  const product = getProductBySlug(productSlug);

  if (!product) {
    // Return list of available products
    const availableProducts = products
      .map((p) => `- ${p.name} (${p.slug})`)
      .join("\n");
    return `Product not found. Available products:\n${availableProducts}`;
  }

  return `Product: ${product.name}
Category: ${product.category}
Price: ${product.currencySymbol}${product.price.toLocaleString()}
In Stock: ${product.inStock ? "Yes" : "No"}
Rating: ${product.rating}/5

Description:
${product.description}

${product.aiContext}

Specifications:
${product.tabs.specs}

Warranty:
${product.tabs.warranty}

Available variants:
${
  product.variants?.colors
    ? `Colors: ${product.variants.colors.join(", ")}`
    : ""
}
${product.variants?.sizes ? `Sizes: ${product.variants.sizes.join(", ")}` : ""}
${
  product.variants?.storage
    ? `Storage: ${product.variants.storage.join(", ")}`
    : ""
}`;
}

function getAllProducts(): string {
  const productList = products
    .map((product) => {
      return `
Product: ${product.name}
Slug: ${product.slug}
Category: ${product.category}
Price: ${product.currencySymbol}${product.price.toLocaleString()}
Rating: ${product.rating}/5
In Stock: ${product.inStock ? "Yes" : "No"}

${product.aiContext}

Available variants: ${
        product.variants?.colors
          ? `Colors: ${product.variants.colors.join(", ")}`
          : ""
      }${
        product.variants?.sizes
          ? ` | Sizes: ${product.variants.sizes.join(", ")}`
          : ""
      }${
        product.variants?.storage
          ? ` | Storage: ${product.variants.storage.join(", ")}`
          : ""
      }
---`;
    })
    .join("\n");

  return `Complete Product Catalog (${products.length} products available):
${productList}

Use this information to make recommendations, compare products, and help users find what they need.`;
}

// Chat history type
export interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

// Generate system instruction based on context
function getSystemInstruction(productSlug?: string): string {
  const baseInstruction = `You are a friendly and helpful AI shopping assistant for BuyHard™, a premium e-commerce platform. Your role is to help customers with their shopping experience.

CRITICAL RULES:
1. ONLY provide information that comes from the tools available to you (getWebsiteData, getProductData, and getAllProducts). Never make up or hallucinate information.
2. If a user asks about something not covered by the available data, politely acknowledge that you don't have that information and steer the conversation back to topics you CAN help with.
3. Be conversational, warm, and helpful. Use a friendly tone.
4. When users ask about products, recommendations, or comparisons, use getAllProducts to see the complete catalog, then use getProductData for specific details.
5. When users ask about policies (shipping, returns, etc.), use the website data.
6. If asked about things completely unrelated to shopping or the store (like general knowledge questions), politely redirect: "I'm here to help you with your shopping experience at BuyHard! I can tell you about our products, shipping, returns, and more. What would you like to know?"

RECOMMENDATION GUIDELINES:
- When users ask for gift suggestions or recommendations, use getAllProducts to browse the catalog
- Consider the recipient's interests (e.g., gaming → suggest PlayStation 5, sports → suggest Nike shoes, tech enthusiast → suggest iPhone)
- Compare products when asked by looking at price, features, and categories
- Be specific and explain WHY you're recommending something based on the product's features

STYLE GUIDELINES:
- Keep responses concise but informative
- Use **markdown formatting** for better readability:
  * Use **bold** for product names and important features
  * Use bullet points (- or *) for lists
  * Use numbered lists for step-by-step instructions
  * Use > for highlights or important notes
  * Use inline code \`backticks\` for technical terms
- Be enthusiastic about products without being pushy
- Help users make informed decisions based on their needs`;

  if (productSlug) {
    const product = getProductBySlug(productSlug);
    if (product) {
      return `${baseInstruction}

CURRENT CONTEXT: The user is viewing the ${
        product.name
      } product page. You have access to the complete product catalog, website information, AND this specific product's details. Prioritize answering questions about this product, but you can also compare it with other products or answer general store questions.

You can suggest relevant questions like:
${product.predefinedQuestions.map((q) => `- "${q}"`).join("\n")}`;
    }
  }

  return `${baseInstruction}

CURRENT CONTEXT: The user is on the home page or browsing. You have access to the COMPLETE product catalog and can help with recommendations, comparisons, and general shopping assistance. Use getAllProducts to see what's available when users ask for suggestions.

Suggest questions like:
${websiteInfo.defaultChatChips.map((q) => `- "${q}"`).join("\n")}`;
}

// Streaming response generator
export async function* generateChatResponseStream(
  userMessage: string,
  chatHistory: ChatHistoryMessage[],
  productSlug?: string
): AsyncGenerator<string, void, unknown> {
  // Determine available tools based on context
  // getAllProducts is always available so users can get recommendations anywhere
  const tools = productSlug
    ? [
        getWebsiteDataDeclaration,
        getProductDataDeclaration,
        getAllProductsDeclaration,
      ]
    : [getWebsiteDataDeclaration, getAllProductsDeclaration];

  // Build conversation history for Gemini
  const contents = chatHistory.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  // Add current user message
  contents.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  try {
    // Generate response with function calling
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: contents,
      config: {
        systemInstruction: getSystemInstruction(productSlug),
        tools: [{ functionDeclarations: tools }],
      },
    });

    // Handle function calls if present
    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionResults = [];

      for (const call of response.functionCalls) {
        let result: string;

        if (call.name === "getWebsiteData") {
          const args = call.args as { infoType: string };
          result = getWebsiteData(args.infoType || "all");
        } else if (call.name === "getProductData") {
          const args = call.args as { productSlug: string };
          result = getProductData(args.productSlug || productSlug || "");
        } else if (call.name === "getAllProducts") {
          result = getAllProducts();
        } else {
          result = "Unknown function";
        }

        functionResults.push({
          name: call.name,
          response: { result },
        });
      }

      // Send function results back to get final response with streaming
      const followUpContents = [
        ...contents,
        {
          role: "model",
          parts: response.functionCalls.map((call) => ({
            functionCall: call,
          })),
        },
        {
          role: "user",
          parts: functionResults.map((fr) => ({
            functionResponse: fr,
          })),
        },
      ];

      const streamResponse = await ai.models.generateContentStream({
        model: "gemini-2.5-flash-lite",
        contents: followUpContents,
        config: {
          systemInstruction: getSystemInstruction(productSlug),
        },
      });

      for await (const chunk of streamResponse) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
    } else {
      // Direct response without function calling - stream it
      const streamResponse = await ai.models.generateContentStream({
        model: "gemini-2.5-flash-lite",
        contents: contents,
        config: {
          systemInstruction: getSystemInstruction(productSlug),
        },
      });

      for await (const chunk of streamResponse) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
    }
  } catch (error) {
    console.error("AI Chat Error:", error);
    yield "I'm having trouble connecting right now. Please try again in a moment.";
  }
}

// Main function to generate chat response (non-streaming, for backward compatibility)
export async function generateChatResponse(
  userMessage: string,
  chatHistory: ChatHistoryMessage[],
  productSlug?: string
): Promise<{ response: string; suggestedQuestions: string[] }> {
  // Determine available tools based on context
  // getAllProducts is always available so users can get recommendations anywhere
  const tools = productSlug
    ? [
        getWebsiteDataDeclaration,
        getProductDataDeclaration,
        getAllProductsDeclaration,
      ]
    : [getWebsiteDataDeclaration, getAllProductsDeclaration];

  // Build conversation history for Gemini
  const contents = chatHistory.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  // Add current user message
  contents.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  try {
    // Generate response with function calling
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: contents,
      config: {
        systemInstruction: getSystemInstruction(productSlug),
        tools: [{ functionDeclarations: tools }],
      },
    });

    // Handle function calls if present
    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionResults = [];

      for (const call of response.functionCalls) {
        let result: string;

        if (call.name === "getWebsiteData") {
          const args = call.args as { infoType: string };
          result = getWebsiteData(args.infoType || "all");
        } else if (call.name === "getProductData") {
          const args = call.args as { productSlug: string };
          result = getProductData(args.productSlug || productSlug || "");
        } else if (call.name === "getAllProducts") {
          result = getAllProducts();
        } else {
          result = "Unknown function";
        }

        functionResults.push({
          name: call.name,
          response: { result },
        });
      }

      // Send function results back to get final response
      const followUpContents = [
        ...contents,
        {
          role: "model",
          parts: response.functionCalls.map((call) => ({
            functionCall: call,
          })),
        },
        {
          role: "user",
          parts: functionResults.map((fr) => ({
            functionResponse: fr,
          })),
        },
      ];

      const finalResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: followUpContents,
        config: {
          systemInstruction: getSystemInstruction(productSlug),
        },
      });

      const suggestedQuestions = productSlug
        ? getProductBySlug(productSlug)?.predefinedQuestions || []
        : websiteInfo.defaultChatChips;

      return {
        response:
          finalResponse.text || "I'm sorry, I couldn't generate a response.",
        suggestedQuestions,
      };
    }

    // Direct response without function calling
    const suggestedQuestions = productSlug
      ? getProductBySlug(productSlug)?.predefinedQuestions || []
      : websiteInfo.defaultChatChips;

    return {
      response: response.text || "I'm sorry, I couldn't generate a response.",
      suggestedQuestions,
    };
  } catch (error) {
    console.error("AI Chat Error:", error);
    return {
      response:
        "I'm having trouble connecting right now. Please try again in a moment.",
      suggestedQuestions: websiteInfo.defaultChatChips,
    };
  }
}
