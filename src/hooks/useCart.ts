'use client'

import { useCartStore } from '../store/cartStore'

export function useCart() {
  const store = useCartStore()

  return {
    items: store.items,
    totalItems: store.items.reduce((total, item) => total + item.quantity, 0),
    totalAmount: store.getCartTotal(),
    totalBv: store.getCartTotalBv(),
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
  }
}
