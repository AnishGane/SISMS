const Heading = ({ text1, text2 }: { text1: string; text2: string }) => {
  return (
    <div>
      <h1 className="text-primary text-2xl">{text1}</h1>
      <p className="text-secondary text-sm">{text2}</p>
    </div>
  );
};

export default Heading;
