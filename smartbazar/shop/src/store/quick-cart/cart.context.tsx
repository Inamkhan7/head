import React, { useCallback } from 'react';
import { cartReducer, State, initialState } from './cart.reducer';
import { Item, inStock, getProduct } from './cart.utils';
import { useLocalStorage } from '@/lib/use-local-storage';
import {
  useCart as useCartHook,
  useAddItem,
  useUpdateItem,
  useDeleteItem,
  useClearCart,
} from '@/framework/cart';
import { CART_KEY } from '@/lib/constants';
import { authorizationAtom } from '@/store/authorization-atom';
import { useAtom } from 'jotai';
import { verifiedResponseAtom } from '@/store/checkout';
import { useModalAction } from '@/core/atoms/ui/modal/modal.context';

interface CartProviderState extends State {
  addItemToCart: (item: Item, quantity: number) => void;
  keepRemoteCart: () => void;
  mergeCarts: () => void;
  removeItemFromCart: (id: Item['id']) => void;
  clearItemFromCart: (id: Item['id']) => void;
  getItemFromCart: (id: Item['id']) => any | undefined;
  isInCart: (id: Item['id']) => boolean;
  isInStock: (id: Item['id']) => boolean;
  resetCart: () => void;
  keepLocalCart: () => Promise<void>;
}
export const cartContext = React.createContext<CartProviderState | undefined>(
  undefined
);

const isLocalSyncWithRemote = (localItems: Item[], remoteItems: Item[]) => {
  const _localItems = localItems
    .map(({ productId, quantity }) => `${productId}:${quantity}`)
    .sort()
    .join(';');
  const _remoteItems = remoteItems
    .map(({ productId, quantity }) => `${productId}:${quantity}`)
    .sort()
    .join(';');

  return _localItems === _remoteItems;
};

cartContext.displayName = 'CartContext';

export const useCart = () => {
  const context = React.useContext(cartContext);
  if (context === undefined) {
    throw new Error(`useCart must be used within a CartProvider`);
  }
  return React.useMemo(() => context, [context]);
};

type Addresses = {
  billing_address?: string;
  shipping_address?: string;
};

