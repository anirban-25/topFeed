import Navbar from "@/components/Navbar";
import Image from "next/image";
import React from "react";

const Page = () => {
  return (
    <div>
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

      {/* Privacy Policy Section */}
      <section className="py-16 px-4 md:px-20">
        <h2 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-[#55A3F8] to-[#7567D9]">
          Privacy Policy
        </h2>
        <div className="max-w-3xl mx-auto text-white shadow-lg rounded-lg p-8">
          <h3 className="text-xl font-semibold mb-4">
            1. Information We Collect
          </h3>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you
            create an account, submit a form, or communicate with us. This may
            include your name, email address, and any other information you
            choose to provide.
          </p>

          <h3 className="text-xl font-semibold mb-4">
            2. How We Use Your Information
          </h3>
          <p className="mb-4">
            We use the information we collect to provide, maintain, and improve
            our services, to communicate with you, and to comply with legal
            obligations.
          </p>

          <h3 className="text-xl font-semibold mb-4">3. Data Security</h3>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to
            protect the security of your personal information.
          </p>

          <h3 className="text-xl font-semibold mb-4">4. Your Rights</h3>
          <p className="mb-4">
            You have the right to access, correct, or delete your personal
            information. Please contact us if you wish to exercise these rights.
          </p>

          <h3 className="text-xl font-semibold mb-4">
            5. Changes to This Policy
          </h3>
          <p className="mb-4">
            We may update this privacy policy from time to time. We will notify
            you of any changes by posting the new privacy policy on this page.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Page;
