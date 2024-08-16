import { Box, Heading, Stack } from "@chakra-ui/react";
import Footer from "../../components/home/Footer";
import Header from "../../components/home/Header";
import { marginX } from "../../theme";

export default function PrivacyPolicy() {
  return (
    <Box className="gradient_bg_dark_to_light" minH="100vh">
      <Box marginX={marginX} color="white">
        <Header />
        <Stack>
          <Heading as="h1">Privacy Policy</Heading>
          <Box>
            This Privacy Policy describes how flipsourcer.com (the “Site” or
            “we”) collects, uses, and discloses your Personal Information when
            you visit or make a purchase from the Site.
          </Box>
          {/* COLLECTION PERSONAL INFORMATION */}
          <Heading as="h3" textAlign="left" fontSize="xl" pt={5}>
            Collecting Personal Information
          </Heading>
          <Box>
            When you visit the Site, we collect certain information about your
            device, your interaction with the Site, and information necessary to
            process your purchases. We may also collect additional information
            if you contact us for customer support. In this Privacy Policy, we
            refer to any information that can uniquely identify an individual
            (including the information below) as “Personal Information”. See the
            list below for more information about what Personal Information we
            collect and why.
          </Box>
          <Box as="u">Device information</Box>
          <ul className="ml-5">
            <li>
              Examples of Personal Information collected: version of web
              browser, IP address, time zone, cookie information, what sites or
              products you view, search terms, and how you interact with the
              Site.
            </li>
            <li>
              Purpose of collection: to load the Site accurately for you, and to
              perform analytics on Site usage to optimize our Site.
            </li>
            <li>
              Source of collection: Collected automatically when you access our
              Site using cookies, log files, web beacons, tags, or pixels.
            </li>
            <li>
              Disclosure for a business purpose: shared with our processor
              PayPal.
            </li>
          </ul>
          <Box as="u">Order information</Box>
          <ul className="ml-5">
            <li>
              Examples of Personal Information collected: name, billing address,
              shipping address, payment information (including credit card
              numbers), email address, and phone number.
            </li>
            <li>
              Purpose of collection: to provide products or services to you to
              fulfill our contract, to process your payment information, arrange
              for shipping, and provide you with invoices and/or order
              confirmations, communicate with you, screen our orders for
              potential risk or fraud, and when in line with the preferences you
              have shared with us, provide you with information or advertising
              relating to our products or services.
            </li>
            <li>Source of collection: collected from you.</li>
            <li>
              Disclosure for a business purpose: shared with our processor
              PayPal.
            </li>
          </ul>
          {/* MINORS */}
          <Heading as="h3" textAlign="left" fontSize="xl" pt={5}>
            Minors
          </Heading>
          <Box>
            The Site is not intended for individuals under the age of 18. We do
            not intentionally collect Personal Information from children. If you
            are the parent or guardian and believe your child has provided us
            with Personal Information, please contact us at the address below to
            request deletion.
          </Box>
          {/* SHARING PERSONAL INFORMATION */}
          <Heading as="h3" textAlign="left" fontSize="xl" pt={5}>
            Sharing Personal Information
          </Heading>
          <Box>
            We share your Personal Information with service providers to help us
            provide our services and fulfill our contracts with you, as
            described above. For example:
          </Box>
          <ul className="ml-5">
            <li>
              We may share your Personal Information to comply with applicable
              laws and regulations, to respond to a subpoena, search warrant or
              other lawful request for information we receive, or to otherwise
              protect our rights.
            </li>
          </ul>
          {/* BEHAVIORAL ADVERTISING */}
          <Heading as="h3" textAlign="left" fontSize="xl" pt={5}>
            Behavioral Advertising
          </Heading>
          <Box>
            As described above, we use your Personal Information to provide you
            with targeted advertisements or marketing communications we believe
            may be of interest to you. For example:
          </Box>
          <ul className="ml-5">
            <li>
              We use Google Analytics to help us understand how our customers
              use the Site. You can read more about how Google uses your
              Personal Information here:
              https://policies.google.com/privacy?hl=en.You can also opt-out of
              Google Analytics here: https://tools.google.com/dlpage/gaoptout.
            </li>
            <li>
              We use Facebook Analytics to help us understand how our customers
              use the Site. You can read more about how Facebook uses your
              Personal Information here:
              https://policies.google.com/privacy?hl=en.You can also opt-out of
              Google Analytics here: https://tools.google.com/dlpage/gaoptout.
            </li>
            <li>
              We share information about your use of the Site, your purchases,
              and your interaction with our ads on other websites with our
              advertising partners. We collect and share some of this
              information directly with our advertising partners, and in some
              cases through the use of cookies or other similar technologies
              (which you may consent to, depending on your location).
            </li>
          </ul>
          <Box>
            For more information about how targeted advertising works, you can
            visit the Network Advertising Initiative’s (“NAI”) educational page
            at
            http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work.
          </Box>
          <Box>You can opt out of targeted advertising by:</Box>
          <ul className="ml-5">
            <li>FACEBOOK - https://www.facebook.com/settings/?tab=ads</li>
            <li>GOOGLE - https://www.google.com/settings/ads/anonymous</li>
            <li>
              BING -
              https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads]
            </li>
          </ul>
          <Box>
            Additionally, you can opt out of some of these services by visiting
            the Digital Advertising Alliance’s opt-out portal at:
            http://optout.aboutads.info/.
          </Box>
          {/* USING PERSONAL INFORMATION */}
          <Heading as="h3" textAlign="left" fontSize="xl" pt={5}>
            Using Personal Information
          </Heading>
          <Box>
            We use your personal Information to provide our services to you,
            which includes: offering products for sale, processing payments,
            shipping and fulfillment of your order, and keeping you up to date
            on new products, services, and offers.
          </Box>
          {/* LAWFUL BASIS */}
          <h3 className="font-bold text-xl">Lawful basis</h3>
          <Box>
            Pursuant to the General Data Protection Regulation (“GDPR”), if you
            are a resident of the European Economic Area (“EEA”), we process
            your personal information under the following lawful bases:
          </Box>
          <ul>
            <li>Your consent;</li>
            <li>The performance of the contract between you and the Site;</li>
            <li>Compliance with our legal obligations;</li>
            <li>To protect your vital interests;</li>
            <li>To perform a task carried out in the public interest;</li>
            <li>
              For our legitimate interests, which do not override your
              fundamental rights and freedoms.
            </li>
          </ul>
          {/*RETENTION */}
          <Heading as="h3" textAlign="left" fontSize="xl" pt={5}>
            Retention
          </Heading>
          <Box>
            When you place an order through the Site, we will retain your
            Personal Information for our records unless and until you ask us to
            erase this information. For more information on your right of
            erasure, please see the ‘Your rights’ section below.
          </Box>
          {/* AUTOMATIC DECIAION-MAKING */}
          <Heading as="h3" textAlign="left" fontSize="xl" pt={5}>
            Automatic decision-making
          </Heading>
          <Box>
            If you are a resident of the EEA, you have the right to object to
            processing based solely on automated decision-making (which includes
            profiling), when that decision-making has a legal effect on you or
            otherwise significantly affects you.
          </Box>
          <Box>
            We DO NOT engage in fully automated decision-making that has a legal
            or otherwise significant effect using customer data.
          </Box>
          <Box>
            Our processor PayPal uses limited automated decision-making to
            prevent fraud that does not have a legal or otherwise significant
            effect on you.
          </Box>
          <Box>
            Services that include elements of automated decision-making include:
          </Box>
          <ul>
            <li>
              Temporary denylist of IP addresses associated with repeated failed
              transactions. This denylist persists for a small number of hours.
            </li>
            <li>
              Temporary denylist of credit cards associated with denylisted IP
              addresses. This denylist persists for a small number of days.
            </li>
          </ul>
          {/* YOUR RIGHTS */}
          <Heading as="h3" textAlign="left" fontSize="xl" pt={5}>
            Your rights
          </Heading>
          {/* GDPR */}
          <h3 className="font-bold text-xl">GDPR</h3>
          <Box>
            If you are a resident of the EEA, you have the right to access the
            Personal Information we hold about you, to port it to a new service,
            and to ask that your Personal Information be corrected, updated, or
            erased. If you would like to exercise these rights, please contact
            us through the contact information below.
          </Box>
          {/* CCPA */}
          <Heading as="h3" textAlign="left" fontSize="xl" pt={5}>
            CCPA
          </Heading>
          <Box>
            If you are a resident of California, you have the right to access
            the Personal Information we hold about you (also known as the ‘Right
            to Know’), to port it to a new service, and to ask that your
            Personal Information be corrected, updated, or erased. If you would
            like to exercise these rights, please contact us through the contact
            information below.
          </Box>
          <Box>
            If you would like to designate an authorized agent to submit these
            requests on your behalf, please contact us at the address below.
          </Box>
          {/* COOKIES */}
          <Heading as="h3" textAlign="left" fontSize="xl" pt={5}>
            Cookies
          </Heading>
          <Box>
            A cookie is a small amount of information that’s downloaded to your
            computer or device when you visit our Site. We use a number of
            different cookies, including functional, performance, advertising,
            and social media or content cookies. Cookies make your browsing
            experience better by allowing the website to remember your actions
            and preferences (such as login and region selection). This means you
            don’t have to re-enter this information each time you return to the
            site or browse from one page to another. Cookies also provide
            information on how people use the website, for instance whether it’s
            their first time visiting or if they are a frequent visitor.
          </Box>
          <Box>
            We use the following cookies to optimize your experience on our Site
            and to provide our services.
          </Box>
          {/* COOKIES NECESSARY FOR THE FUNCTION OF THE STORE */}
          <h3 className="font-bold text-xl">
            Cookies Necessary for the Functioning of the Store
          </h3>
          <table>
            <tr>
              <td>s</td>
              <td>Used for session validation</td>
            </tr>
            <tr>
              <td>c</td>
              <td>Used to check for cookie consent</td>
            </tr>
          </table>
          {/* REPORTING AND ANALYTICS */}
          <Heading as="h3" textAlign="left" fontSize="xl" pt={5}>
            Reporting and Analytics
          </Heading>
          <Box>
            The length of time that a cookie remains on your computer or mobile
            device depends on whether it is a “persistent” or “session” cookie.
            Session cookies last until you stop browsing and persistent cookies
            last until they expire or are deleted. Most of the cookies we use
            are persistent and will expire between 30 minutes and two years from
            the date they are downloaded to your device.
          </Box>
          <Box>
            You can control and manage cookies in various ways. Please keep in
            mind that removing or blocking cookies can negatively impact your
            user experience and parts of our website may no longer be fully
            accessible.
          </Box>
          <Box>
            Most browsers automatically accept cookies, but you can choose
            whether or not to accept cookies through your browser controls,
            often found in your browser’s “Tools” or “Preferences” menu. For
            more information on how to modify your browser settings or how to
            block, manage or filter cookies can be found in your browser’s help
            file or through such sites as www.allaboutcookies.org.
          </Box>
          <Box>
            Additionally, please note that blocking cookies may not completely
            prevent how we share information with third parties such as our
            advertising partners. To exercise your rights or opt-out of certain
            uses of your information by these parties, please follow the
            instructions in the “Behavioural Advertising” section above.
          </Box>
          {/* DO NOT TRACK */}
          <Heading as="h3" textAlign="left" fontSize="xl" pt={5}>
            Do Not Track
          </Heading>
          <Box>
            Please note that because there is no consistent industry
            understanding of how to respond to “Do Not Track” signals, we do not
            alter our data collection and usage practices when we detect such a
            signal from your browser.
          </Box>
          {/* CHANGES */}
          <Heading as="h3" textAlign="left" fontSize="xl" pt={5}>
            Changes
          </Heading>
          <Box>
            We may update this Privacy Policy from time to time in order to
            reflect, for example, changes to our practices or for other
            operational, legal, or regulatory reasons.
          </Box>
          {/* CONTACT */}
          <Heading as="h3" textAlign="left" fontSize="xl" pt={5}>
            Contact
          </Heading>
          <Box>
            For more information about our privacy practices, if you have
            questions, or if you would like to make a complaint, please contact
            us by e-mail at{" "}
            <span className="text-indigo-500">support@flipsourcer.com</span> or
            by mail using the details provided below:
          </Box>
          <Box>103 Bayside Rd, Bellingham WA, 98225</Box>
          <Box>Last updated: September 8th 2022</Box>
        </Stack>
        <Footer />
      </Box>
    </Box>
  );
}
