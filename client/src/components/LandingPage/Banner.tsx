const Banner = () => {
  return (
    <section className="w-full space-y-6 rounded-lg bg-gray-100/60 py-12">
      <div className="avatars mx-auto flex w-fit">
        <img
          src="/images/av_1.avif"
          className="size-14 rounded-full border-2 border-white object-cover"
          alt="av1"
        />
        <img
          src="/images/av_2.avif"
          className="z-10 -mt-1.5 -ml-4 size-14 rounded-full border-2 border-white object-cover"
          alt="av2"
        />
        <img
          src="/images/av_3.avif"
          className="-ml-4 size-14 rounded-full border-2 border-white object-cover"
          alt="av3"
        />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-[22px] font-semibold">Still have questions?</h1>
        <p className="text-lg text-neutral-600">
          Can't find the answer you're looking for? Please chat to our friendly team.
        </p>
      </div>
      <button className="btn text-base-100 btn-lg rounded-md bg-[#7F56D9] text-lg font-medium">
        Get in touch
      </button>
    </section>
  );
};

export default Banner;
