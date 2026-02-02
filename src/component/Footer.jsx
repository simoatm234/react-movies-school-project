import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-950 dark:text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="dark:text-white  text-2xl font-bold mb-4">BrandName</h2>
            <p className="text-sm leading-6">
              Making the world a better place through constructing elegant
              hierarchies.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Solutions
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Marketing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Analytics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Insights
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Guides
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  API Status
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">
            © {new Date().getFullYear()} BrandName, Inc. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {/* Replace # with social links */}
            <a href="#" className="hover:text-white text-sm">
              Twitter
            </a>
            <a href="#" className="hover:text-white text-sm">
              GitHub
            </a>
            <a href="#" className="hover:text-white text-sm">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
