import React from "react";

const Page = () => {
  return (
    <div className="container mx-auto p-8 h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-center mb-8">Terms and Conditions</h1>
      <p className="text-sm text-gray-600 mb-6">Effective Date: January 13, 2017</p>

      <div className="overflow-y-auto flex-grow pr-4">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-700">
            Welcome to [Company Name]. These terms and conditions outline the
            rules and regulations for the use of [Company Name]’s website,
            located at [Website Address].
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Intellectual Property Rights</h2>
          <p className="text-gray-700">
            Other than the content you own, under these Terms, [Company Name]
            and its licensors own all the intellectual property rights and
            materials contained in this Website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Restrictions</h2>
          <p className="text-gray-700 mb-4">You are specifically restricted from all of the following:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Publishing any Website material in any other media</li>
            <li>Selling, sublicensing and/or otherwise commercializing any Website material</li>
            <li>Using this Website in any way that is or may be damaging to this Website</li>
            <li>Using this Website in any way that impacts user access to this Website</li>
            <li>Using this Website contrary to applicable laws and regulations</li>
            <li>Engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website</li>
            <li>Using this Website to engage in any advertising or marketing</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Your Content</h2>
          <p className="text-gray-700">
            In these Website Standard Terms and Conditions, “Your Content” shall
            mean any audio, video text, images or other material you choose to
            display on this Website. By displaying Your Content, you grant
            [Company Name] a non-exclusive, worldwide irrevocable, sub-licensable
            license to use, reproduce, adapt, publish, translate and distribute it
            in any and all media.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Limitation of liability</h2>
          <p className="text-gray-700">
            In no event shall [Company Name], nor any of its officers, directors,
            and employees, be held liable for anything arising out of or in any
            way connected with your use of this Website whether such liability is
            under contract. [Company Name], including its officers, directors, and
            employees shall not be held liable for any indirect, consequential, or
            special liability arising out of or in any way related to your use of
            this Website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Indemnification</h2>
          <p className="text-gray-700">
            You hereby indemnify to the fullest extent [Company Name] from and
            against any and/or all liabilities, costs, demands, causes of action,
            damages, and expenses arising in any way related to your breach of any
            of the provisions of these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Severability</h2>
          <p className="text-gray-700">
            If any provision of these Terms is found to be invalid under any
            applicable law, such provisions shall be deleted without affecting the
            remaining provisions herein.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Variation of Terms</h2>
          <p className="text-gray-700">
            [Company Name] is permitted to revise these Terms at any time as it
            sees fit, and by using this Website you are expected to review these
            Terms on a regular basis.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Assignment</h2>
          <p className="text-gray-700">
            The [Company Name] is allowed to assign, transfer, and subcontract its
            rights and/or obligations under these Terms without any notification.
            However, you are not allowed to assign, transfer, or subcontract any
            of your rights and/or obligations under these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Entire Agreement</h2>
          <p className="text-gray-700">
            These Terms constitute the entire agreement between [Company Name] and
            you in relation to your use of this Website and supersede all prior
            agreements and understandings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Governing Law & Jurisdiction</h2>
          <p className="text-gray-700">
            These Terms will be governed by and interpreted in accordance with the
            laws of the State of [State], and you submit to the non-exclusive
            jurisdiction of the state and federal courts located in [State] for
            the resolution of any disputes.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Page;
