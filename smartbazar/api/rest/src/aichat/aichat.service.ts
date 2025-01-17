// src/chat/chat.service.ts
import { Injectable ,} from '@nestjs/common';
import axios from 'axios';
import {GoogleGenerativeAI , HarmCategory, HarmBlockThreshold,} from '@google/generative-ai'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiChatService {
  private openAiApiKey = 'c3ad767941f84bf0938ec7d44e9380a0';
  private openAiApiUrl = 'https://cog-e5djdwk6kfklc.openai.azure.com/openai/deployments/chat/chat/completions?api-version=2024-04-01-preview';
  private searchApiKey = 'MyZDrDoaS5avQIuN3Atcio5DomPV6nWQFqrkvwBLBhAzSeBpZWmK';
  private searchApiUrl = 'https://gptkb-het5qkitjshd4.search.windows.net/indexes/gptkbindex/docs/search?api-version=2024-05-01-preview';
  private embeddingApiUrl = 'https://cog-e5djdwk6kfklc.openai.azure.com/openai/deployments/embedding/embeddings?api-version=2023-05-15';
  private genAI:any;
  private genAiModel:any;
  // private genAI = new GoogleGenerativeAI('AIzaSyBYVv9zhVOSxPsuFwtFnr5Y6YXA9cNB8V4');
 constructor(private readonly config: ConfigService){
  this.genAI = new GoogleGenerativeAI(this.config.get("Gemini_API_Key"));
 this.genAiModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
 }
//  async getGeminiPromptResponse(prompt: string): Promise<string> {
  
// const promptMsg = `you are a helpful assistant working for watts.com. Your goal is to assist users by providing accurate and detailed information about products. When the user asks a question, follow these steps:
// Generate a precise web search query that focuses on the technical details of the product in question (e.g., sizes, specifications, and models). For example, use queries like: "AC activated carbon filter sizes watts.com," "product specifications for AC activated carbon filter," and "technical details of AC activated carbon filters."
// If the user does not provide a model number, assume they are asking about a general or popular product like the AC activated carbon filter. In this case, extract general product data that is widely applicable, such as connection sizes, media bed volumes, and flow rates.
// When responding, include precise sizes and specifications without asking for additional information, unless the model is absolutely necessary. For example:
// "The AC activated carbon filters are available with connection sizes ranging from 1 inch (25mm) to 3 inches (80mm), media bed volumes from 3 cu. ft. to 35 cu. ft., and flow rates up to 129.5 GPM."
// Ensure all relevant technical details (like sizes, flow rates, and volumes) are provided directly in the response, derived from search results or the product page, and avoid unnecessary follow-up questions when this information is available.
// If specific product details are not found, state clearly that the information is unavailable on the product page and suggest visiting the Watts customer service or a distributor. Avoid asking the user for model numbers unless absolutely necessary. ${prompt}`
//   const result = await this.genAiModel.generateContent(promptMsg)
//   const response = await result.response;
//   const text = response.text();
  
//   console.log(text);
//   return JSON.stringify(text);
//  }

private generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

async getGeminiPromptResponse(input: string): Promise<string> {
  const chatSession = this.genAiModel.startChat({
    generationConfig: this.generationConfig,
    history: [
      {
        role: 'user',
        parts: [
          {text: "you are a helpful assistant working for watts.com. Your goal is to assist users by providing accurate and detailed information about products. When the user asks a question, follow these steps:\nGenerate a precise web search query that focuses on the technical details of the product in question (e.g., sizes, specifications, and models). For example, use queries like: \\\"AC activated carbon filter sizes watts.com,\\\" \\\"product specifications for AC activated carbon filter,\\\" and \\\"technical details of AC activated carbon filters.\\\"\nIf the user does not provide a model number, assume they are asking about a general or popular product like the AC activated carbon filter. In this case, extract general product data that is widely applicable, such as connection sizes, media bed volumes, and flow rates.\nWhen responding, include precise sizes and specifications without asking for additional information, unless the model is absolutely necessary. For example:\n\\\"The AC activated carbon filters are available with connection sizes ranging from 1 inch (25mm) to 3 inches (80mm), media bed volumes from 3 cu. ft. to 35 cu. ft., and flow rates up to 129.5 GPM.\\\"\nEnsure all relevant technical details (like sizes, flow rates, and volumes) are provided directly in the response, derived from search results or the product page, and avoid unnecessary follow-up questions when this information is available.\nIf specific product details are not found, state clearly that the information is unavailable on the product page and suggest visiting the Watts customer service or a distributor. Avoid asking the user for model numbers unless absolutely necessary."},
        ],
      },
      {
        role: 'model',
        parts: [
          {text: "Okay, I understand. I will be your helpful assistant for Watts.com, providing precise technical details for products. I will avoid unnecessary questions and focus on providing accurate information. Let's get started! Ask me anything about Watts products. \n"},
        ],
      },
    ],
  });

  // Send a message to the chat session
  const result = await chatSession.sendMessage(input);
  console.log(result.response.text());
  // Return the result response text
  return result.response.text();
}
 
  async identifyQueryType(history: string[], lastQuestion: string): Promise<any> {
    if (!history || !lastQuestion) {
        throw new Error('Invalid input: history and lastQuestion must be provided');
    }

    const messages = [
        {
            content: `You are an Azure Search Query Assistant designed to process conversation histories between users and virtual assistants. Your role includes
            1. identifying the user intent. If user is looking for an information, query type is [information]. If the user is trying to add anythig to cart or buying anything, query is [checkout].
            2. if user query is [information], parse through the content, excluding any messages labeled with the role 'system'. You must identify specific keywords from the latest user message that could relate to associated services or contextually relevant topics discussed earlier in the conversation. Focus on precision to generate effective search queries, specifically tailored for Azure Search Service. Extract and consolidate key phrases or words that would optimize search functionality, helping to locate documents or entries that match the user's query intent. the output should just include keywords seperated by AND.
            3. if user query is [checkout], parse through the user intent and identify products, addresses and any other information related to checkout. 
            Your response should strictly be in the following format:
            {
              "isCheckoutQuery": //true or false based on if checkout query or not,
              "userMessage"://user friendly message confirming what user is trying to do. e.g. I see that you are trying to purchase xyz product, Let me gather some information to help you ...,
              "searchObject":{
                "keywords": //identified keywords for information
              },
              "checkoutObject":{
                "products": //product names separated by OR,
                "addresses": //addresses identified,
                "simplifiedQuery": //simplified version of user query while still maintaining all information
              }
            }
            `,
            role: 'system',
        },
        ...history
            .map((content, idx) => ({
                content: content || '',
                role: idx % 2 === 0 ? 'user' : 'assistant',
            }))
            .filter(message => message.role === 'user'),
        {
            content: lastQuestion,
            role: 'user',
        },
    ];

    const response = await axios.post(
        this.openAiApiUrl,
        { messages },
        {
            headers: {
                'Content-Type': 'application/json',
                'api-key': this.openAiApiKey,
            },
        },
    );
    console.log(response , 'response test aichatservice')
    const searchQuery = JSON.parse(response.data?.choices?.[0]?.message?.content?.trim());
    if (!searchQuery) {
        throw new Error('Failed to generate search query');
    }

    return searchQuery;
}


  async getEmbeddings(userQuery: string): Promise<any> {
    if (!userQuery) {
      throw new Error('Invalid input: userQuery must be provided');
    }

    const response = await axios.post(
      this.embeddingApiUrl,
      { input: userQuery },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.openAiApiKey,
        },
      },
    );

    if (!response.data?.data?.[0]?.embedding) {
      throw new Error('Failed to get embeddings');
    }

    return response.data.data[0].embedding;
  }

  async searchDocuments(searchText: string): Promise<string> {
    if (!searchText) {
      throw new Error('Invalid input: searchText must be provided');
    }

    const embeddings = await this.getEmbeddings(searchText);
    const response = await axios.post(
      this.searchApiUrl,
      {
        search: searchText,
        queryType: 'semantic',
        semanticConfiguration: 'default',
        captions: 'extractive',
        answers: 'extractive|count-3',
        queryLanguage: 'en-US',
        select: 'title,content,url',
        top: 3,
        vectorQueries: [
          {
            vector: embeddings,
            k: 7,
            fields: 'contentVector',
            kind: 'vector',
            exhaustive: true
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.searchApiKey,
        },
      },
    );

    if (!response.data?.value || !Array.isArray(response.data.value)) {
      throw new Error('Failed to retrieve search results');
    }

    const documentContents = response.data.value
      .map((doc: any) => {
        const title = doc.title?.includes('/') ? doc.title.split('/').pop().replace("%20", " ") : doc.title?.replace("%20", " ");
        const price = doc.price ? `$${doc.price}` : 'Price not available';  //for price
        return `[${title}]::[${doc.content}]::[${doc.price}]::[${doc.url}]`;
      })
      .filter((content: string) => content)
      .join('\r');
       console.log(documentContents,"tester docs")
    return documentContents;
    
  }
 

  async getChatCompletion(history: string[], lastQuestion: string, documentContents: string, site: string): Promise<any> {
    if (!history || !lastQuestion || !documentContents || !site) {
      throw new Error('Invalid input: history, lastQuestion, documentContents, and site must be provided');
    }

    const prompt = `
      ## Context Information Begins ##
      ${documentContents}
      ## Context Information Ends ##
      The above context information is gathered from multiple documents & products/services of '${site}', but it doesnt include the complete list of products/services available and strictly follows "[Document Name]::[Document Content]::[Document Url]" format.

      Your response should strictly be a json with following format:
      {
          "answer": // the answer to the question. answer should only provide information specific to the question and any additional information that might be relevant to the user. the answer should also include links to supporting documents that were used to get the answer e.g. GCC offers trips to italy [italy document 1 Name (italy document 1 Url)] [italy document 2 Name(italy document 2 Url)].
          "thoughts": // brief thoughts on how you came up with the answer, this should include the name of the documents used and logic that was applied.,
          "dataPoints": // documents that were cross referenced for finding the answer as a json array
            [{
            "title": // document title,
            "content": // document content trimmed to first 50 characters,
            "price": // document price,
            "url": // document url,
            }]
      }
    `;

    const messages = [
      {
        content: prompt,
        role: 'system',
      },
      ...history.map((content, idx) => ({
        content: content || '',
        role: idx % 2 === 0 ? 'user' : 'assistant',
      })),
      {
        content: lastQuestion,
        role: 'user',
      },
    ];

    const response = await axios.post(
      this.openAiApiUrl,
      { messages },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.openAiApiKey,
        },
      },
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Failed to get chat completion');
    }

    const content = response.data.choices[0].message.content.trim();

    // Attempt to parse the content as JSON
    try {
      const parsedContent = JSON.parse(content);
      return parsedContent;
    } catch (error) {
      // If parsing fails, return the content as is
      return { message: content };
    }
  }

  async makeSearchRequest(userQuery:string, site: string): Promise<any> {
    const url = "https://gptkb-het5qkitjshd4.search.windows.net/indexes/commercechat-index/docs/search?api-version=2024-05-01-preview&$filter=Brand eq '" + site + "'";
    const headers = {
        "accept": "*/*",
        "api-key": "MyZDrDoaS5avQIuN3Atcio5DomPV6nWQFqrkvwBLBhAzSeBpZWmK",
        "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktRMnRBY3JFN2xCYVZWR0JtYzVGb2JnZEpvNCIsImtpZCI6IktRMnRBY3JFN2xCYVZWR0JtYzVGb2JnZEpvNCJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8yODVmMDc3NC0yZjY5LTQ2NTctOWI1MS02YzM0ZTAzMzc1MzIvIiwiaWF0IjoxNzIzNjQ2NzE5LCJuYmYiOjE3MjM2NDY3MTksImV4cCI6MTcyMzY1MTM1MCwiYWNyIjoiMSIsImFpbyI6IkFZUUFlLzhYQUFBQVg5WXpWZ0JoNFdIMjhIQ294TUxKL09OZ002d3V4RVZCOUk3Q3VRNWszSndmK25UK0FkTVZTazZLZ1lHMHljWjE0dFRyOGhCWmxJcGlkOGtyb05VeTlLNmFUU0RWaEphQzgvNG53R3dIenhkWHZIZm92WWVhRzNEUWJVckJMV1BxRUxGQzl5S0tJMmRuMW9xOHg0Y2xtTytodnFUU05mcFBwWnUrWjNUb1BXdz0iLCJhbHRzZWNpZCI6IjU6OjEwMDNCRkZEQUE4MzI0MkUiLCJhbXIiOlsicHdkIiwicnNhIl0sImFwcGlkIjoiYzQ0YjQwODMtM2JiMC00OWMxLWI0N2QtOTc0ZTUzY2JkZjNjIiwiYXBwaWRhY3IiOiIwIiwiZW1haWwiOiJzaGFtc2hlci5zaW5naEBhbHR1ZG8uY28iLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9iOWQ2OTE5Ny1jZTFmLTQ5MDctOTU0NS1iMzA3YWYyMzM1ZTkvIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMjYwNzpmZWE4OjJkMWQ6MjgwMDo5Y2I3OjE0ODc6NmQyYzoyYTBhIiwibmFtZSI6IlNoYW1zaGVyIFNpbmdoIiwib2lkIjoiMzA5OGRmZGEtMTAzNy00NzFhLWJhMDItMzEzMWU4YzlhM2ZlIiwicHVpZCI6IjEwMDMyMDAyODVBRjVCQ0MiLCJyaCI6IjAuQVNzQWRBZGZLR2t2VjBhYlVXdzA0RE4xTWtaSWYza0F1dGRQdWtQYXdmajJNQk1yQUo4LiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6IkhSelRfSW1VQ1pMUWVYNC1KZjBXVjhEYzR0NTBfWVNzaFFyWXFqT2ozalEiLCJ0aWQiOiIyODVmMDc3NC0yZjY5LTQ2NTctOWI1MS02YzM0ZTAzMzc1MzIiLCJ1bmlxdWVfbmFtZSI6InNoYW1zaGVyLnNpbmdoQGFsdHVkby5jbyIsInV0aSI6InZWRklCQnoxSWtTVGZIRlNVcmFjQUEiLCJ2ZXIiOiIxLjAiLCJ4bXNfZWRvdiI6dHJ1ZSwieG1zX2lkcmVsIjoiNSAyMCIsInhtc190Y2R0IjoxNTMxOTg1ODAyfQ.e-wUI-Fz-TnDH2HsYhFMQQTPYDxC3l4sLjJoXPfas-44OmiCN4Ldd-9jpdLa3GrPTfKCHpgXeDJ7bFfPxpaNAGfHPNKSE8Q7EV2tNm-lj6rYTLbtb4CSu1H4YGLEGtpPGYg0qK8rqEk89cR7jMEW62e4e8zdsXGcvDgJ77V4BaLVV6-N7PVa5AXVYygG-XZduggSU5OVrQ98CpdRS8TnhqPdiCyl24sMA5FQvPZJeGyd5sQliKYtFwKnIBYr2aEeQ7_U3SOUhQAERTxBjMgyX78p0ahtic_oNS_3wJkPwFdhJw1mZFWOQV32XFjUCc3uvj5LFCZdeDw33Ut3zQrIpA",
        "content-type": "application/json"
    };

    const data = {
        search: userQuery
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        console.log(responseData);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return responseData.value;
    } catch (error) {
        console.error('Error making request:', error);
    }
  }

  async processOrder(searchResult: string, userQuery: string): Promise<any> {
    const headers = {
        "Content-Type": "application/json",
        "api-key": this.openAiApiKey
    };

    const data = {
        messages: [
            {
                role: "system",
                content: "You are an AI model on an ecommerce site. Don't make assumptions about what values to use with functions. Ask for clarification if a required parameter for a function is missing."
            },
            {
                role: "assistant",
                content: searchResult
            },
            {
                role: "user",
                content: userQuery
            },
        ],
        tools: [
            {
                "type": "function",
                "function": {
                  "name": "processOrder",
                  "description": "Process an checkout order based on the details provided by the user",
                  "parameters": {
                    "type": "object",
                    "properties": {
                      "products": {
                        "type": "array",
                        "description": "List of products in the order",
                        "items": {
                          "type": "object",
                          "properties": {
                            "product_id": {
                              "type": "string",
                              "description": "The unique identifier of the product. defaults to Slug"
                            },
                            "order_quantity": {
                              "type": "integer",
                              "description": "Quantity of the product ordered"
                            },
                            "unit_price": {
                              "type": "number",
                              "description": "Unit price of the product"
                            },
                            "subtotal": {
                              "type": "number",
                              "description": "Subtotal for the product"
                            }
                          },
                          "required": ["product_id", "order_quantity", "unit_price", "subtotal"]
                        }
                      },
                      "status": {
                        "type": "integer",
                        "description": "Status of the order. defaults to 1."
                      },
                      "amount": {
                        "type": "number",
                        "description": "Total amount of the order"
                      },
                      "coupon_id": {
                        "type": "string",
                        "description": "default value: null"
                      },
                      "discount": {
                        "type": "number",
                        "description": "default value: 0"
                      },
                      "paid_total": {
                        "type": "number",
                        "description": "Total amount paid for the order"
                      },
                      "sales_tax": {
                        "type": "number",
                        "description": "Sales tax applied to the order"
                      },
                      "delivery_fee": {
                        "type": "number",
                        "description": "Delivery fee for the order. defaults to 0"
                      },
                      "total": {
                        "type": "number",
                        "description": "Total order amount including fees and taxes."
                      },
                      "delivery_time": {
                        "type": "string",
                        "description": "Delivery time for the order. defaults to 'Express Delivery'"
                      },
                      "payment_gateway": {
                        "type": "string",
                        "description": "Payment gateway used for the order. defaults to 'CASH_ON_DELIVERY'"
                      },
                      "use_wallet_points": {
                        "type": "boolean",
                        "description": "Whether wallet points were used for the order. defaults to false"
                      },
                      "billing_address": {
                        "type": "object",
                        "description": "Billing address for the order",
                        "properties": {
                          "country": {
                            "type": "string" ,
                            "description": "country for billing address. defaults to ''"
                            },
                          "city": {
                            "type": "string",
                            "description": "city for billing address. defaults to ''"
                            },
                          "state": {
                            "type": "string",
                            "description": "state for billing address. defaults to ''"
                            },
                          "zip": {
                            "type": "string",
                            "description": "zip for billing address. defaults to ''"
                            },
                          "street_address": {
                            "type": "string",
                            "description": "address for billing address. defaults to ''"
                            },
                          "phone": {
                            "type": "string",
                            "description": "phone for billing address. defaults to ''"
                            }
                        },
                        "required": ["country", "city", "state", "zip", "street_address", "phone"]
                      },
                      "shipping_address": {
                        "type": "object",
                        "description": "Shipping address for the order",
                        "properties": {
                            "country": {
                              "type": "string" ,
                              "description": "country for shipping address. defaults to ''"
                              },
                            "city": {
                              "type": "string",
                              "description": "city for shipping address. defaults to ''"
                              },
                            "state": {
                              "type": "string",
                              "description": "state for shipping address. defaults to ''"
                              },
                            "zip": {
                              "type": "string",
                              "description": "zip for shipping address. defaults to ''"
                              },
                            "street_address": {
                              "type": "string",
                              "description": "address for shipping address. defaults to ''"
                              },
                            "phone": {
                              "type": "string",
                              "description": "phone for shipping address. defaults to ''"
                              }
                          },
                        "required": ["country", "city", "state", "zip", "street_address", "phone"]
                      }
                    },
                    "required": [
                      "products",
                      "status",
                      "amount",
                      "paid_total",
                      "sales_tax",
                      "delivery_fee",
                      "total",
                      "delivery_time",
                      "payment_gateway",
                      "use_wallet_points",
                      "billing_address",
                      "shipping_address"
                    ]
                  }
                }
              }
        ],
        tool_choice: "auto",
        temperature: 0,
        top_p: 1,
        max_tokens: 800,
        stop: null,
        stream: false
    };

    try {
      const response = await fetch(this.openAiApiUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data)
      });
      const responseData = await response.json();
      console.log(responseData)
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the JSON to extract the function name from tool_calls
      const choices = responseData.choices;
      let functionResponse: string | null = null;
      if (choices && choices.length > 0) {
          const toolCalls = choices[0].message.tool_calls;
          if (toolCalls && toolCalls.length > 0) {
            functionResponse = toolCalls[0].function.arguments;
          }
      }
      if (functionResponse) {
          console.log(`Function name extracted: ${functionResponse}`);
      } else {
          console.log('No function name found in the response.');
      }
      return functionResponse;
  } catch (error) {
      console.error('Error making request:', error);
  }
  }

  async validateOrderJson(orderJson: string, history: string[], lastQuestion: string): Promise<any> {
    const headers = {
        "Content-Type": "application/json",
        "api-key": this.openAiApiKey
    };

    const data = {
        messages:[
            {
                role: "system",
                content: `You are an AI model on an ecommerce site that takes a checkout json as input, validates the json againt a schema. Also verify the last user message and make updates to the JSON if required before returning back the modified checkout json.
                the sample JSON schema is {"$schema":"http://json-schema.org/draft-07/schema#","type":"object","properties":{"products":{"type":"array","items":{"type":"object","properties":{"product_id":{"type":"string"},"order_quantity":{"type":"integer"},"unit_price":{"type":"number"},"subtotal":{"type":"number"}},"required":["product_id","order_quantity","unit_price","subtotal"]}},"status":{"type":"integer"},"amount":{"type":"number"},"coupon_id":{"type":["string","null"]},"discount":{"type":"number"},"paid_total":{"type":"number"},"sales_tax":{"type":"number"},"delivery_fee":{"type":"number"},"total":{"type":"number"},"delivery_time":{"type":"string"},"payment_gateway":{"type":"string"},"use_wallet_points":{"type":"boolean"},"billing_address":{"type":"object","properties":{"country":{"type":"string"},"city":{"type":"string"},"state":{"type":"string"},"zip":{"type":"string"},"street_address":{"type":"string"},"phone":{"type":"string"}},"required":["country","city","state","zip","street_address"]},"shipping_address":{"type":"object","properties":{"country":{"type":"string"},"city":{"type":"string"},"state":{"type":"string"},"zip":{"type":"string"},"street_address":{"type":"string"},"phone":{"type":"string"}},"required":["country","city","state","zip","street_address"]}},"required":["products","status","amount","coupon_id","discount","paid_total","sales_tax","delivery_fee","total","delivery_time","payment_gateway","use_wallet_points","billing_address","shipping_address"]}

                If any of the attributes is missing, you will ask the user to provide the same in order to process the order successfully.
                {
                  "userMessage": // friendly user message highlighting any updates made to the order along with listing the missing attributes,
                  "updatedJson": // json after making any updates that the user has specified or adding missing attributes
                }
                Ensure that you use a user friendly description for each attribute.

                If all the attributes are available, you will return the modified json after adding the missing attributes provided by the user in the following format.
                {
                  "userMessage": // friendly user message highlighting that all the required information is available and order will be processed shortly,
                  "finalJson": // updated json
                }
                  `
            },
            {
                role: "user",
                content: JSON.stringify(orderJson)
            },
            ...history
              .map((content, idx) => ({
                  content: content || '',
                  role: idx % 2 === 0 ? 'user' : 'assistant',
              }))
              .filter(message => message.role === 'user'),
            {
              content: lastQuestion,
              role: 'user',
            }
        ],
        temperature: 0,
        top_p: 1,
        max_tokens: 800,
        stop: null,
        stream: false
    };

    try {
      const response = await fetch(this.openAiApiUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data)
      });
      const responseData = await response.json();
      console.log(responseData)
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the JSON to extract the function name from tool_calls
      const choices = responseData.choices;
      let functionResponse: string | null = null;
      if (choices && choices.length > 0) {
        functionResponse =  JSON.parse(choices[0].message.content);
      }
      if (functionResponse) {
          console.log(`Function name extracted: ${functionResponse}`);
      } else {
          console.log('No function name found in the response.');
      }
      console.log(functionResponse ,)
      return functionResponse;
  } catch (error) {
      console.error('Error making request:', error);
  }
  }

}
