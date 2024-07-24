import Navbar from "@/components/Navbar";
import Image from "next/image";
import React from "react";

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div>
        <div className="relative w-full -z-10 flex justify-center items-center top-0 mx-auto">
          <Image
            src="/images/bg-pattern.svg"
            height={100}
            width={1200}
            alt="bg"
            className="mx-auto absolute top-0"
          />
          <Image
            src="/images/ellipse-1.svg"
            height={100}
            width={600}
            alt="bg"
            className="mx-auto absolute left-0 -top-10 "
          />
          <Image
            src="/images/ellipse-2.svg"
            height={100}
            width={500}
            alt="bg"
            className="mx-auto absolute left-0 top-0 blur-md"
          />
          <Image
            src="/images/circle.png"
            height={100}
            width={800}
            alt="bg"
            className="mx-auto absolute left-36 top-0 "
          />
        </div>
        <div className="px-20">
          <Navbar />
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8 text-white">
        <h2 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-[#55A3F8] to-[#7567D9]">
          TopFeed Terms and Service
        </h2>

        <section className="mb-8 ">
          <h2 className="text-2xl font-semibold mb-4">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using TopFeed, you agree to be bound by these Terms
            of Service and all applicable laws and regulations. If you do not
            agree with any part of these terms, you may not use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
          <p>
            You agree to use TopFeed only for lawful purposes and in a way that
            does not infringe the rights of, restrict or inhibit anyone else's
            use and enjoyment of the website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Content</h2>
          <p>
            Users are solely responsible for the content they submit to TopFeed.
            We reserve the right to remove any content that violates these terms
            or is otherwise objectionable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Privacy</h2>
          <p>
            Your use of TopFeed is also governed by our Privacy Policy. Please
            review our Privacy Policy, which also governs the site and informs
            users of our data collection practices.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Changes to Terms</h2>
          <p>
            TopFeed reserves the right to modify these terms at any time. We
            will always post the most current version on our site. By continuing
            to use TopFeed after changes have been made, you agree to be bound
            by the revised terms.
          </p>
        </section>
      </main>

      <footer className="bg-gray-100 py-4 absolute -bottom-32 w-full text-center">
        <p>&copy; 2024 TopFeed. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default TermsPage;
