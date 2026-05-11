import ResultBox from "./components/ResultBox";
import { supabase } from "../utils/supabase";
import { useState, useEffect, useRef } from "react";

// do zrobienia
// zrobic mrozruznienie miedzy ofen a +1 zolty kolor albo pomarancz
interface DataRow {
  Postcode: string;
  City: string;
  Trasa: string;
  OF: number;
}

function App() {
  const [results, setResults] = useState<DataRow[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const inputRef = useRef(null);

  async function getData(searchingValue: string) {
    setHasSearched(false);
    const { data, error } = await supabase
      .from("Trasy")
      .select("*")
      .eq("Postcode", searchingValue);
    if (error) console.error(error.message);
    else if (data) {
      setResults(data as DataRow[]);
      setHasSearched(true);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // sprawdza czy pusta
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    let valueToSearch = trimmedValue;

    if (trimmedValue.length > 5) {
      const parsed = parseDirectionalCode(trimmedValue);
      setInputValue(parsed);
      valueToSearch = parsed;
    }

    getData(valueToSearch);
    inputRef.current.focus();
    inputRef.current.select();
  };
  const parseDirectionalCode = (directionalCode: string) => {
    if (!directionalCode) return "";
    // Szukamy albo 5 cyfr pod rząd, albo formatu 00-000
    const match = directionalCode.match(/\d{2}-\d{3}|\d{5}/);
    return match ? match[0] : "";
  };
  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      // Ustawiamy focus na polu input
      inputRef.current.focus();
      // Zaznaczamy zawartość pola input
      inputRef.current.select();
    }
  };
  useEffect(() => {
    // Dodajemy event listener do elementu body
    document.body.addEventListener("click", handleClickOutside);

    // Return funkcji usuwającej event listenera
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      // Dodano w-full i flex-col dla pewności, że focus działa wszędzie
      className="bg-amber-400 min-h-dvh w-full p-5 flex flex-col items-center "
    >
      <form
        onSubmit={handleSubmit}
        className="mainInput flex flex-col items-center justify-center pt-10 w-full max-w-lg "
      >
        <label
          htmlFor="postcode"
          className="text-black font-bold uppercase text-2xl text-center mb-6"
        >
          Wpisz Kod pocztowy / kierunkowy
        </label>

        {/* Kontener na input i przycisk */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <input
            id="postcode"
            type="text"
            ref={inputRef}
            value={inputValue}
            className="bg-white w-64 p-3 font-bold text-center text-2xl rounded-2xl shadow-md outline-none focus:ring-4 focus:ring-amber-500/50"
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 transition-transform active:scale-95 shadow-md px-8 py-3 rounded-2xl text-white font-bold cursor-pointer text-xl"
          >
            SPRAWDŹ
          </button>
        </div>
      </form>

      <div className="flex justify-center w-full mt-10">
        {results.length > 0 ? (
          <ResultBox items={results} />
        ) : hasSearched ? (
          <div className="text-black w w-full text-center p-4 mt-5 font-bold text-3xl border-t-2 border-t-white">
            Brak wyników dla podanego kodu!
          </div>
        ) : (
          <div className="text-white w-full opacity-50 border-t-2 border-t-white"></div>
        )}
      </div>
    </div>
  );
}

export default App;
