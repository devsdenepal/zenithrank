import {
  Terminal,
  Settings
} from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark px-6 py-3 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="text-primary flex items-center justify-center">
          <Terminal className="size-6" />
        </div>
        <h2 className="text-lg font-bold text-[#111418] dark:text-white">ZenithRank SEO Sandbox</h2>
      </div>
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium hover:text-primary text-[#111418] dark:text-gray-300 transition-colors">Modules</a>
          <a href="#" className="text-sm font-medium hover:text-primary text-[#111418] dark:text-gray-300 transition-colors">Resources</a>
          <a href="#" className="text-sm font-medium hover:text-primary text-[#111418] dark:text-gray-300 transition-colors">Community</a>
        </nav>
        <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2"></div>
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Settings className="size-5 text-gray-600 dark:text-gray-400" />
          </button>

          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCvfPVqPLRCAbSic11nIihvdgMrPZ8hXYiydP8WUO665Nwz5ZfigP2alEyJnOx0IXAinU_pnjc2D_EVcfXvWAtOkP_-sO80xrGTOqcs53OIouiwDwwmECsGr4FPzmJhsjV7vzuIgc-dMf16vc0uDu9gMJ6oUzaKXm8VkmmFjdPMzRdp87YEdSpHXZV2a5EypmcO0OXpnZptApO8ii7RtnSDf6Nu1TBpZmnN2KgFP3yz_U412Mg-fnJwnQjWXDOw6i3qUuq2_tQ7CDQ")' }}></div>
        </div>
      </div>
    </header>
  );
}

