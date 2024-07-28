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

        <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p>
          Welcome to TopFeed AI. These Terms and Conditions govern your use of our website and services. By accessing or using TopFeed AI, you agree to comply with and be bound by these terms. If you do not agree with these terms, please do not use our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Subscription Services</h2>
        <p>
          TopFeed AI operates on a subscription basis. By subscribing to our services, you agree to pay the subscription fees as outlined in your chosen plan. Subscription fees are billed in advance on a monthly or annual basis and are non-refundable except as provided in our refund policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Billing and Payment</h2>
        <p>
          You authorize TopFeed AI to charge the payment method provided for the subscription fees on a recurring basis. All payments must be made in advance. If we do not receive payment, your subscription may be suspended or terminated.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Cancellation and Refund Policy</h2>
        <p>
          You may cancel your subscription at any time by accessing your account settings or contacting us at support@topfeed.ai.
        </p>
        <ul className="list-disc list-inside mt-2">
          <li><strong>Same Day Cancellation:</strong> If you cancel your subscription on the same day of the transaction, you are eligible for a full refund. The refund will be processed within 7 business days.</li>
          <li><strong>Future Billing Cycles:</strong> Upon cancellation, you will not be charged for the next billing cycle. Your access to the services will continue until the end of the current billing cycle.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Account and Security</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Use of Services</h2>
        <p>
          You agree to use TopFeed AI services only for lawful purposes and in accordance with these Terms and Conditions. You agree not to:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>Use our services in any way that violates any applicable federal, state, local, or international law or regulation.</li>
          <li>Engage in any conduct that restricts or inhibits anyone&lsquo;s use or enjoyment of the services, or which, as determined by us, may harm TopFeed AI or users of the services.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Modifications to Services and Prices</h2>
        <p>
          TopFeed AI reserves the right to modify or discontinue, temporarily or permanently, the services (or any part thereof) with or without notice. Prices for all services are subject to change upon notice from us. Such notice may be provided at any time by posting the changes on our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
        <p>
          All content, features, and functionality on TopFeed AI, including but not limited to text, graphics, logos, and software, are the exclusive property of TopFeed AI and are protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from any of our content without our express written permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
        <p>
          In no event shall TopFeed AI, its directors, employees, or agents be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of the services or any content provided by the services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
        <p>
          These Terms and Conditions shall be governed and construed in accordance with the laws of India, without regard to its conflict of law principles.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
        <p>
          For any questions about these Terms and Conditions, please contact us at support@topfeed.ai.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms and Conditions</h2>
        <p>
          TopFeed AI reserves the right to update or modify these Terms and Conditions at any time without prior notice. Your continued use of the services after any changes indicates your acceptance of the new Terms and Conditions.
        </p>
      </section>

      <p className="mt-8 font-semibold">
        By using TopFeed AI, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
      </p>
    
      </main>

      <footer className="bg-gray-100 py-4 mt-20 w-full text-center">
        <p>&copy; 2024 TopFeed. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default TermsPage;
