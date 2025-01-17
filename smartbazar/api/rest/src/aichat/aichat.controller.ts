// src/chat/chat.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AiChatService } from './aichat.service';

@Controller('/chat')
export class AiChatController {
  constructor(private readonly chatService: AiChatService) {}

  @Post()
  async handleChat(@Body() body: { history: string[]; lastQuestion: string; site: string; checkoutObject:any, stream?: boolean }) {
    const { history, lastQuestion, site, checkoutObject } = body;
    let queryInfo;
    if (lastQuestion) {
      if(!checkoutObject){
        
        queryInfo = await this.chatService.identifyQueryType(history, lastQuestion);
        console.log(history , 'history' , 'lastQue', lastQuestion);
        if(!queryInfo.isCheckoutQuery){
          let documentContents:any = await this.chatService.searchDocuments(queryInfo.searchObject.keywords || 'information');
          let searchQueryResult = await this.chatService.makeSearchRequest(queryInfo.searchObject.keywords, site);
          const productsContents = searchQueryResult
          .map((doc: any, index: number) => {
              const title = doc?.Name || 'Unknown Title';
              const content = doc?.Description || 'No content available';
              const url = doc?.Slug ? `https://example.com/products/${doc.Slug}` : 'No URL';
              return `[${title}]::[${content}]::[${url}]`;
          })
          .filter((content: string) => content)
          .join('\r');      
          documentContents += productsContents;
          const chatCompletion = await this.chatService.getChatCompletion(history, lastQuestion, documentContents, site);
          let returnObject  = {
            queryType : 'information',
            userMessage : '',
            responseContent : chatCompletion
          }
          return returnObject;
        }else{
          let returnObject  = {
            queryType : 'checkoutInitiate',
            userMessage: queryInfo.userMessage,
            responseContent : queryInfo.checkoutObject
          }
          return returnObject;
        }
      }else{
        let returnObject = {
          queryType : 'checkout',
          userMessage: '',
          responseContent : {},
        } 
        if(!checkoutObject.checkoutJson){
          let searchQueryResult = await this.chatService.makeSearchRequest(checkoutObject.products, site);
          checkoutObject.checkoutJson= await this.chatService.processOrder(JSON.stringify(searchQueryResult), checkoutObject.simplifiedQuery);
        }

        const aiValidateJsonResponse = await this.chatService.validateOrderJson(checkoutObject.checkoutJson, history, lastQuestion);
        returnObject.userMessage = aiValidateJsonResponse.userMessage;
        if(aiValidateJsonResponse.finalJson){
          checkoutObject.checkoutJson = aiValidateJsonResponse.finalJson;
          checkoutObject.checkoutReady = true;
        }else if(aiValidateJsonResponse.updatedJson){
          checkoutObject.checkoutJson = aiValidateJsonResponse.updatedJson;
          checkoutObject.checkoutReady = false;
        }


        returnObject.responseContent = checkoutObject;

        return returnObject;
      }
    }
    else{
    return { response: "Please Enter a Valid Prompt" };
    }
  }
}
