import Button from '../ui/Button';

const Banner = () => {
  return (
    <section className="bg-base-200 w-full space-y-6 rounded-lg py-12">
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
      <Button
        text="Get in Touch"
        title="Get in Touch"
        className="btn text-white px-3.5 btn-lg rounded-md bg-[#0082CE] text-lg font-normal mx-auto"
      />
    </section>
  );
};

export default Banner;
