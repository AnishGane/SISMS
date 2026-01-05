const Heading = ({ text1, text2 }: { text1: string; text2: string }) => {
  return (
    <div>
      <h1 className="text-base-content text-xl font-medium">{text1}</h1>
      <p className="text-xs text-neutral-500/70">{text2}</p>
    </div>
  );
};

export default Heading;
