export interface IProduct {
  id: string;
  image: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface IProductAttribute {
  id: string;
  name: string;
  detail: string;
}

export interface ICategory {
  id: string;
  title: string;
  // name: string;
}