export const CartProvider: React.FC = (props) => {
  const [isAuthorized] = useAtom(authorizationAtom);
  const { addItem } = useAddItem();
  const { updateItem } = useUpdateItem();
  const { deleteItem } = useDeleteItem();
  const { clearCart } = useClearCart();
  const { authenticatedCart, isLoading } = useCartHook();
  const [addresses, setAddresses] = React.useState<Addresses>({});
  const [savedCart, saveCart] = useLocalStorage(
    CART_KEY,
    JSON.stringify(initialState)
  );
  const { closeModal, openModal } = useModalAction();

  const [state, dispatch] = React.useReducer(
    cartReducer,
    savedCart ? JSON.parse(savedCart) : initialState
  );

  React.useEffect(() => {
    const items = { ...localStorage };
    const localCartItems = JSON.parse(JSON.parse(items.cart)).items;
    if (isAuthorized && authenticatedCart) {
      setAddresses({
        billing_address: authenticatedCart.billing_address,
        shipping_address: authenticatedCart.shipping_address,
      });
      // if both, localstorage and remote carts are NOT empty = open merge modal
      if (
        localCartItems.length &&
        !authenticatedCart?.isEmpty &&
        !isLocalSyncWithRemote(localCartItems, authenticatedCart.items)
      ) {
        openModal('CART_MERGE');
      }
      // if localstorage cart IS empty, but remote cart is NOT empty = set remote items to local storage
      else if (!localCartItems.length && !authenticatedCart?.isEmpty) {
        dispatch({ type: 'SET_CART', state: authenticatedCart });
      }
      // if localstorage cart NOT empty, but remote cart is IS empty = add local storage items to remote
      else if (localCartItems.length && authenticatedCart?.isEmpty) {
        keepLocalCart();
      }
    }
  }, [isLoading, authenticatedCart, isAuthorized]);

  const [, emptyVerifiedResponse] = useAtom(verifiedResponseAtom);
  React.useEffect(() => {
    emptyVerifiedResponse(null);
  }, [emptyVerifiedResponse, state]);

  React.useEffect(() => {
    saveCart(JSON.stringify(state));
  }, [state, saveCart]);

  const addItemToCart = (item: Item, quantity: number) => {
    if (isAuthorized) {
      const cartItem = authenticatedCart?.items.find(
        (i) => i.productId === item.id
      );
      if (cartItem) {
        updateItem({
          id: cartItem.id,
          input: {
            ...item,
            quantity: (cartItem.quantity as number) + quantity,
          },
        });
      } else {
        addItem({ ...item, quantity });
      }
    }

    const itemInfo = {
      ...item,
      productId: item.productId || item.id,
    };
    dispatch({ type: 'ADD_ITEM_WITH_QUANTITY', item: itemInfo, quantity });
  };

  const keepLocalCart = useCallback(async () => {
    const items = { ...localStorage };
    const localCartItems = JSON.parse(JSON.parse(items.cart)).items;

    await clearCart();
    await Promise.all(localCartItems.map(addItem));
    closeModal();
  }, [addItem, clearCart]);

  const keepRemoteCart = useCallback(() => {
    if (authenticatedCart) {
      dispatch({ type: 'SET_CART', state: authenticatedCart });
      closeModal();
    }
  }, [authenticatedCart]);

  const mergeCarts = useCallback(async () => {
    const items = { ...localStorage };
    const localCartItems = JSON.parse(JSON.parse(items.cart)).items;

    if (localCartItems.length && authenticatedCart?.items) {
      localCartItems.map((item: Item) => {
        const remoteCartItem = authenticatedCart?.items.find(
          (i) => i.productId === item.id
        );

        if (remoteCartItem) {
          const quantitySum =
            (remoteCartItem.quantity as number) + (item.quantity as number);
          updateItem({
            id: remoteCartItem.id,
            input: {
              ...item,
              quantity: quantitySum,
            },
          });
          const itemInfo = {
            ...item,
            productId: item.id,
          };
          dispatch({
            type: 'ADD_ITEM_WITH_QUANTITY',
            item: itemInfo,
            quantity: remoteCartItem.quantity as number,
          });
        } else {
          addItem(item);
        }
      });

      authenticatedCart?.items
        .filter(
          (item) => !localCartItems.find((i: Item) => i.id === item.productId)
        )
        .map((item) => {
          const itemInfo = {
            ...item,
            productId: item.productId,
          };
          dispatch({
            type: 'ADD_ITEM_WITH_QUANTITY',
            item: itemInfo,
            quantity: item.quantity as number,
          });
        });

      closeModal();
    }
  }, [addItem, authenticatedCart?.items, closeModal, updateItem]);

  const removeItemFromCart = (id: Item['id']) => {
    if (isAuthorized) {
      const cartItem = authenticatedCart?.items.find((i) => i.productId === id);
      if (cartItem && (cartItem.quantity as number) > 1) {
        updateItem({
          id: cartItem.id,
          input: {
            ...cartItem,
            quantity: (cartItem.quantity as number) - 1,
          },
        });
      }

      if (cartItem && (cartItem.quantity as number) === 1) {
        deleteItem(cartItem.id as string);
      }
    }

    dispatch({ type: 'REMOVE_ITEM_OR_QUANTITY', id });
  };

  const clearItemFromCart = (id: Item['id']) => {
    if (isAuthorized) {
      deleteItem(id as string);
    }
    dispatch({ type: 'REMOVE_ITEM', id });
  };

  const isInCart = useCallback(
    (id: Item['id']) => !!getProduct(state.items, id),
    [state.items]
  );

  const getItemFromCart = useCallback(
    (id: Item['id']) => getProduct(state.items, id),
    [state.items]
  );

  const isInStock = useCallback(
    (id: Item['id']) => inStock(state.items, id),
    [state.items]
  );

  const resetCart = () => dispatch({ type: 'RESET_CART' });

  const value = React.useMemo(
    () => ({
      ...state,
      ...addresses,
      addItemToCart,
      keepRemoteCart,
      mergeCarts,
      keepLocalCart,
      removeItemFromCart,
      clearItemFromCart,
      getItemFromCart,
      isInCart,
      isInStock,
      resetCart,
    }),
    [getItemFromCart, isInCart, isInStock, keepRemoteCart, mergeCarts, state]
  );

  return <cartContext.Provider value={value} {...props} />;
};
