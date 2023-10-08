import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

interface Product {
  name: string;
  lowestPrice: number;
  setUrlName: string;
  productUrlName: string;
  productLineUrlName: string;
  id: number;
}

export interface ProductResponse extends Product {
  storeLink: string;
}

const API_BASE_URL = "https://chicagolandgames.tcgplayerpro.com/api/catalog";
const UI_BASE_URL = "https://chicagolandgames.tcgplayerpro.com/catalog";


async function fetchData(cardName: String) {
  const data = {
    context: { productLineName: "Magic: The Gathering" },
    filters: { productName: cardName },
    from: 0,
    size: 24,
    sort: [{ field: "in-stock-price-sort", order: "desc" }],
  };
  const response = await axios.post(`${API_BASE_URL}/search`, data);

  if (response.data.products.totalItems > 0) {
    const product: Product = response.data.products.items.reduce(
      (a: Product, b: Product) => (a.lowestPrice < b.lowestPrice ? a : b)
    );
    return {
      ...product,
      storeLink: `${UI_BASE_URL}/${product.productLineUrlName}/${product.setUrlName}/${product.productUrlName}/${product.id}`,
    };
  }

  return null;
}

export async function GET(req: NextRequest) {
  const cardListParam = req.nextUrl.searchParams.get("cards");
  if (!cardListParam) {
    return NextResponse.json(
      { error: "Card list must be supplied." },
      { status: 400 }
    );
  }
  const cardList = cardListParam.split(",");
  const foundCards = await Promise.all(cardList.map(fetchData));
  return NextResponse.json({ cards: foundCards.filter((c) => c !== null) });
}
