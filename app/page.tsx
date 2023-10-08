"use client";

import axios from "axios";
import { useState } from "react";
import { ProductResponse } from "./api/cardSearch/route";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

function getListFromTextInput(text: string) {
  return text
    .trim()
    .split("\n")
    .map((card) => {
      let [qty, ...rest] = card.split(" ");
      return rest.join(" ");
    });
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProductResponse[] | undefined>(
    undefined
  );
  const [cardInput, setCardInput] = useState("");
  const [cardInputList, setCardInputList] = useState<string[] | undefined>(
    undefined
  );

  async function searchCards() {
    const res = await axios.get("/api/cardSearch", {
      params: {
        cards: getListFromTextInput(cardInput).join(","),
      },
    });
    return res.data.cards;
  }

  return (
    <main className="flex items-center justify-center h-screen space-y-8">
      <div className="container w-1/2 h-2/3 items-center flex space-x-8 bg-slate-300 p-8">
        <div className="flex flex-col h-full space-y-8 w-3/5">
          <textarea
            onChange={(e) => {
              setCardInput(e.target.value);
            }}
            className="resize-none border rounded-md h-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
          <button
            onClick={async () => {
              try {
                setIsLoading(true);
                setCardInputList(getListFromTextInput(cardInput));
                setResult(await searchCards());
              } catch (e) {
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className="h-10 px-6 font-semibold rounded-full bg-slate-600 text-white"
          >
            {isLoading ? "Loading..." : "Search"}
          </button>
        </div>
        <div className="w-2/5 h-full flex flex-col shrink-0 gap-4">
          {result && (
            <p className="font-bold">
              Found {result.length} of {cardInputList?.length} cards
            </p>
          )}
          {isLoading || (
            <div className="overflow-scroll">
              <ul className="">
                {result && result.length > 0
                  ? result.map((card) => <CardEntry key={card.id} card={card} />)
                  : "No results found."}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

interface CardEntryProps {
  card: ProductResponse;
}
const CardEntry = ({ card }: CardEntryProps) => {
  const [clicked, setClicked] = useState<boolean>(false);

  return (
    <div className="bg-slate-400 mb-2 p-2">
      <a target="_blank" href={card.storeLink} onClick={() => setClicked(true)}>
        <li className="flex justify-between">
          <p>{card.name}</p>
          <span>{clicked && <FontAwesomeIcon icon={faCheck} />}</span>
        </li>
      </a>
    </div>
  );
};
