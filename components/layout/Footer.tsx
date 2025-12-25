export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-white text-sm text-neutral-500 mt-20 relative z-10">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          <div>
            <div className="text-xl font-serif italic text-neutral-900">
              BuyHard
              <span className="text-neutral-400 not-italic text-sm">™</span>
            </div>
            <div className="mt-2 text-neutral-400">Buy more, think less.</div>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            <a href="#" className="hover:text-neutral-900 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-neutral-900 transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-neutral-900 transition-colors">
              Shipping
            </a>
            <a href="#" className="hover:text-neutral-900 transition-colors">
              Returns
            </a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-neutral-100 flex justify-between items-center text-xs">
          <div>© {year} BuyHard Inc.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-neutral-900">
              Privacy
            </a>
            <a href="#" className="hover:text-neutral-900">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
