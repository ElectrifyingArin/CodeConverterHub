import { Link } from "wouter";

export function SiteFooter() {
  return (
    <footer className="mt-12 bg-white dark:bg-slate-800 py-6 border-t border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 12L8 7V17L14 12Z" fill="currentColor"/>
                <path d="M16 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="font-bold">SourceXchange</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Convert code between 15+ programming languages
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h4 className="text-sm font-semibold mb-2">Resources</h4>
              <ul className="space-y-1">
                <li>
                  <Link href="/documentation">
                    <a className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary">
                      Documentation
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/api">
                    <a className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary">
                      API Reference
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/examples">
                    <a className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary">
                      Examples
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Company</h4>
              <ul className="space-y-1">
                <li>
                  <Link href="/about">
                    <a className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary">
                      About
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/blog">
                    <a className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary">
                      Blog
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <a className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary">
                      Contact
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Legal</h4>
              <ul className="space-y-1">
                <li>
                  <Link href="/privacy">
                    <a className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary">
                      Privacy
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/terms">
                    <a className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary">
                      Terms
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-4 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} SourceXchange. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
