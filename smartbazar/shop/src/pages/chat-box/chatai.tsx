'use client';
import Image from 'next/image';
import SparkComponent from '@/assets/svgs/Spark';
import SendComponent from '@/assets/svgs/Send';
import DeleteComponent from '@/assets/svgs/Delete';
import MicComponent from '@/assets/svgs/Mic';
import { siteSettings } from '@/settings/site';
import { productPlaceholder } from '@/lib/placeholders';
import { useEffect, useRef, useState } from 'react';
import { ChatSubmit } from '../../framework/rest/chat';
import { useQuery } from 'react-query';
import { BulletList } from 'react-content-loader';
interface ChatContentType {
  type: string;
  content: string;
  isProgress?: Boolean;
  Timing?: any;
  Storage?: any;
  Button?: any;
  Thoughts?: string;
} 

function ChatAi() {
  const [inputCount, setInputCount] = useState(0);
  const [message, setMessage] = useState<string>('');
  const [click, setClick] = useState(false);
  const [msgs, setMsgs] = useState<Array<ChatContentType>>([]);
  const [isShow, setIsShow] = useState(false);

  const handleInputCount = (e: any) => {
    e.preventDefault();
    const value = e.target.value;
    setMessage(value);
    setInputCount(value.length);
  };

  const callChat = async () => {
    const MyArray = [
      ...msgs,
      {
        type: 'user',
        content: message,
        Timing: new Date().toLocaleString('en-US'),
      },
    ];
    const history = [...MyArray];
    const chatHistory = JSON.stringify(history);
    localStorage.setItem('History', chatHistory);
    setMsgs(MyArray);
    setMessage('');
    setInputCount(0);
    setMsgs([
      ...MyArray,
      {
        type: 'Ai',
        isProgress: true,
        content: 'Im Generating a Response...Pleas Wait',
      },
    ]);
    const getHistory = localStorage.getItem('History');

    const { data } = await ChatSubmit(getHistory);
   
    console.log(data);
  
    setTimeout(() => {
      let thoughts:string;
      let content:string;
      if(data){
        content=data.response.answer;
        thoughts= data.response.thoughts;
      }
      else{
         content= "I couldn’t find any related information from the documents supplied to me,please browse the website";
      }
      setMsgs([
        ...MyArray,
        {
          type: 'Ai',
          isProgress: false,
          Button: <SparkComponent />,
          Thoughts: data.response.thoughts,
          content: data.response.answer,
        },
      ]);
    }, 2000);

  };
  const HandleKeyUp = async (e: any) => {
    if (e.key === 'Enter') 
      {
      // debugger
      e.preventDefault();
      callChat();
    }
  };

  const handleClick = async (e: any) => {
    callChat();
  };
  const handleShow = () => {
    setIsShow((current) => !current);
  };
  const handleDelete = () => {
    setMsgs([]);
  };
  return (
    <>
      <div className="h-auto w-full font-mono">
        {msgs.length == 0 ? (
          <div id="Top-sec " className="p-1">
            <article className="my-4 flex w-full flex-col items-center justify-center text-5xl font-medium">
              {/*    */}
              <SparkComponent width="70" height="70" />
              <p>Interact With</p>
            </article>
            <div className="flex flex-wrap items-center justify-center gap-10 text-8xl">
              <p>AI</p>
              <Image
                src={
                  siteSettings?.chatAi?.chatCircle?.src ?? productPlaceholder
                }
                width={70}
                height={70}
                alt={siteSettings?.chatAi?.chatCircle?.alt}
              />
              <p>Engage</p>
              <div className="my-auto flex h-20 w-full flex-wrap items-center justify-center gap-8 text-lg">
                <div className="w-50 h-10 cursor-pointer border-4 border-solid border-yellow-400 px-5 shadow-xl hover:border-yellow-600"></div>
                <div className="w-50 h-10 cursor-pointer border-4 border-solid border-yellow-400 px-5 shadow-xl hover:border-yellow-600"></div>
                <div className="w-50 h-10 cursor-pointer border-4 border-solid border-yellow-400 px-5 shadow-xl hover:border-yellow-600"></div>
              </div>
            </div>
          </div>
        ) : (
          <div
            id="Chat-reqs"
            className="flex w-full flex-col items-center justify-center gap-5 p-4"
          >
            <div className="my-5 flex items-center justify-evenly text-5xl font-bold">
              AI
              <Image
                src={
                  siteSettings?.chatAi?.chatCircle?.src ?? productPlaceholder
                }
                width={40}
                height={40}
                alt={siteSettings?.chatAi?.chatCircle?.alt}
              />{' '}
              Engage
            </div>
            {msgs.map((msg, i) => {
              if (msg.type == 'user')
                return (
                  <div className="flex w-full flex-col items-end">
                    <span
                      className="mb-2 mt-2 w-2/6 overflow-hidden rounded-lg bg-yellow-400 px-2 py-4 text-right shadow-lg"
                      key={i}
                    >
                      {msg.content}
                      <p className="text-sm">Asked at {msg.Timing} </p>
                    </span>
                  </div>
                );
              else {
                if (msg.isProgress)
                  return (
                    <div className="flex w-full flex-col flex-wrap items-start justify-center ">
                      <span className="relative mb-2 mt-2 w-2/3 overflow-hidden rounded-md border border-solid border-yellow-400 bg-white px-2 py-4 shadow-lg">
                        {msg.content}
                    
                       
                      </span>
                    </div>
                  );
                else
                  return (
                    <div className="flex w-full flex-col items-start">
                      <span className="relative mb-2 mt-2 w-2/3 overflow-hidden rounded-md border border-solid border-yellow-400 bg-white px-2 py-4 shadow-lg">
                        {msg.content}
                        <button
                          onClick={handleShow}
                          className="bg-blend absolute right-0 bottom-2 bg-white hover:bg-yellow-100"
                        >
                          {msg.Button}
                        </button>
                        {isShow && (
                          <p className="mt-7 font-sans text-lg font-semibold">
                            {msg.Thoughts}
                          </p>
                        )}
                      </span>
                    </div>
                  );
              }
            })}
          </div>
        )}
        <div className="hero bg-gredient-dark h-400px flex w-full max-w-full flex-col px-2">
          <div className="search-box mx-auto my-auto flex w-full flex-wrap items-center justify-between sm:w-full md:w-full lg:w-full xl:w-full">
            <div className="relative mt-10 w-11/12 rounded-lg border border-yellow-400 p-2">
              <h2 className="absolute -top-1/4 translate-y-1/2 bg-white text-yellow-400">
                Prompt
              </h2>
              <div className="flex flex-row">
                <input
                  className="text-grey-darker h-20 w-full border border-gray-100 border-transparent py-1 px-2 text-lg font-medium text-gray-600 outline-none focus:border-transparent focus:ring-0
                    "
                  type="text"
                  placeholder="Ask me anything..."
                  onChange={handleInputCount}
                  value={message}
                  onKeyUp={HandleKeyUp}
                />
                <span className="items-centerrounded text-grey-100 flex rounded-l-none border-0 px-3 font-bold">
                  <button className="w-full" onClick={handleClick}>
                    <SendComponent width="35" height="35" />
                  </button>
                </span>
              </div>
              <div className="rounded-s-full cursor:pointer absolute right-0 top-0 bg-yellow-400">
                <button>
                  <MicComponent width="25" height="20" />
                </button>
              </div>
            </div>
            <div className="mt-9 px-2 ">
              <button
                className="flex h-12 w-12 items-center justify-center rounded-full 
                       bg-gray-300 text-center text-white shadow-lg hover:bg-yellow-400"
                onClick={handleDelete}
              >
                <DeleteComponent width="20" />
              </button>
            </div>
          </div>
          <div className="md:none mt-1 flex w-11/12 items-center justify-between px-2 text-xs text-gray-400">
            <p>Use Shift + Enter for new lines</p>
            <p>{inputCount}/1000</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatAi;
