export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4">
      <div className="container mx-auto text-center">
        <p>&copy; 2025 Coffee Roasters. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-4">
          <a href="#" className="hover:text-amber-400">Privacy Policy</a>
          <a href="#" className="hover:text-amber-400">Terms of Service</a>
          <a href="#" className="hover:text-amber-400">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}