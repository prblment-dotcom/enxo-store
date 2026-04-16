export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#222222] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-white font-black text-2xl uppercase tracking-widest">ENXO</p>
          <p className="text-gray-600 text-xs uppercase tracking-widest mt-1">Official Merch Store</p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex gap-6 text-gray-600 text-xs uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-gray-700 text-xs">&copy; {new Date().getFullYear()} Enxo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
