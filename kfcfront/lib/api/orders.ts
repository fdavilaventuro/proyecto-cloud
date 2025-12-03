import { API_BASE, authFetch, getToken } from '../auth'

export interface CreateOrderRequest {
    storeId: string
    client: {
        name: string
        phone: string
        email: string
    }
    address: string
    total: number
    items: Array<{
        id: number
        name: string
        quantity: number
        price: number
    }>
}

export interface OrderResponse {
    message: string
    orderId: string
    status: string
}

export interface OrderStatusResponse {
    orderId: string
    status: string
    createdAt: string
    updatedAt: string
    client: {
        name: string
        phone: string
        email: string
    }
    address?: string
    total: number
    items: Array<{
        id: number
        name: string
        quantity: number
        price: number
    }>
}

/**
 * Crea un nuevo pedido en el backend
 * Requiere autenticación JWT
 */
export async function createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    try {
        const response = await authFetch(`${API_BASE}/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Error al crear el pedido')
        }

        return await response.json()
    } catch (error) {
        console.error('Error creating order:', error)
        throw error
    }
}

/**
 * Consulta el estado de un pedido
 * Requiere autenticación JWT
 */
export async function getOrderStatus(orderId: string): Promise<OrderStatusResponse> {
    try {
        const response = await authFetch(`${API_BASE}/status?orderId=${orderId}`, {
            method: 'GET',
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Error al consultar el pedido')
        }

        return await response.json()
    } catch (error) {
        console.error('Error fetching order status:', error)
        throw error
    }
}
/**
 * Obtiene los pedidos del usuario actual
 * Requiere autenticación JWT
 */
export async function getMyOrders(email: string): Promise<OrderStatusResponse[]> {
    try {
        const response = await authFetch(`${API_BASE}/orders/mine?email=${encodeURIComponent(email)}`, {
            method: 'GET',
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Error al consultar pedidos')
        }

        return await response.json()
    } catch (error) {
        console.error('Error fetching my orders:', error)
        throw error
    }
}

/**
 * Verifica si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
    return !!getToken()
}
