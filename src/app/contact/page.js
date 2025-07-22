"use client";

import { FiMail, FiPhone } from "react-icons/fi";

export default function Contact() {
  return (
    <section className="w-full px-6 py-24">
      <h1 className="text-5xl md:text-6xl font-anton text-center text-gray-800 mb-20">
        Let’s Get in Touch
      </h1>

      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-20 items-start">
        {/* === Left Info === */}
        <div className="flex-1 space-y-14">
          <div className="flex items-start gap-4">
            <FiMail className="text-3xl text-sky-500 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                Email
              </h2>
              <a
                href="mailto:andrew.nf.smith@gmail.com"
                className="text-base text-gray-700 hover:text-sky-600 underline break-all"
              >
                andrew.nf.smith@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FiPhone className="text-3xl text-emerald-500 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                Phone
              </h2>
              <a
                href="tel:+16479377637"
                className="text-base text-gray-700 hover:text-emerald-600 underline"
              >
                647-937-7637
              </a>
            </div>
          </div>
        </div>

        {/* === Right Form === */}
        <form className="flex-1 w-full max-w-lg space-y-6 p-5 rounded-xl  bg-white/50 ">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-md bg-white border border-gray-300 text-sm shadow focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-md bg-white border border-gray-300 text-sm shadow focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Message
            </label>
            <textarea
              rows="4"
              required
              className="w-full px-4 py-3 rounded-md bg-white border border-gray-300 text-sm shadow resize-none focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-black hover:to-gray-700 text-white text-sm font-semibold py-3 rounded-md transition-all"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
