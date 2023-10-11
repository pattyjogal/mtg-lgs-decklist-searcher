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
    <main className="flex items-center justify-center flex-col space-y-8 p-8">
      <div className="text-center flex items-center flex-col space-y-4">
        <h1 className="text-4xl font-bold text-center">
          Dice Dojo Bulk Decklist Search
        </h1>
        <p className="max-w-xl">
          A utility to search a list of cards against the Dice Dojo online
          inventory.
        </p>

        <p className="max-w-xl">
          Enter the decklist in MTGA format. Omit blank lines and non-card items
          like &quot;Deck&quot; or &quot;Sideboard&quot;. Example:
        </p>
        <pre className="text-left w-fit bg-slate-100 p-3">
          2 Karn, the Great Creator
          <br />
          4 Snapcaster Mage
          <br />
          1 Lord Skitter, Sewer King
          <br />
        </pre>
        <p className="max-w-xl">
          Results will appear on the right or below; click on a card to be taken
          to the page where you can add it to your cart. Checkmarks are added on
          each click as a reminder that you already visited the page.
        </p>
      </div>
      <div className="container md:h-[728px] items-center flex md:space-x-8 max-md:space-y-8 max-md:flex-col bg-slate-300 p-8">
        <div className="flex max-md:w-full max-md:h-96 flex-col md:h-full grow space-y-8">
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
        <div className="h-full max-md:w-full flex basis-[18rem] flex-col shrink gap-4">
          {result && !isLoading && (
            <p className="font-bold">
              Found {result.length} of {cardInputList?.length} cards
            </p>
          )}
          {isLoading || (
            <div className="md:overflow-scroll">
              <ul className="">
                {result && result.length > 0
                  ? result.map((card) => (
                      <CardEntry key={card.id} card={card} />
                    ))
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
