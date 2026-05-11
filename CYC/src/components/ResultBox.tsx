const ResultBox = ({ items }) => {
  return (
    <div className="flex w-full md-w-md justify-center flex-wrap border-t-2 border-t-white">
      {items.map((item, index) => (
        <div
          key={index}
          className={`m-2 p-3 mt-3 rounded-2xl font-bold text-white text-center uppercase ${item.OF === 1 ? "bg-red-500" : "bg-green-600"}`}
        >
          <p>{item.City}</p>
          <p>
            Trasa: <span>{item.Trasa}</span>
          </p>
          <p>
            Of: <span>{item.OF}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default ResultBox;
