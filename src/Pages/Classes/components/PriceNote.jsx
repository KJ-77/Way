// Currency disclaimer that sits at the very bottom of any page showing prices.
// Package cards render bare numbers ("200.00"), so this is what tells the user
// what currency they're looking at.
const PriceNote = () => (
  <p className="mt-12 lg:mt-16 text-center text-sm text-[#a6826e]">
    All prices are in USD
  </p>
);

export default PriceNote;
