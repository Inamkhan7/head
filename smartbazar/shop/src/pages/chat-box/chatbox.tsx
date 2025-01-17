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
import { useCreateOrder, useOrderStatuses } from '@/framework/order';
import { useUser } from '@/framework/user';
import CartCounterButton from '@/core/atoms/cart/cart-counter-button';
import { useProduct } from '../../framework/rest/product';
import { useCart } from '@/store/quick-cart/cart.context';
import useSingleProduct from '../../framework/rest/singleProduct';
interface ChatContentType {
  type: string;
  content: string;
  isProgress?: Boolean;
  Timing?: any;
  Storage?: any;
  Button?: any;
  Thoughts?: string;
  DataPoints?: { title: string; content: string; url: string }[];
  responseContent?: any;
}

function ChatBox() {
  const { addItemToCart, items, totalUniqueItems, total } = useCart();
  const [inputCount, setInputCount] = useState(0);
  const [message, setMessage] = useState<string>('');
  const [click, setClick] = useState<any>();
  const { createOrder, isLoading } = useCreateOrder();
  const [msgs, setMsgs] = useState<Array<ChatContentType>>([]);
  const [checkoutJson, setCheckoutJson] = useState<string>();
  const [copySuccess, setCopySuccess] = useState('');
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [productSlug, setProductSlug] = useState();
  const [productQty, setProductQty] = useState();
  const textRef: any = useRef();
  const productAddedRef = useRef(false);
  const { me } = useUser();

  const handleInputCount = (e: any) => {
    e.preventDefault();
    const value = e.target.value;
    setMessage(value);
    // setInputCount(value.length);
  };

  const copyToClipboard = () => {
    const text = textRef.current.innerText;
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
      },
      (err) => {
        setCopySuccess('Failed to copy!');
        setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
      }
    );
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
    if (history) {
      const chatHistory = JSON.stringify(history);
      localStorage.setItem('History', chatHistory);
    }
    if (checkoutJson) {
      const orderJsonString = JSON.stringify(checkoutJson);
      localStorage.setItem('CheckoutJson', orderJsonString);
    }

    setMsgs(MyArray);
    setMessage('');
    // setInputCount(0);
    setMsgs([
      ...MyArray,
      {
        type: 'Ai',
        isProgress: true,
        content: 'Im Generating a Response...Please Wait',
      },
    ]);
    const getHistory = localStorage.getItem('History');
    const getOrderJson = localStorage.getItem('CheckoutJson');
    const localHistory = getHistory ? JSON.parse(getHistory) : [];
    let orderJson;
    if (getOrderJson) {
      orderJson = {
        checkoutJson: JSON.parse(getOrderJson),
      };
    }
    const apiResponse = await ChatSubmit(localHistory, orderJson);
    if (apiResponse) {
      processChatResponse(apiResponse); // Extract this logic into a function
    } else {
      console.error('No chat response received.');
    }
    async function processChatResponse(apiResponse: any) {
      let thoughts: string;
      let content: string;
      let queryType: string = 'information';
      if (apiResponse) {
        // debugger
        queryType = apiResponse?.queryType;
        let responseContent = apiResponse?.responseContent;
        if (queryType == 'information') {
          console.log(apiResponse);
          content = responseContent?.answer ?? responseContent?.message;
          thoughts = responseContent?.thoughts;

          setMsgs([
            ...MyArray,
            {
              type: 'Ai',
              isProgress: false,
              Button: <SparkComponent />,
              Thoughts: responseContent?.thoughts,
              content: responseContent?.answer ?? responseContent?.message,
              DataPoints: responseContent?.dataPoints ?? [],
            },
          ]);
        } else {
          // debugger
          console.log(apiResponse);
          if (
            apiResponse.responseContent &&
            apiResponse.responseContent.checkoutJson &&
            apiResponse.responseContent.checkoutJson.products
          ) {
            const products = apiResponse.responseContent.checkoutJson.products;

            products.forEach((product) => {
              console.log(`Product ID: ${product.product_id}`);
              console.log(`Unit Price: ${product.unit_price}`);
              console.log(`Order Quantity: ${product.order_quantity}`);
              console.log(`Subtotal: ${product.subtotal}`);
            });
          }
          const products = apiResponse?.responseContent?.checkoutJson?.products;
          console.log(products, 'products');
          if (products && products.length > 0) {
            let lastProductId =
              products[products.length - 1]?.product_name ??
              apiResponse.responseContent.checkoutJson.products[
                products.length - 1
              ].product_id;
            // ?? products[products.length - 1]?.product_slug;
            console.log(
              lastProductId.toLowerCase().replace(/\s+/g, '-'),
              'last product slug'
            );
            let lastProductQty = products[products.length - 1]?.order_quantity;
console.log(lastProductId , 'lastProductId')
            setProductSlug(lastProductId.toLowerCase().replace(/\s+/g, '-'));
            setProductQty(lastProductQty);
          } else {
            setProductSlug(
              apiResponse.responseContent.products
                ?.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/--+/g, '-')
                .trim() ||
                products
                  ?.toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^\w\-]+/g, '')
                  .replace(/--+/g, '-')
                  .trim()
            );
          }
          content = apiResponse.userMessage;
          thoughts = '';
          if (responseContent?.checkoutJson) {
            setCheckoutJson(responseContent?.checkoutJson);
            localStorage.setItem(
              'CheckoutJson',
              JSON.stringify(responseContent?.checkoutJson)
            );
          }
          setMsgs([
            ...MyArray,
            {
              type: 'Ai',
              isProgress: false,
              Button: <SparkComponent />,
              Thoughts: '',
              content: apiResponse.userMessage,
              DataPoints: [],
            },
          ]);
          if (responseContent.checkoutReady) {
            localStorage.removeItem('CheckoutJson');
            localStorage.removeItem('History');
            let addresses = me?.address;
            let checkoutJson = responseContent.checkoutJson;
            // Update orderJson with the correct address IDs
            if (addresses && checkoutJson) {
              checkoutJson = updateAddressIds(checkoutJson, addresses);
            }
            localStorage.setItem(
              'billingAddressDetail',
              JSON.stringify(checkoutJson?.billing_address)
            );
            localStorage.setItem(
              'shippingAddressDetail',
              JSON.stringify(checkoutJson?.shipping_address)
            );

            createOrder(checkoutJson);
          }
          if (queryType == 'checkoutInitiate') {
            // debugger
            var checkoutObject = {
              products: responseContent.products,
              simplifiedQuery: responseContent.simplifiedQuery,
            };
            let checkoutResponse = await ChatSubmit(
              localHistory,
              checkoutObject
            );
            processChatResponse(checkoutResponse);
          }
        }
      } else {
        content =
          'I couldn’t find any related information from the documents supplied to me,please browse the website';
      }
    }
  };
  const HandleKeyUp = async (e: any) => {
    if (e.key === 'Enter') {
      // debugger
      e.preventDefault();
      callChat();
    }
  };
  useEffect(() => {
    textRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const handleClick = async (e: any) => {
    callChat();
  };

  function updateAddressIds(orderJson: any, addresses: any) {
    // Function to compare two addresses
    const isAddressMatch = (addr1: any, addr2: any) =>
      addr1.country === addr2.country &&
      addr1.city === addr2.city &&
      addr1.state === addr2.state &&
      addr1.street_address === addr2.street_address &&
      // Loop through each address in the addresses array
      addresses.forEach((address) => {
        // Check if this address matches the billing address in orderJson
        if (
          orderJson.billing_address &&
          isAddressMatch(orderJson.billing_address, address.address)
        ) {
          orderJson.billing_address.id = address.id;
          console.log('Updated billing address ID:', address.id);
        }

        // Check if this address matches the shipping address in orderJson
        if (
          orderJson.shipping_address &&
          isAddressMatch(orderJson.shipping_address, address.address)
        ) {
          orderJson.shipping_address.id = address.id;
          console.log('Updated shipping address ID:', address.id);
        }
      });

    return orderJson;
  }
  // const { product } = useProduct({ slug: productSlug || ''});
  // console.log(product , 'product')

  const { product } = useSingleProduct(productSlug || '');

  useEffect(() => {
    if (product) {
      productAddedRef.current = false; // Reset for new product
    }
  }, [product]);

  useEffect(() => {
    if (product && !productAddedRef.current) {
      addItemToCart(product, productQty ? productQty : 1);
      productAddedRef.current = true;
    }
  }, [product, addItemToCart, productQty]);

  return (
    <>
      <div className="m-5 flex h-auto min-h-[calc(100vh-124px)] w-full flex-col justify-end ">
        {msgs.length == 0 ? (
          <div className="flex w-full max-w-[1400px]  flex-col px-3 text-neutral-700 max-md:mt-10 max-md:max-w-full">
            <div className="text-4xl leading-[64px] tracking-tight max-md:max-w-full">
              Interact with
            </div>
            <div className="mt-2 flex flex-wrap items-start justify-center gap-5 self-start whitespace-nowrap text-7xl font-bold tracking-tight max-md:flex-wrap max-md:text-4xl">
              <div className="my-auto self-stretch max-md:text-4xl">AI</div>
              <Image
                src={
                  siteSettings?.chatAi?.chatCircle?.src ?? productPlaceholder
                }
                width={70}
                height={70}
                alt={siteSettings?.chatAi?.chatCircle?.alt}
              />
              <div className="flex-auto max-md:text-4xl">Engage</div>
            </div>
            <div className="mt-10 text-xl tracking-wide max-md:mt-10 max-md:max-w-full">
              Don’t know where to start? Here are some recommendations...
            </div>
            <div className="mt-5 flex gap-5 max-md:mt-10 max-md:max-w-full max-md:flex-wrap max-md:pr-5">
              <div className="flex flex-col items-start justify-center rounded-xl border border-solid border-stone-300 px-5 py-4">
                <div className="text-sm font-semibold leading-4">
                  Come up with concepts
                </div>
                <div className="mt-1.5 text-xs leading-4">
                  for a retro style arcade game
                </div>
              </div>
              <div className="flex flex-col justify-center rounded-xl border border-solid border-stone-300 px-5 py-4">
                <div className="text-sm font-semibold leading-4">
                  Explain why popcorn pops
                </div>
                <div className="mt-1.5 text-xs leading-4">
                  to a kid who loves to watch in the microvawe
                </div>
              </div>
              <div className="flex flex-col items-start justify-center rounded-xl border border-solid border-stone-300 px-5 py-4">
                <div className="text-sm font-semibold leading-4">
                  Plan a trip
                </div>
                <div className="mt-1.5 text-xs leading-4">
                  to see the nothern lights in norway
                </div>
              </div>
            </div>
            <div className="mt-7 flex gap-5 max-md:max-w-full max-md:flex-wrap max-md:pr-5">
              <div className="flex flex-col items-start justify-center rounded-xl border border-solid border-stone-300 px-5 py-4">
                <div className="text-sm font-semibold leading-4">
                  Give me ideas
                </div>
                <div className="mt-1.5 text-xs leading-4">
                  for what to wear for corporate event
                </div>
              </div>
              <div className="flex flex-col items-start justify-center rounded-xl border border-solid border-stone-300 px-5 py-4">
                <div className="text-sm font-semibold leading-4">
                  Come up with concepts
                </div>
                <div className="mt-1.5 text-xs leading-4">
                  for a retro style arcade game
                </div>
              </div>
              <div className="justify-center rounded-xl border border-solid border-stone-300 bg-white px-5 py-4 text-sm font-semibold leading-4 shadow-sm">
                Share Advantages of Artificial Intelligence
              </div>
            </div>
          </div>
        ) : (
          <div
            id="Chat-reqs"
            className="flex w-full flex-col items-center justify-center pt-20"
          >
            {msgs.map((msg, i) => {
               const uniqueKey = `${i}`;
              if (msg.type == 'user')
                return (
                  <div className="mt-2 flex w-full flex-col items-end" key={uniqueKey}>
                    <div className="flex w-2/6 gap-2.5">
                      <Image
                        src={
                          siteSettings?.chatAi?.chatYou?.src ??
                          productPlaceholder
                        }
                        width={30}
                        height={30}
                        alt={siteSettings?.chatAi?.chatYou?.alt}
                      />
                      <div className="my-auto">You</div>
                    </div>
                    <span
                      className="mb-2 mt-2 w-2/6 overflow-hidden rounded-lg border border-gray-300 px-4 py-4 text-left shadow-lg"
                      key={i}
                    >
                      {msg.content}
                      <p className="mt-2 text-xs">Asked at {msg.Timing} </p>
                    </span>
                  </div>
                );
              else {
                if (msg.isProgress)
                  return (
                    <div className="flex w-full flex-col flex-wrap items-start justify-center ">
                      <div className="flex gap-2.5 self-start text-sm font-medium leading-4 text-neutral-700">
                        <Image
                          src={
                            siteSettings?.chatAi?.chatCircle?.src ??
                            productPlaceholder
                          }
                          width={30}
                          height={30}
                          alt={siteSettings?.chatAi?.chatCircle?.alt}
                        />{' '}
                        <div className="my-auto font-semibold">AI Engage</div>
                      </div>
                      <span
                        ref={textRef}
                        className="relative mb-2 mt-2 w-2/3 overflow-hidden rounded-md border border-solid border-yellow-400 bg-white px-2 py-4 shadow-lg"
                      >
                        {msg.content}
                      </span>
                    </div>
                  );
                else
                  return (
                    <div className="flex w-full flex-col items-start">
                      <div className="flex gap-2.5 self-start text-sm font-medium leading-4 text-neutral-700">
                        <Image
                          src={
                            siteSettings?.chatAi?.chatCircle?.src ??
                            productPlaceholder
                          }
                          width={30}
                          height={30}
                          alt={siteSettings?.chatAi?.chatCircle?.alt}
                        />
                        <div className="my-auto font-semibold">AI Engage</div>
                      </div>
                      <span className="relative mb-2 mt-2 w-2/3 overflow-hidden rounded-md border border-solid border-yellow-400 bg-white p-4 shadow-lg">
                        <div ref={textRef}>{msg.content}</div>
                        {msg.DataPoints && msg.DataPoints.length > 0 && (
                          <div className="mt-4">
                            <h3 className="text-lg font-semibold">
                              Related Documents
                            </h3>
                            <div className="flex gap-4">
                              {msg.DataPoints.map((point, idx) => (
                                <a
                                  key={idx}
                                  href={point.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 rounded-md bg-gray-100 p-2 shadow-md hover:bg-gray-200"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    x="0px"
                                    y="0px"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 128 128"
                                  >
                                    <path
                                      fill="#FFF"
                                      d="M94.5,112h-61c-5.5,0-10-4.5-10-10V22c0-5.5,4.5-10,10-10h61c5.5,0,10,4.5,10,10v80C104.5,107.5,100,112,94.5,112z"
                                    ></path>
                                    <path
                                      fill="#C7D7E2"
                                      d="M33.5 22H94.5V37H33.5zM88.5 57h-51c-1.7 0-3-1.3-3-3s1.3-3 3-3h51c1.7 0 3 1.3 3 3S90.2 57 88.5 57zM88.5 72h-51c-1.7 0-3-1.3-3-3s1.3-3 3-3h51c1.7 0 3 1.3 3 3S90.2 72 88.5 72zM64 87H37.5c-1.7 0-3-1.3-3-3s1.3-3 3-3H64c1.7 0 3 1.3 3 3S65.7 87 64 87z"
                                    ></path>
                                    <path
                                      fill="#454B54"
                                      d="M94.5,115h-61c-7.2,0-13-5.8-13-13V22c0-7.2,5.8-13,13-13h61c7.2,0,13,5.8,13,13v80C107.5,109.2,101.7,115,94.5,115z M33.5,15c-3.9,0-7,3.1-7,7v80c0,3.9,3.1,7,7,7h61c3.9,0,7-3.1,7-7V22c0-3.9-3.1-7-7-7H33.5z"
                                    ></path>
                                  </svg>
                                  <span className="max-w-[30ch] truncate text-gray-700">
                                    {point.title}
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Check if checkoutJson exists and render the product checkout details */}
                        {msg.responseContent?.checkoutJson &&
                          msg.responseContent.checkoutJson.products.length >
                            0 && (
                            <div className="mt-4">
                              <h3 className="text-lg font-semibold">
                                Checkout Summary
                              </h3>
                              <div className="flex flex-col gap-4">
                                {msg.responseContent.checkoutJson.products.map(
                                  (product, idx) => (
                                    <div
                                      key={idx}
                                      className="rounded-md bg-gray-100 p-4 shadow-md"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="max-w-[30ch] truncate font-semibold text-gray-700">
                                          {product.product_id}
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        <p>
                                          Quantity: {product.order_quantity}
                                        </p>
                                        <p>Unit Price: ${product.unit_price}</p>
                                        <p className="font-bold">
                                          Subtotal: ${product.subtotal}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        <div className="mt-9 flex w-full justify-between gap-5 max-md:mr-1.5 max-md:max-w-full max-md:flex-wrap max-md:pr-5">
                          <div className="flex justify-between gap-5 self-start text-xs leading-4 text-neutral-700">
                            <div className="flex cursor-pointer">
                              <Image
                                src={
                                  siteSettings?.chatAi?.chatSpeak?.src ??
                                  productPlaceholder
                                }
                                width={15}
                                height={15}
                                alt={siteSettings?.chatAi?.chatSpeak?.alt}
                              />
                            </div>
                            <div>
                              <button
                                className="flex cursor-pointer gap-2"
                                onClick={copyToClipboard}
                              >
                                <Image
                                  src={
                                    siteSettings?.chatAi?.chatCopy?.src ??
                                    productPlaceholder
                                  }
                                  width={15}
                                  height={15}
                                  alt={siteSettings?.chatAi?.chatCopy?.alt}
                                />
                                <div className="hover:bg-gray-200">
                                  Copy Text
                                </div>

                                {copySuccess && (
                                  <p
                                    style={{
                                      color:
                                        copySuccess === 'Copied!'
                                          ? 'green'
                                          : 'red',
                                      marginTop: '0px',
                                    }}
                                  >
                                    {copySuccess}
                                  </p>
                                )}
                              </button>
                            </div>
                            <div className="flex cursor-pointer gap-2">
                              {}
                              <Image
                                src={
                                  siteSettings?.chatAi?.chatRegen?.src ??
                                  productPlaceholder
                                }
                                width={15}
                                height={15}
                                alt={siteSettings?.chatAi?.chatRegen?.alt}
                              />
                              <div>Regenerate response</div>
                            </div>
                            <div className="flex cursor-pointer gap-2 whitespace-nowrap">
                              <Image
                                src={
                                  siteSettings?.chatAi?.chatShare?.src ??
                                  productPlaceholder
                                }
                                width={15}
                                height={15}
                                alt={siteSettings?.chatAi?.chatShare?.alt}
                              />
                              <div>Share</div>
                            </div>
                          </div>
                          <div className="flex cursor-pointer gap-5">
                            <div
                              className={`like-light-btn ${
                                like ? 'hidden' : 'block'
                              }`}
                              onClick={(i) => {
                                setLike(!like);
                              }}
                            >
                              <Image
                                src={
                                  siteSettings?.chatAi?.chatLikel?.src ??
                                  productPlaceholder
                                }
                                width={15}
                                height={15}
                                alt={siteSettings?.chatAi?.chatLikel?.alt}
                              />
                            </div>

                            <div
                              className={`dark-like-btn ${
                                like ? '' : 'hidden'
                              }`}
                              onClick={() => setLike(!like)}
                            >
                              <Image
                                src={
                                  siteSettings?.chatAi?.chatLike?.src ??
                                  productPlaceholder
                                }
                                width={15}
                                height={15}
                                alt={siteSettings?.chatAi?.chatLike?.alt}
                              />
                            </div>
                            <div
                              className={`dislike-light-btn ${
                                dislike ? 'hidden' : 'block'
                              }`}
                              onClick={(i) => {
                                setDislike(!dislike);
                              }}
                            >
                              <Image
                                src={
                                  siteSettings?.chatAi?.chatDislikel?.src ??
                                  productPlaceholder
                                }
                                width={15}
                                height={15}
                                alt={siteSettings?.chatAi?.chatDislikel?.alt}
                              />
                            </div>

                            <div
                              className={`dark-dislike-btn ${
                                dislike ? '' : 'hidden'
                              }`}
                              onClick={() => setDislike(!dislike)}
                            >
                              <Image
                                src={
                                  siteSettings?.chatAi?.chatDisliked?.src ??
                                  productPlaceholder
                                }
                                width={15}
                                height={15}
                                alt={siteSettings?.chatAi?.chatDisliked?.alt}
                              />
                            </div>
                          </div>
                        </div>
                      </span>
                    </div>
                  );
              }
            })}
          </div>
        )}
        <div className="bg-gredient-dark flex w-full max-w-full flex-col">
          <div className="search-box mx-auto my-auto flex w-full flex-wrap items-center justify-between sm:w-full md:w-full lg:w-full xl:w-full">
            <div className="mt-7 flex w-full rounded-lg border  border-gray-400 bg-gray-100 focus:border-gray-900 active:bg-white">
              <div className="cursor-pointer px-3 pt-4 hover:bg-yellow-400">
                <Image
                  src={siteSettings?.chatAi?.chatMic?.src ?? productPlaceholder}
                  width={25}
                  height={30}
                  alt={siteSettings?.chatAi?.chatMic?.alt}
                />
              </div>
              <div className="flex h-auto w-full">
                <input
                  className="text-grey-darker h-auto w-full border border-gray-100 border-transparent bg-transparent p-4 text-lg font-medium text-gray-600 outline-none focus:border-transparent focus:ring-0
                    "
                  type="search"
                  placeholder="Ask me anything..."
                  onChange={handleInputCount}
                  value={message}
                  onKeyUp={HandleKeyUp}
                />
                <button
                  className="flex h-auto w-20 items-center justify-center rounded rounded-l-none  bg-black"
                  onClick={handleClick}
                >
                  {/* <SendComponent width="25" height="25" /> */}
                  <Image
                    src={
                      siteSettings?.chatAi?.chatSend?.src ?? productPlaceholder
                    }
                    width={25}
                    height={25}
                    alt={siteSettings?.chatAi?.chatSend?.alt}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-1 max-w-[842px] text-xs leading-5 tracking-wide text-gray-500">
            AI Engage may display inaccurate info, including about people, so
            double-check its responses.
          </div>
        </div>
      </div>
      <CartCounterButton />
    </>
  );
}

export default ChatBox;
