import { Product } from '../store/modules/products'

export declare function buyProducts(products: Product[], cb: () => void, errorCb: () => void): void
export declare function getProducts(cb: (products: Product[]) => void): void