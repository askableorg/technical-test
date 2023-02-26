export const sortByPriceDesc = (productA : any, productB : any) : number => (productA.price < productB.price) ? 1 : -1
export const sortByPriceAsc = (productA : any, productB : any) : number => (productA.price > productB.price) ? 1 : -1
export const sortByCreatedDesc = (productA : any, productB : any) : number => (productA.created_at < productB.created_at) ? 1 : -1
export const sortByCreatedAsc = (productA : any, productB : any) : number => (productA.created_at > productB.created_at) ? 1 : -1