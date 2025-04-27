import "./homeStore.css";
import {Suspense, lazy, useState} from "react";

function HomeStore() {
    const [selectedCar, setSelectedCar] = useState(null);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <>
            <div>
  <section className="relative">
    <div className="absolute z-10 hidden lg:block left-0 top-0 max-w-xs w-full h-full bg-indigo-100"></div>
    <div className="container mx-auto overflow-hidden">
      <div className="relative z-20 flex items-center justify-between px-4 py-5 bg-transparent">
        <div className="w-auto">
          <div className="flex flex-wrap items-center">
            <div className="w-auto mr-14">
              <a href="#">
                <img src="images/amlogo3.png" alt="logo" className="logo" />
              </a>
            </div>
            <div className="w-auto hidden lg:block">
              <ul className="flex items-center mr-16">
                <li className="mr-9 font-medium hover:text-gray-700">
                  <a href="#">How it works</a>
                </li>
                <li className="mr-9 font-medium hover:text-gray-700">
                  <a href="#">Onboarding</a>
                </li>
                <li className="mr-9 font-medium hover:text-gray-700">
                  <a href="#">Case Studies</a>
                </li>
                <li className="font-medium hover:text-gray-700">
                  <a href="#">Contact +91-7619514999</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="w-auto">
          <div className="flex flex-wrap items-center">
            <div className="w-auto hidden mr-5 lg:block">
              <div className="inline-block">
                <button
                  className="py-3 px-5 w-full hover:text-gray-700 font-medium rounded-xl bg-transparent transition ease-in-out duration-200"
                  type="button"
                >
                  Learn more
                </button>
              </div>
            </div>

            <div className="w-auto hidden lg:block">
              <div className="inline-block">
                <button
                  className="py-3 px-5 w-full font-semibold border hover:border-gray-300 rounded-xl focus:ring focus:ring-gray-50 bg-white hover:bg-gray-50 transition ease-in-out duration-200"
                  type="button"
                >
                  Book Free Demo
                </button>
              </div>
            </div>

            <div className="w-auto lg:hidden">
              <button onClick={() => setMobileNavOpen(!mobileNavOpen)}>
                <svg
                  className="text-indigo-600"
                  width="41"
                  height="41"
                  viewBox="0 0 56 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="56" height="56" rx="28" fill="currentColor" />
                  <path
                    d="M37 32H19M37 24H19"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-4/6 sm:max-w-xs z-50 ${
          mobileNavOpen ? 'block' : 'hidden'
        }`}
      >
        <div
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 bg-gray-800 opacity-80"
        ></div>
        <nav className="relative z-10 px-9 pt-8 bg-white h-full overflow-y-auto">
          <div className="flex flex-wrap justify-between h-full">
            <div className="w-full">
              <div className="flex items-center justify-between -m-2">
                <div className="w-auto p-2">
                  <a className="inline-block" href="#">
                    <img src="images/amlogo3.png" alt="logo" />
                  </a>
                </div>
                <div className="w-auto p-2">
                  <button onClick={() => setMobileNavOpen(false)}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 18L18 6M6 6L18 18"
                        stroke="#111827"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center py-16 w-full">
              <ul>
                <li className="mb-12">
                  <a href="#">How it works</a>
                </li>
                <li className="mb-12">
                  <a href="#">Onboarding</a>
                </li>
                <li className="mb-12">
                  <a href="#">Case Studies</a>
                </li>
                <li className="mb-12">
                  <a href="#">Contact +91-7619514999</a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col justify-end w-full pb-8">
              <div className="flex flex-wrap">
                <div className="w-full mb-3">
                  <div className="block">
                    <button
                      className="py-3 px-5 w-full hover:text-gray-700 font-medium rounded-xl bg-transparent transition ease-in-out duration-200"
                      type="button"
                    >
                      Learn More
                    </button>
                  </div>
                </div>

                <div className="w-full">
                  <div className="block">
                    <button
                      className="py-3 px-5 w-full font-semibold border hover:border-gray-300 rounded-xl focus:ring focus:ring-gray-50 bg-white hover:bg-gray-50 transition ease-in-out duration-200"
                      type="button"
                    >
                      Book Free Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </section>
</div>

        </>
    );
}

export default HomeStore;
